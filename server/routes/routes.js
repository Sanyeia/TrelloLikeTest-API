const express = require('express');
const app = express();
const { checkToken } = require('../../app/middlewares/auth');

/**
 * =============================
 * Controllers
 * =============================
 */
let imagesController = require('../../app/controllers/imagesController');
let LoginController = require('../../app/controllers/LoginController');
let RegisterController = require('../../app/controllers/RegisterController');
let UserController = require('../../app/controllers/UserController');
let ListController = require('../../app/controllers/ListController');
let TaskController = require('../../app/controllers/TaskController');

/**
 * =============================
 * Routes
 * =============================
 */
// image route
app.use('/images', [checkToken], imagesController);

// user routes
app.use('/login', LoginController);
app.use('/register', RegisterController);
app.use('/user', [checkToken], UserController);

//task routes
app.post('/list/:list/task', [checkToken], TaskController.newTask);
app.get('/list/:list/task', [checkToken], TaskController.listTasks);
app.use('/task', [checkToken], TaskController.resource);

//list routes
app.use('/list', [checkToken], ListController);

module.exports = app;