const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const fileUpload = require('express-fileupload');
// const jsonData = require('./data/snow/data.json');
const fs = require('fs');
require("dotenv").config();
const sequelize = require("./database/db");
const DotJson = require('dot-json');
const cors = require('cors')
const cron = require('node-cron');
const Relation = require("./models/relationModel");
const reportLawnService = require('./service/reportLawnService');
const reportSnowService = require('./service/reportSnowService');
const { getSnowMasterData, addDataSnowMaster, deleteSnowMaster, addLocationSnowMaster, deleteLocationSnowMaster, fillBulkDataSnowMaster, fillBulkDataSnowCurrent, getSnowMasterDataByContractorId } = require("./service/snowMaster");
const { getLawnCurrentDataByContractorId, deleteLocationLawnCurrent, getLawnCurrentData, deleteAllLawnCurrent, addBulkDataLawnCurrent, fillBulkDataLawnCurrent } = require("./service/lawnCurrent");
const { getLawnMasterData, addDataLawnMaster, deleteLocationLawnMaster, deleteLawnMaster, addLocationLawnMaster, fillBulkDataLawnMaster } = require("./service/lawnMaster");
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
app.use(cors([
  'https://repl-merge.vercel.app'
]))
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
Relation()
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

app.get("/snow/subs/:subNum", async(req, res) => {
  try {
    let subNum = req.params.subNum;
  // let response = jsonData[subNum];
  let response = await getSnowMasterDataByContractorId(subNum);
  console.log(response)
  res.status(200).json(response);
  } catch (error) {
    res.json(error.message)
  }
  
});

