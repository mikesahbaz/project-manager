const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');

const config = {
  host: 'localhost',
  dialect: 'postgres'
};

const sequelize = new Sequelize('project_management_tool', 'postgres', '1234', config);
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

try {
  sequelize.authenticate();
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;