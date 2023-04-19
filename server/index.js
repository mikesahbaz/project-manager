const Koa = require('koa');
const app = new Koa({ proxy: true });
const bodyParser = require('koa-bodyparser');
// const router = require('./router');
const db = require('./models/model');

app.use(bodyParser());

// app.use(router.routes());

(async function bootstrap () {
  await db.sequelize.sync({force: true});
  app.listen(3000);
})();