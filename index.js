const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const fileUpload = require('express-fileupload');
const jsonData = require('./data/snow/data.json');
const fs = require('fs');
require("dotenv").config();
const DotJson = require('dot-json');
const cors = require('cors')
const cron = require('node-cron');
const reportLawnService = require('./controllers/reportLawnService');
const reportSnowService = require('./controllers/reportSnowService');
const app = express();
const mail = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PW,
  },
});

let rq = 0, mailOptions;

app.use(fileUpload());
app.use(cors())
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

//----------*******-----------
//--------App Routes----------
//----------*******-----------
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.get("/snow", (req, res) => {
  res.sendFile(__dirname + "/views/snow/index.html");
});

app.get("/snow/login/:pw", (req, res) => {
  let pw = req.params.pw
  if (pw === process.env.PW) res.send('success')
  else res.send('failure')
});

app.get("/snow/subs/:subNum", (req, res) => {
  let subNum = req.params.subNum;
  let response = jsonData[subNum];
  console.log(response)
  res.status(200).json(response);
});

app.post("/snow/data", (req, res) => {
  mailOptions = {
    attachments: [],
    from: process.env.FROM,
    to: process.env.TO,
    subject: "Report of Work",
    text: ``,
  };
  let r = req.body;
  reportSnowService.createReport(r);
  mailOptions.text = `
    Visit Type : ${r.visit}
    Date : ${r.date}
    Contractor ID : ${r.contractor}
    Location : ${r.location}
    Salted Parking Lot : ${r.saltedParkingLot}
    Salted Sidewalks : ${r.saltedSidewalks}
    Plowed Parking Lot : ${r.plowedParkingLot}
    Shoveled Sidewalks : ${r.shoveledSidewalks}
    Snow Amount : ${r.snow}`;
});

app.post('/snow/uploadFiles', function(req, res) {
  if (!req.files || Object.keys(req.files).length === 0) {
    console.log('NO FILES!!!');
  }
  let file = req.files.file;
  file.name = `Pic` + rq
  file.mv(`./public/snow/images/Pic${rq}.jpg`, function(err) {
    if (err) console.log(err);
    console.log('File uploaded!');
  });
  rq++
});

app.get('/snow/mail', function(req, res) {
  let picArr = mailOptions.attachments;
  picArr[0] = { filename: 'image1.jpg', path: './public/snow/images/Pic0.jpg' };
  picArr[1] = { filename: 'image2.jpg', path: './public/snow/images/Pic1.jpg' };
  picArr[2] = { filename: 'image3.jpg', path: './public/snow/images/Pic2.jpg' };
  picArr[3] = { filename: 'image4.jpg', path: './public/snow/images/Pic3.jpg' };
  sendmail();
  rq = 0;
});

app.get('/snow/excel', reportSnowService.createExcel);

//----------*******-----------
//--------Server Fn's---------
//----------*******-----------

function sendmail() {
  mail.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent!");
    }
  });
}

//----------*******-----------
//-------Admin Routes---------
//----------*******-----------
let snowDataReader = () => {
  let rawdata = fs.readFileSync(__dirname + '/data/snow/data.json');
  return JSON.parse(rawdata);
};

app.get("/admin", (req, res) => {
  res.sendFile(__dirname + "/views/admin/index.html");
});

app.get("/snow/printData", (req, res) => {
  let data = snowDataReader()
  res.status(200).json(data);
});

app.post('/snow/newContractor', (req, res) => {
  let id = req.body.contractorID;
  let name = req.body.contractor;
  let locations = req.body.locations.split(', ');
  let data = snowDataReader()
  let newEntry = { name: name, locations: locations };
  data[id] = newEntry;
  fs.writeFileSync(__dirname + "/data/snow/data.json", JSON.stringify(data, null, 4));
  res.status(200).json(data);
});

app.post('/snow/deleteContractor', (req, res) => {
  let id = req.body.id;
  let data = snowDataReader()
  delete data[id];
  fs.writeFileSync(__dirname + "/data/snow/data.json", JSON.stringify(data, null, 4));
  res.status(200).json(data);
});
app.post('/snow/addLocation', (req, res) => {
  let id = req.body.id;
  let name = req.body.name;
  let data =snowDataReader()
  if (data[id] && data[id].locations) data[id].locations.push(name);
  fs.writeFileSync(__dirname + "/data/snow/data.json", JSON.stringify(data, null, 4));
  let changedData = snowDataReader()
  res.status(200).json(changedData);
});
app.post('/snow/deleteLocation', (req, res) => {
  let id = req.body.id;
  let name = req.body.name;
  let data = snowDataReader()
  if (data[id]) {
    let arr = data[id].locations;
    let index = arr.indexOf(name);
    if (index > -1) arr.splice(index, 1);
    fs.writeFileSync(__dirname + "/data/snow/data.json", JSON.stringify(data, null, 4));
  }
  res.status(200).json(data);
});




//merged
// const mail = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.MAIL_USER,
//     pass: process.env.MAIL_PW,
//   }
// });

// let rq = 0, mailOptions;


//----------*******-----------
//--------App Routes----------
//----------*******-----------
app.get("/lawn", (req, res) => {
  res.sendFile(__dirname + "/views/lawn/index.html");
});

app.get("/lawn/subs/:subNum", (req, res) => {
  let subNum = req.params.subNum;
  let rawdata = fs.readFileSync(__dirname + '/data/lawn/current.json');
  let data = JSON.parse(rawdata);
  let response = data[subNum];
  res.status(200).json(response);
});

