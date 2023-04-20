const db = require('../models/index');


const postBug = async function (ctx) {
  try {
    const bug = await db.Bug.create({
      name: ctx.request.body.name,
      description: ctx.request.body.description,
      priority: ctx.request.body.priority,
      taskId: ctx.request.body.taskId,
    })

    ctx.response.status = 201;
    ctx.response.body = bug;

  } catch (error) {
    console.error(error);
    ctx.response.status = 500;
  }
}

const getBugByTask = async function (ctx) {
  try {
    const bugs = await db.Bug.findAll({
      where: {
        taskId: ctx.params.taskId,
      }
    })
    
    ctx.status = 200;
    ctx.body = { bugs };

  } catch (error) {
    console.error(error);
    ctx.response.status = 500;
  }
}

const deleteBug = async function (ctx) {
  const bugId = ctx.params.bugId;
  try {
    const bug = await db.Bug.findOne({
      where: { id: bugId },
    });
    if (bug) {
      await bug.destroy();
      ctx.response.status = 200;
      ctx.body = { message: 'The bug was deleted'};
    } else {
      ctx.response.status = 404;
      ctx.body = { message: 'Bug was not found' };
    }

  } catch (error) {
    console.error(error);
    ctx.response.status = 500;
  }
}

module.exports = {postBug, getBugByTask, deleteBug};