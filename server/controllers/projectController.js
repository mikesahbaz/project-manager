const db = require('../models/index');

const postProject = async function (ctx) {
  try {
    const deadlineDate = new Date(parseInt(ctx.request.body.deadline, 10));
    const project = await db.Project.create({
      name: ctx.request.body.name,
      description: ctx.request.body.description,
      deadline: deadlineDate,
    });
    const userIds = ctx.request.body.userIds;
    const users = await db.User.findAll({
      where: { id: { [db.Sequelize.Op.in]: userIds } },
    });
    await project.addUsers(users);

    const projectWithUsers = await db.Project.findOne({
      where: { id: project.id },
      include: db.User,
    });

    ctx.response.status = 201;
    ctx.response.body = project;

  } catch (error) {
    console.error(error);
    ctx.response.body = error;
    ctx.response.status = 500;
  }
}

const getProjectsByUser = async function (ctx) {
  const userId = ctx.params.userId;
  const projectId = ctx.params.projectId;

  try {
    const user = await db.User.findOne({
      where: { id: userId },
      include: {
        model: db.Project,
        through: db.UserProject,
      }
    });
    
    if (user && user.projects.length > 0) {
      const projects = user.projects.map(project => project.dataValues);
      ctx.body = { projects };
    } else {
      ctx.response.status = 404;
      ctx.body = { message: 'The user currently has no projects' };
    }
    
  } catch (error) {
    console.error(error);
    ctx.response.status = 500;
    ctx.body = error;
  }
}

const deleteProjectById = async function (ctx) {
  const projectId = ctx.params.projectId;

  try {
    const project = await db.Project.findOne({
      where: { id: projectId },
    });
    if (project) {
      await project.destroy();
      ctx.response.status = 200;
      ctx.body = { message: 'The project was deleted successfully'};
    } else {
      ctx.response.status = 404;
      ctx.body = { message: 'Project not found' };
    }

  } catch (error) {
    console.error(error);
    ctx.response.status = 500;
    ctx.body = error;
  }
}

module.exports = { deleteProjectById, getProjectsByUser, postProject};