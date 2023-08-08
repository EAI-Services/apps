const Sequelize = require('sequelize');
const db = require('../database/db');

let users = db.define(
  'LawnCare_Reports',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    date: Sequelize.STRING(255),
    contractor: Sequelize.STRING(100),
    location: Sequelize.STRING(255),
    mowed: Sequelize.BOOLEAN,
    blowed: Sequelize.BOOLEAN,   
    weedeated: Sequelize.BOOLEAN,
    weedControl: Sequelize.BOOLEAN,
  }
);

users.sync().then(function () {
  // Table created
});

module.exports = users;