app.post("/snow/data", (req, res) => {
  try {
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
  } catch (error) {
    res.json(error.message)
  }
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
let snowDataReader = async() => {
  try {
    let rawdata = await getSnowMasterData();
    return rawdata;
  } catch (error) {
    res.json(error.message)
  }
  // let rawdata = fs.readFileSync(__dirname + '/data/snow/data.json');
  // return JSON.parse(rawdata);
 
};

app.get("/admin", (req, res) => {
  res.sendFile(__dirname + "/views/admin/index.html");
});

app.get("/snow/printData", async(req, res) => {
  try {
    let data = await snowDataReader()
    res.status(200).json(data);
  } catch (error) {
    res.json(error.message)
  }
 
});

app.post('/snow/newContractor', async(req, res) => {
  try {
    let id = req.body.contractorID;
    let name = req.body.contractor;
    let locations = req.body.locations.split(', ');
    // let newEntry = { name: name, locations: locations };
    // data[id] = newEntry;
    await addDataSnowMaster({contractorId:id,name},locations)
    // fs.writeFileSync(__dirname + "/data/snow/data.json", JSON.stringify(data, null, 4));
    let data = await snowDataReader()
    res.status(200).json(data);
  } catch (error) {
    res.json(error.message) 
  }

});

app.post('/snow/deleteContractor', async(req, res) => {
  try {
    let id = req.body.id;
  await deleteSnowMaster(id)
  // delete data[id];
  // fs.writeFileSync(__dirname + "/data/snow/data.json", JSON.stringify(data, null, 4));
  let data = await snowDataReader()
  res.status(200).json(data);
  } catch (error) {
    res.json(error.message)
  }
  
});
app.post('/snow/addLocation', async(req, res) => {
  try {
    let id = req.body.id;
    let name = req.body.name;
    await addLocationSnowMaster(id,name)
    // if (data[id] && data[id].locations) data[id].locations.push(name);
    // fs.writeFileSync(__dirname + "/data/snow/data.json", JSON.stringify(data, null, 4));
    let data =await snowDataReader()
    res.status(200).json(data);
  } catch (error) {
    res.json(error.message)
  }

});
app.post('/snow/deleteLocation', async(req, res) => {
  try {
    let id = req.body.id;
  let name = req.body.name;
  console.log(id)
  await deleteLocationSnowMaster(id,name)
  let data = await snowDataReader()
  // if (data[id]) {
  //   let arr = data[id].locations;
  //   let index = arr.indexOf(name);
  //   if (index > -1) arr.splice(index, 1);
  //   fs.writeFileSync(__dirname + "/data/snow/data.json", JSON.stringify(data, null, 4));
  // }
  res.status(200).json(data);
  } catch (error) {
    res.json(error.message)
  }
  
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

app.get("/lawn/subs/:subNum", async(req, res) => {
  try {
    let subNum = req.params.subNum;
  // let rawdata = fs.readFileSync(__dirname + '/data/lawn/current.json');
  // let data = JSON.parse(rawdata);
  // let response = data[subNum];
  let response = await getLawnCurrentDataByContractorId(subNum);
  // console.log(response.locations)
  res.status(200).json(response);
  } catch (error) {
    res.json(error.message)
  }
  
});

app.get("/lawn/manual", (req, res) => {
  manual()
})

app.post("/lawn/data", async(req, res) => {
  try {
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
    // let rawdata = fs.readFileSync(__dirname + '/data/lawn/current.json');
    // let data = JSON.parse(rawdata);
    // let locsArr = data[r.subNum].locations;
    //   console.log(locsArr)
    //   let index = locsArr.indexOf(r.location);
    // locsArr.splice(index, 1);
    //   console.log (locsArr)
    //  fs.writeFileSync(__dirname + "/data/lawn/current.json", 
    // JSON.stringify(data, null, 4));
    // console.log(JSON.stringify(data, null, 4))
    await deleteLocationLawnCurrent(r.subNum,r.location)
  } catch (error) {
    res.json(error.message)
  }
  
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

async function manual() {
  let theDate = new Date().toString()
  console.log('CRON JOB RAN AT ' + theDate)
  // let mainData = JSON.parse(fs.readFileSync(__dirname + "/data/lawn/data.json"));
  let mainData = await getLawnMasterData()
  await deleteAllLawnCurrent()
  await addBulkDataLawnCurrent(mainData)
  // fs.writeFileSync(__dirname + "/data/lawn/current.json", JSON.stringify(mainData, null, 4));
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
let lawnDataReader = async() => {
  try {
    return await getLawnMasterData();
  } catch (error) {
    res.json(error.message)
  }
  // let rawdata = fs.readFileSync(__dirname + '/data/lawn/data.json');
  // return JSON.parse(rawdata);

};

app.get("/lawn/printCurrent", async(req, res) => {
  try {
     // let rawdata = fs.readFileSync(__dirname + '/data/lawn/current.json');
  // let data = JSON.parse(rawdata);
  let data =  await getLawnCurrentData();
  // console.log(data);
  res.status(200).json(data);
  } catch (error) {
    res.json(error.message) 
  }
 
});
app.get("/lawn/printMain", async(req, res) => {
  try {
    let data = await lawnDataReader();
    // console.log(data);
    res.status(200).json(data);
  } catch (error) {
    res.json(error.message)
  }

});

app.post('/lawn/newContractor', async(req, res) => {
  try {
    let id = req.body.contractorID;
    let name = req.body.contractor;
    let locations = req.body.locations.split(', ');
    // let newEntry = { name: name, locations: locations };
    // data[id] = newEntry;
    // fs.writeFileSync(__dirname + "/data/lawn/data.json", JSON.stringify(data, null, 4));
    await addDataLawnMaster({contractorId:id,name},locations)
    let data = await lawnDataReader()
    res.status(200).json(data);
  } catch (error) {
    res.json(error.message) 
  }
 
});

app.post('/lawn/deleteContractor', async(req, res) => {
  try {
    let id = req.body.id;

    await deleteLawnMaster(id)
    let data = await lawnDataReader()
    // delete data[id];
    // fs.writeFileSync(__dirname + "/data/lawn/data.json", JSON.stringify(data, null, 4));
    res.status(200).json(data);
  } catch (error) {
    
  }
 
});

app.post('/lawn/addLocation', async(req, res) => {
  try {
    let id = req.body.id;
    let name = req.body.name;
  
    // if (data[id] && data[id].locations) data[id].locations.push(name);
    // fs.writeFileSync(__dirname + "/data/lawn/data.json", JSON.stringify(data, null, 4));
    await addLocationLawnMaster(id,name)
    let data = await lawnDataReader()
    res.status(200).json(data);
  } catch (error) {
    res.json(error.message)
  }
 
});

app.post('/lawn/deleteLocation', async(req, res) => {
  try {
    let id = req.body.id;
    let name = req.body.name;
   
    // if (data[id]) {
    //   let arr = data[id].locations;
    //   let index = arr.indexOf(name);
    //   if (index > -1) arr.splice(index, 1);
    //   fs.writeFileSync(__dirname + "/data/lawn/data.json", JSON.stringify(data, null, 4));
    // }
    await deleteLocationLawnMaster(id,name)
    let data = await lawnDataReader()
    res.status(200).json(data);
  } catch (error) {
    res.json(error.message)
  }
 
});

app.get("*", (req, res) => {
  res.redirect('/');
});
// listen for requests :)
sequelize.sync().then(async(result)=>{
  let lawnCurrent = fs.readFileSync(__dirname + '/data/lawn/current.json');
  await fillBulkDataLawnCurrent(lawnCurrent)
  let lawnMaster = fs.readFileSync(__dirname + '/data/lawn/data.json');
  await fillBulkDataLawnMaster(lawnMaster)
  let snowMaster = fs.readFileSync(__dirname + '/data/snow/data.json');
  await fillBulkDataSnowMaster(snowMaster)
  let snowCurrent = fs.readFileSync(__dirname + '/data/snow/current.json');
  await fillBulkDataSnowCurrent(snowCurrent)
}).catch(error=>{
  console.log(error)
})
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
