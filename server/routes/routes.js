const express = require('express');
const app = express();
//accept form data with files
const fileUpload = require('express-fileupload');
//check auth
const { checkToken } = require('../../app/middlewares/auth');


/**
 * =============================
 * Controllers
 * =============================
 */
let imagesController = require('../../app/controllers/imagesController');
let LoginController = require('../../app/controllers/LoginController');
let UserController = require('../../app/controllers/UserController');

/**
 * =============================
 * Routes
 * =============================
 */
// images
app.get('/images/:type/:name', [checkToken], imagesController.getImage);


// login
app.post('/login', LoginController.login);
//register
app.post('/register', [checkToken], UserController.store);


app.get('/users', [checkToken], UserController.index);
app.put('/users/:id', UserController.update);
app.delete('/users/:id', [checkToken], UserController.remove);


module.exports = app;