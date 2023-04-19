module.exports = function defineAssociations({ User, Project, UserProject, Task, Bug }) {
  User.belongsToMany(Project, { through: UserProject });
  Project.belongsToMany(User, { through: UserProject });

  Project.hasMany(Task, { foreignKey: 'projectId' });
  Task.belongsTo(Project, { foreignKey: 'projectId' });
  
  Task.hasMany(Bug, { foreignKey: 'taskId' });
  Bug.belongsTo(Task, { foreignKey: 'taskId' });

}