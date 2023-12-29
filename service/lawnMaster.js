const MasterLawn = require('../models/masterLawnModel');
const Location = require('../models/locationModel');

async function getLawnMasterData() {
    const result=await MasterLawn.findAll({include:[Location]})

    if(result){
        
        const new_result = result.map(e=>e.dataValues)
        const final_result = new_result.map(resul=>({
            ...resul,
            locations:resul.locations.map((location) => location.location)
        }))
        return final_result
    }
    console.log(result[0].locations)
    return result
}
async function getLawnMasterDataByContractorId(contractorId) {
    const result=await MasterLawn.findOne({
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
async function addDataLawnMaster(data,locations) {
    const lawn_master=await MasterLawn.create(data)
    const bulk_locations=locations.map(e=>({location:e}))
    const location_added=await Location.bulkCreate(bulk_locations)
    await lawn_master.addLocations(location_added)
    return 
}

async function addLocationLawnMaster(id,location) {
    const lawn_master=await MasterLawn.findOne({where:{contractorId:id}})
    const location_added=await Location.create({location})
    await lawn_master.addLocation(location_added)
    return 
}

async function deleteLocationLawnMaster(id,location) {
    const lawn_master=await MasterLawn.findOne({where:{contractorId:id}})
    await Location.destroy({where:{masterLawnId:lawn_master.id,location}})
    return 
}

async function deleteLawnMaster(contractorId) {
    await MasterLawn.destroy({where:{
        contractorId
    }})
    return 
}

async function fillBulkDataLawnMaster(jsonData) {
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
        let current_lawn= await MasterLawn.findOne({where:{contractorId:dataa.contractorId}})
         let mapLocation=dataa.locations.map(e=>({...e,masterLawnId:current_lawn.id}))
         await Location.bulkCreate(mapLocation)
     }
    // console.log(mappedData)
        // await MasterLawn.bulkCreate(mappedData,{
        //     include:[Location],
        //     ignoreDuplicates: true
        // })
        return 
    }


module.exports = {
   getLawnMasterData,
   getLawnMasterDataByContractorId,
   addDataLawnMaster,
   deleteLawnMaster,
   addLocationLawnMaster,
   deleteLocationLawnMaster,
   fillBulkDataLawnMaster
}