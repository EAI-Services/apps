const Sequelize = require('sequelize');

const live = {
  db: process.env.DB,
  user: process.env.DB_USER,
  pass: process.env.DB_PW,
  host: process.env.DB_HOST
}
const sequelize = new Sequelize(live.db, live.user, live.pass, {
  host: live.host,
  dialect: 'mysql',
  dateStrings: true,
  logging: false,
  timezone: '-06:00',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

module.exports = sequelize;