const CurrentLawn = require('../models/currentLawnModel');
const Location = require('../models/locationModel');

async function getLawnCurrentData() {
    const result=await CurrentLawn.findAll({include:[Location]})
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

async function getLawnCurrentDataByContractorId(contractorId) {
    const result=await CurrentLawn.findOne({
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

async function addDataLawnCurrent(data,locations) {
    const lawn_current=await CurrentLawn.create(data)
    const bulk_locations=locations.map(e=>({location:e}))
    const location_added=await Location.bulkCreate(bulk_locations)
    await lawn_current.addLocations(location_added)
    return 
}

async function addBulkDataLawnCurrent(data) {
    
     await CurrentLawn.bulkCreate(data,{
        include:[Location],
        ignoreDuplicates: true
    })
    return 
}

async function addLocationLawnCurrent(id,location) {
    const lawn_current=await CurrentLawn.findOne({where:{contractorId:id}})
    const location_added=await Location.create({location})
    await lawn_current.addLocation(location_added)
    return 
}

async function deleteLocationLawnCurrent(id,location) {
    const lawn_current=await CurrentLawn.findOne({where:{contractorId:id}})
    await Location.destroy({where:{currentLawnId:lawn_current.id,location}})
    return 
}

async function deleteLawnCurrent(contractorId) {
    await CurrentLawn.destroy({where:{
        contractorId
    }})
    return 
}

async function deleteAllLawnCurrent() {
    await CurrentLawn.destroy({where:{}})
    return 
}

async function fillBulkDataLawnCurrent(jsonData) {
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
   let current_lawn= await CurrentLawn.findOne({where:{contractorId:dataa.contractorId}})
    let mapLocation=dataa.locations.map(e=>({...e,currentLawnId:current_lawn.id}))
    await Location.bulkCreate(mapLocation)
}

// console.log(mappedData)
//     await CurrentLawn.bulkCreate(mappedData,{
//         include:[Location],
//         ignoreDuplicates: true
//     })
    return 
}


module.exports = {
   getLawnCurrentData,
   getLawnCurrentDataByContractorId,
   addDataLawnCurrent,
   deleteLawnCurrent,
   addLocationLawnCurrent,
   deleteLocationLawnCurrent,
   deleteAllLawnCurrent,
   addBulkDataLawnCurrent,
   fillBulkDataLawnCurrent
}