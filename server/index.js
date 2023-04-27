require('dotenv').config({ path : __dirname + '/../.env'});
const Koa = require('koa');
const cors = require('@koa/cors');
const app = new Koa({ proxy: true });
const bodyParser = require('koa-bodyparser');
const router = require('./router');
const db = require('./models/index.js');
const { auth, admin, firebase } = require('../firebase.js');
app.use(cors());
app.use(bodyParser());

app.use(router.routes());

(async function bootstrap () {
  await db.sequelize.sync();
  app.listen(3001);
})();