//.env config
require('./server/config/config');

/**
 * =============================
 * Imports
 * =============================
 */
const express = require('express')
const app = express()
const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
var pj = require('./package.json');

/**
 * =============================
 * Middleware
 * =============================
 */
//parse application/json
app.use(express.json());
//parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));


/**
 * =============================
 * Routes
 * =============================
 */
app.use( require('./server/routes/routes') );



/**
 * =============================
 * Database
 * =============================
 */
mongoose.connect(process.env.URL_DB, { useNewUrlParser: true }, (err, resp) => {
    if(err) throw err;
    console.log('Database online:',resp.name,'\n');
});


/**
 * =============================
 * Port
 * =============================
 */
app.listen(process.env.PORT, () => {
    console.log(pj.name,'ready, listening in port:', process.env.PORT);
});