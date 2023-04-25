const db = require('../models/index');
const { sendEmailNotification } = require('../emailNotifications');

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

    for (const user of users) {
      await sendEmailNotification(user.email, ctx.request.body.name);
    }

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
  const firebaseUid = ctx.params.firebaseUid;

  try {
    const user = await db.User.findOne({
      where: { firebase_uid: firebaseUid },
      include: {
        model: db.Project,
        through: db.UserProject,
      },
      order: [[db.Project, 'createdAt', 'DESC']]
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

const getProjectById = async function (ctx) {
  const projectId = ctx.params.projectId;

  try {
    const project = await db.Project.findOne({
      where: { id: projectId },
      include: { model: db.User}
    });
    if (project) {
      ctx.response.status = 200;
      ctx.body = { project };

    } else {
      ctx.response.status = 404;
      ctx.body = { message: 'Project was not found' };
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

module.exports = { deleteProjectById, getProjectsByUser, postProject, getProjectById};