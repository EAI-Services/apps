const CurrentSnow = require('../models/currentSnowModel');
const MasterSnow = require('../models/masterSnowModel');
const Location = require('../models/locationModel');

async function getSnowMasterData() {
    const result=await MasterSnow.findAll({include:[Location]})
    if(result){
        
        const new_result = result.map(e=>e.dataValues)
        const final_result = new_result.map(resul=>({
            ...resul,
            locations:resul.locations.map((location) => location.location)
        }))
       
        return final_result
    }
    return result
}
async function getSnowMasterDataByContractorId(contractorId) {
    const result=await MasterSnow.findOne({
        where:{contractorId},
        include:[Location]
    })
    if(result){
        const new_result = result.dataValues
        const locations = new_result.locations.map((location) => location.location);
        new_result.locations = locations;
        return new_result
    }
    return result
}
async function addDataSnowMaster(data,locations) {
    const snow_master=await MasterSnow.create(data)
    const bulk_locations=locations.map(e=>({location:e}))
    const location_added=await Location.bulkCreate(bulk_locations)
    await snow_master.addLocations(location_added)
    return 
}

async function addLocationSnowMaster(id,location) {
    const snow_master=await MasterSnow.findOne({where:{contractorId:id}})
    const location_added=await Location.create({location})
    await snow_master.addLocation(location_added)
    return 
}

async function deleteLocationSnowMaster(id,location) {
   const snow_master=await MasterSnow.findOne({where:{contractorId:id}})
   await Location.destroy({where:{masterSnowId:snow_master?.id,location}})
   return 
}

async function deleteSnowMaster(contractorId) {
    await MasterSnow.destroy({where:{
        contractorId
    }})
    return 
}
async function fillBulkDataSnowMaster(jsonData) {
    const mappedData = [];
    const data = JSON.parse(jsonData);
    Object.keys(data).forEach((key) => {
      const obj = {
        contractorId: key,
        name: data[key].name,
        locations: []
      };
      
      data[key].locations.forEach((location) => {
        obj.locations.push({ location: location});
      });
      mappedData.push(obj);
    });
    for(let dataa of mappedData){
        let current_lawn= await MasterSnow.findOne({where:{contractorId:dataa.contractorId}})
         let mapLocation=dataa.locations.map(e=>({...e,masterSnowId:current_lawn.id}))
         await Location.bulkCreate(mapLocation)
     }
        // await MasterSnow.bulkCreate(mappedData,{
        //     include:[Location],
        //     ignoreDuplicates: true
        // })
        return 
    }

async function fillBulkDataSnowCurrent(jsonData) {
    const mappedData = [];
const data = JSON.parse(jsonData);
Object.keys(data).forEach((key) => {
  const obj = {
    contractorId: key,
    name: data[key].name,
    locations: []
  };
  
  data[key].locations.forEach((location) => {
    obj.locations.push({ location: location});
  });
    
      mappedData.push(obj);
    });
    for(let dataa of mappedData){
        let current_lawn= await CurrentSnow.findOne({where:{contractorId:dataa.contractorId}})
         let mapLocation=dataa.locations.map(e=>({...e,currentSnowId:current_lawn.id}))
         await Location.bulkCreate(mapLocation)
     }
        // await CurrentSnow.bulkCreate(mappedData,{
        //     include:[Location],
        //     ignoreDuplicates: true
        // })
        return 
    }


module.exports = {
   getSnowMasterData,
   getSnowMasterDataByContractorId,
   addDataSnowMaster,
   deleteSnowMaster,
   addLocationSnowMaster,
   deleteLocationSnowMaster,
   fillBulkDataSnowMaster,
   fillBulkDataSnowCurrent
}