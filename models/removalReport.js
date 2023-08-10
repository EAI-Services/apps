const Sequelize = require('sequelize');
const db = require('../database/db');

let users = db.define(
  'Snow_Removal_Reports',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    visit: Sequelize.STRING(45),
    date: Sequelize.STRING(255),
    contractor: Sequelize.STRING(100),
    location: Sequelize.STRING(255),
    saltedParkingLot: Sequelize.BOOLEAN,
    saltedSidewalks: Sequelize.BOOLEAN,   
    plowedParkingLot: Sequelize.BOOLEAN,
    shoveledSidewalks: Sequelize.BOOLEAN,
    snow: Sequelize.STRING(45)
  }
);

// users.sync().then(function () {
//   // Table created
// });

module.exports = users;
