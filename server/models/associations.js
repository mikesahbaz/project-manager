module.exports = function defineAssociations({ User, Project, UserProject, Task, Bug, TimeLog }) {
  User.belongsToMany(Project, { through: UserProject });
  Project.belongsToMany(User, { through: UserProject });

  Project.hasMany(Task, { foreignKey: 'projectId' });
  Task.belongsTo(Project, { foreignKey: 'projectId' });
  
  Task.hasMany(Bug, { foreignKey: 'taskId' });
  Bug.belongsTo(Task, { foreignKey: 'taskId' });

  TimeLog.belongsTo(Task, { foreignKey: 'taskId' });
  Task.hasMany(TimeLog, { foreignKey: 'taskId' });

}