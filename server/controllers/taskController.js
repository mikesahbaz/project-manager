const db = require('../models/index');

const postTask = async function (ctx) {
  try {
    const task = await db.Task.create({
      name: ctx.request.body.name,
      description: ctx.request.body.description,
      priority: ctx.request.body.priority,
      deadline: ctx.request.body.deadline,
      projectId: ctx.request.body.projectId,
    });
    ctx.response.status = 201;
    ctx.response.body = task;
    
  } catch (error) {
    console.error(error);
    ctx.response.status = 500;
  }
}

const getTasksByProject = async function (ctx) {
  try {
    
  } catch (error) {
    console.error(error);
    ctx.response.status = 500;
  }
}