app.get("/lawn/manual", (req, res) => {
  manual()
})

app.post("/lawn/data", (req, res) => {
  mailOptions = {
    attachments: [],
    from: process.env.FROM,
    to: process.env.TO,
    subject: "Lawn Care Report",
    text: ``,
  };
  let r = req.body;
  reportLawnService.createReport(r);
  mailOptions.text = `
    Date : ${r.date}
    Contractor ID : ${r.subNum}
    Contractor Name : ${r.contractor}
    Location : ${r.location}
    Mowed Grass : ${r.mowed}
    Used Blower : ${r.blowed}
    Weedeated : ${r.weedeated}
    Weed Control : ${r.weedControl}
  `;
  let rawdata = fs.readFileSync(__dirname + '/data/lawn/current.json');
  let data = JSON.parse(rawdata);
  let locsArr = data[r.subNum].locations;
    console.log(locsArr)
    let index = locsArr.indexOf(r.location);
  locsArr.splice(index, 1);
    console.log (locsArr)
   fs.writeFileSync(__dirname + "/data/lawn/current.json", 
  JSON.stringify(data, null, 4));
  console.log(JSON.stringify(data, null, 4))
});

app.post('/lawn/uploadFiles', function(req, res) {
  if (!req.files || Object.keys(req.files).length === 0) {
    console.log('NO FILES!!!');
  };
  let file = req.files.file;
  file.name = `Pic` + rq;
  file.mv(`./public/lawn/images/Pic${rq}.jpg`, function(err) {
    if (err) console.log(err);
  });
  rq++
});

// app.get('/mail', function(req, res) {
//   let picArr = mailOptions.attachments;
//   picArr[0] = { filename: 'image1.jpg', path: './public/uploads/Pic0.jpg' };
//   picArr[1] = { filename: 'image2.jpg', path: './public/uploads/Pic1.jpg' };
//   picArr[2] = { filename: 'image3.jpg', path: './public/uploads/Pic2.jpg' };
//   picArr[3] = { filename: 'image4.jpg', path: './public/uploads/Pic3.jpg' };
//   sendmail();
//   rq = 0;
// });

app.get('/lawn/excel', reportLawnService.createExcel);

//----------*******-----------
//--------Server Fn's---------
//----------*******-----------



//SCHEDULER
cron.schedule('55 23 * * 0', () => {
  manual();
}, {
    scheduled: true,
    timezone: "America/Chicago"
  }
);
cron.schedule('57 23 * * 0', () => {
  manual();
}, {
    scheduled: true,
    timezone: "America/Chicago"
  }
);
cron.schedule('59 23 * * 0', () => {
  manual();
}, {
    scheduled: true,
    timezone: "America/Chicago"
  }
);

function manual() {
  let theDate = new Date().toString()
  console.log('CRON JOB RAN AT ' + theDate)
  let mainData = JSON.parse(fs.readFileSync(__dirname + "/data/lawn/data.json"));
  fs.writeFileSync(__dirname + "/data/lawn/current.json", JSON.stringify(mainData, null, 4));
  let mailOptions = {
    attachments: [],
    from: process.env.FROM,
    to: "jdbriggs81@gmail.com",
    subject: "EAI Cron Job Ran",
    text: `The EAI cron job ran at ${theDate}`,
  };
  sendmail(mailOptions)
}

//----------*******-----------
//-------Admin Routes---------
//----------*******-----------
let lawnDataReader = () => {
  let rawdata = fs.readFileSync(__dirname + '/data/lawn/data.json');
  return JSON.parse(rawdata);
};

app.get("/lawn/printCurrent", (req, res) => {
  let rawdata = fs.readFileSync(__dirname + '/data/lawn/current.json');
  let data = JSON.parse(rawdata);
  console.log(data);
  res.status(200).json(data);
});
app.get("/lawn/printMain", (req, res) => {
  let data = lawnDataReader();
  console.log(data);
  res.status(200).json(data);
});

app.post('/lawn/newContractor', (req, res) => {
  let id = req.body.contractorID;
  let name = req.body.contractor;
  let locations = req.body.locations.split(', ');
  let data = lawnDataReader()
  let newEntry = { name: name, locations: locations };
  data[id] = newEntry;
  fs.writeFileSync(__dirname + "/data/lawn/data.json", JSON.stringify(data, null, 4));
  res.status(200).json(data);
});

app.post('/lawn/deleteContractor', (req, res) => {
  let id = req.body.id;
  let data = lawnDataReader()
  delete data[id];
  fs.writeFileSync(__dirname + "/data/lawn/data.json", JSON.stringify(data, null, 4));
  res.status(200).json(data);
});

app.post('/lawn/addLocation', (req, res) => {
  let id = req.body.id;
  let name = req.body.name;
  let data = lawnDataReader()
  if (data[id] && data[id].locations) data[id].locations.push(name);
  fs.writeFileSync(__dirname + "/data/lawn/data.json", JSON.stringify(data, null, 4));
  res.status(200).json(data);
});

app.post('/lawn/deleteLocation', (req, res) => {
  let id = req.body.id;
  let name = req.body.name;
  let data = lawnDataReader()
  if (data[id]) {
    let arr = data[id].locations;
    let index = arr.indexOf(name);
    if (index > -1) arr.splice(index, 1);
    fs.writeFileSync(__dirname + "/data/lawn/data.json", JSON.stringify(data, null, 4));
  }
  res.status(200).json(data);
});

app.get("*", (req, res) => {
  res.redirect('/');
});
// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});