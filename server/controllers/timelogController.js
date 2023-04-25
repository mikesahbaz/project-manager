const db = require('../models/index');

const postTimeLog = async function (ctx) {
  try {
    const { minutesSpent, taskId } = ctx.request.body;

    const timelog = await db.TimeLog.create({
      minutesSpent,
      taskId
    });

    ctx.response.body = timelog;
  } catch (error) {
    console.error(error);
    ctx.response.status = 500;
    ctx.response.body = { message: 'Internal server error at POST timelog'};
  }
}


const getTimelogsForTask = async function (ctx) {
  try {
    const { taskId } = ctx.params;

    const timelogs = await db.TimeLog.findAll({
      where: {
        taskId
      }
    });
    ctx.response.body = timelogs;
  } catch (error) {
    console.error(error);
    ctx.response.status = 500;
    ctx.response.body = { message: 'Internal server error at GET timelogs' };

  }
}

module.exports = {postTimeLog, getTimelogsForTask};