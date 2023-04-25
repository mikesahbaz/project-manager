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
    ctx.response.body = { message: 'Internal Server Error at POST task'};
  }
}

const getTasksByProject = async function (ctx) {
  try {
    const tasks = await db.Task.findAll({
      where: {
        projectId: ctx.params.projectId,
      },
      order: [
        ['deadline', 'ASC']
      ]
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

const completeTask = async function (ctx) {
  try {
    const taskId = ctx.params.taskId;
    const task = await db.Task.findByPk(taskId);
    if (!task) {
      ctx.status = 404;
      ctx.body = { message: 'This task does not exist'};
      return;
    }
    const updatedTask = await task.update({ complete: true });
    ctx.status = 200;
    ctx.body = { message: 'Task was marked complete', task: updatedTask };
  } catch (error) {
    console.error(error);
    ctx.body = error;
    ctx.status = 500;
  }
}


module.exports = {postTask, getTasksByProject, deleteTask, completeTask};