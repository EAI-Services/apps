const Sequelize = require('sequelize');
const db = require('../database/db');

let Location = db.define(
  'location',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    location: Sequelize.STRING(255)
  }
);

module.exports = Location ;