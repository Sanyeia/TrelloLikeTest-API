//.env config
require('./server/config/config');

/**
 * =============================
 * Imports
 * =============================
 */
const express = require('express')
const mongoose = require('mongoose');
const pj = require('./package.json');
const cors = require('cors');

const app = express()

/**
 * =============================
 * Middleware
 * =============================
 */
//parse application/json
app.use(express.json());
//parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
//allow cors
app.use(cors());


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
mongoose.set('useCreateIndex', true);
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