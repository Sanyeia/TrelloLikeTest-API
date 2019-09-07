const express = require('express');
const app = express();

/**
 * =============================
 * Routes / Controllers
 * =============================
 */
// image route
app.use('/images', require('../../app/controllers/imagesController'));

// user routes
app.use('/login', require('../../app/controllers/LoginController'));
app.use('/user', require('../../app/controllers/UserController'));

module.exports = app;