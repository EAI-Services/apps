const Sequelize = require('sequelize');
const db = require('../database/db');

let CurrentLawn = db.define(
  'current_lawn',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    contractorId: {
      type: Sequelize.STRING(100),
      unique:true
    },
    name: Sequelize.STRING(100),
  }
);


module.exports = CurrentLawn ;