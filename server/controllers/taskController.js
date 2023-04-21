const db = require('../models/index');

const postTask = async function (ctx) {
  const projectId = ctx.params.projectId;
  try {
    const task = await db.Task.create({
      name: ctx.request.body.name,
      description: ctx.request.body.description,
      priority: ctx.request.body.priority,
      deadline: ctx.request.body.deadline,
      projectId: ctx.params.projectId,
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
    const tasks = await db.Task.findAll({
      where: {
        projectId: ctx.params.projectId,
      }
    });
    ctx.status = 200;
    ctx.body = { tasks };

  } catch (error) {
    console.error(error);
    ctx.response.status = 500;
  }
}

const deleteTask = async function (ctx) {
  const taskId = ctx.params.taskId;
  try {
    const task = await db.Task.findOne({
      where: { id: taskId },
    });
    if (task) {
      await task.destroy();
      ctx.response.status = 200;
      ctx.body = { message: 'The task was deleted'};
    } else {
      ctx.response.status = 404;
      ctx.body = { message: 'Task was not found' };
    }
    
  } catch (error) {
    console.error(error);
    ctx.response.status = 500;
  }
}


module.exports = {postTask, getTasksByProject, deleteTask};