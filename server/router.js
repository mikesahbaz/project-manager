const Router = require('koa-router');

const bugController = require('./controllers/bugController');
const projectController = require('./controllers/projectController');
const taskController = require('./controllers/taskController');
const userController = require('./controllers/userController');

const router = new Router();

//user routes
router.post('/login', userController.loginUser);
router.post('/logout', userController.logoutUser);
router.post('/register', userController.registerUser);

//project routes
router.post('/projects', projectController.postProject);
router.get('/users/:userId/projects', projectController.getProjectsByUser);
router.delete('/projects/:projectId', projectController.deleteProjectById);

//task routes
router.post('/projects/:projectId/tasks', taskController.postTask);
router.get('/projects/:projectId/tasks', taskController.getTasksByProject);
router.delete('/tasks/:taskId', taskController.deleteTask);

//bug routes
router.post('/bugs', bugController.postBug);
router.get('/tasks/:taskId/bugs', bugController.getBugByTask);
router.delete('/bugs/:bugId', bugController.deleteBug);




module.exports = router;
