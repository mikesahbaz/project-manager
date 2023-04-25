const Router = require('koa-router');

const bugController = require('./controllers/bugController');
const projectController = require('./controllers/projectController');
const taskController = require('./controllers/taskController');
const userController = require('./controllers/userController');
const timelogController = require('./controllers/timelogController');

const router = new Router();

//user routes
router.post('/login', userController.loginUser);
router.post('/logout', userController.logoutUser);
router.post('/register', userController.registerUser);
router.get('/users', userController.getAllUsers);

//project routes
router.post('/projects', projectController.postProject);
router.get('/users/:firebaseUid/projects', projectController.getProjectsByUser);
router.delete('/projects/:projectId', projectController.deleteProjectById);
router.get('/projects/:projectId', projectController.getProjectById);


//task routes
router.post('/projects/:projectId/tasks', taskController.postTask);
router.get('/projects/:projectId/tasks', taskController.getTasksByProject);
router.delete('/tasks/:taskId', taskController.deleteTask);
router.put('/tasks/:taskId/complete', taskController.completeTask);

//bug routes
router.post('/bugs', bugController.postBug);
router.get('/tasks/:taskId/bugs', bugController.getBugByTask);
router.delete('/bugs/:bugId', bugController.deleteBug);

//timelog routes
router.post('/timelog/:taskId', timelogController.postTimeLog)
router.get('/timelog/:taskId', timelogController.getTimelogsForTask);




module.exports = router;
