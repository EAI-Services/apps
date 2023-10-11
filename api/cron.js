const sequelize = require("../database/db");
const Relation = require("../models/relationModel");
const { deleteAllLawnCurrent, addBulkDataLawnCurrent } = require("../service/lawnCurrent")
const { getLawnMasterData } = require("../service/lawnMaster")

module.exports = async () => {
  try{
    Relation()
    sequelize.sync().then(async(result)=>{
    }).catch(error=>{
      console.log(error)
    })
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
    sendmail(mailOptions).then(e=>e).catch(e=>e)
  }
    catch (error) {
      console.log(error.message)
    }
};
