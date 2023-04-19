const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');

const config = {
  host: 'localhost',
  dialect: 'postgres'
};

const sequelize = new Sequelize('project_management_tool', 'postgres', '1234', config);
const db = {};

const files = fs.readdirSync(__dirname);

for (const file of files) {
  if (file !== 'index.js') {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  }
}

try {
  sequelize.authenticate();
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;