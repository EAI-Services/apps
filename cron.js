const { deleteAllLawnCurrent, addBulkDataLawnCurrent } = require("./service/lawnCurrent")
const { getLawnMasterData } = require("./service/lawnMaster")

  module.exports = async (req, res) => {
    try{
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