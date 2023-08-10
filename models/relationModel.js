const CurrentSnow =require("./currentSnowModel")
const CurrentLawn=require("./currentLawnModel")
const MasterLawn=require("./masterLawnModel");
const MasterSnow=require("./masterSnowModel");
const Location=require("./locationModel");

const Relation = () => {
    CurrentSnow.hasMany(Location,{ onDelete: 'CASCADE' });
    Location.belongsTo(CurrentSnow );

    CurrentLawn.hasMany(Location,{ onDelete: 'CASCADE' });
    Location.belongsTo(CurrentLawn);

    MasterLawn.hasMany(Location,{ onDelete: 'CASCADE' });
    Location.belongsTo(MasterLawn);
    
    MasterSnow.hasMany(Location,{ onDelete: 'CASCADE' });
    Location.belongsTo(MasterSnow);
  
}
module.exports=Relation