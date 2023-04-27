const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');
require('dotenv').config({path: __dirname + '/./../../.env'});


const config = {
  host: 'localhost',
  dialect: 'postgres'
};

console.log(process.env)

const sequelize = new Sequelize(process.env.DATABASE_PROJECT_NAME, process.env.DATABASE_USER, process.env.DATABASE_PASSWORD, config);
const db = {};

const models = require('./model')(sequelize, Sequelize.DataTypes);

Object.keys(models).forEach((modelName) => {
  db[modelName] = models[modelName];
});



db.User.belongsToMany(db.Project, { through: db.UserProject });
db.Project.belongsToMany(db.User, { through: db.UserProject });

db.Project.hasMany(db.Task, { foreignKey: 'projectId' });
db.Task.belongsTo(db.Project, { foreignKey: 'projectId' });

db.Task.hasMany(db.Bug, { foreignKey: 'taskId' });
db.Bug.belongsTo(db.Task, { foreignKey: 'taskId' });

db.Task.hasMany(db.TimeLog, { foreignKey: 'taskId' });
db.TimeLog.belongsTo(db.Task, { foreignKey: 'taskId' });

try {
  sequelize.authenticate();
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;