var jwt = require('jsonwebtoken');

/**
 * =============================
 * Authentication Middleware
 * =============================
 */

//check token
let checkToken = (req, res, next) => {
    let token = req.header('Authorization');

    if(!token){
        return res.status(401).json({
            code: 401,
            error: 'Unauthorized'
        });
    }

    if(token.search('Bearer ') < 0){
        return res.status(401).json({
            code: 401,
            error: 'Unauthorized - Invalid authentication scheme'
        });
    }

    token = token.replace('Bearer ', '');

    jwt.verify(token, process.env.TOKEN_SEED, (err, decoded) => {
        if(err){
            return res.status(401).json({
                code: 401,
                error: 'Unauthorized - Invalid token'
            });
        }

        req.usuario = decoded.usuario;
        next();

    });
}

module.exports = {
    checkToken
};