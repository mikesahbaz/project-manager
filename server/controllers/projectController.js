const db = require('../models/index');

const postProject = async function (ctx) {
  try {
    const project = await db.Project.create({
      firstName: ctx.request.body.firstName,
      lastName: ctx.request.body.lastName,
      username: ctx.request.body.username,
      password: ctx.request.body.password,
    });
    ctx.response.status = 201;
    ctx.response.body = project;
  } catch (error) {
    console.error(error);
    ctx.response.status = 500;
  }
}

const getProjectById = async function (ctx) {
  const userId = ctx.params.userId;
  const projectId = ctx.params.projectId;

  try {
    const user = await db.User.findOne({
      where: { id: userId },
      include: {
        model: db.Project
      }
    })  
  } catch (error) {
    console.error(error);
    ctx.response.status = 500;
  }
}