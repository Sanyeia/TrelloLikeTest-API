/**
 * =============================
 * Env
 * =============================
 */
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

/**
 * =============================
 * APP URL
 * =============================
 */
if(process.env.NODE_ENV === 'dev'){
    process.env.APP_URL = 'http://localhost:1337/';
}else{
    process.env.APP_URL = '';
}

/**
 * =============================
 * Port
 * =============================
 */
process.env.PORT = process.env.PORT || 1337;

/**
 * =============================
 * Token
 * =============================
 */
//Expires In
process.env.TOKEN_DURATION = '3 days'//(60 * 60 * 24 * 30); //30 days
//Token Seed
process.env.TOKEN_SEED = 'seed_de_desarrollo';


/**
 * =============================
 * Database
 * =============================
 */
// process.env.URL_DB = 'mongodb://{user}:{pass}@{host}:{port}/{bd}';
process.env.URL_DB = 'mongodb://localhost:27017/memtrainer';