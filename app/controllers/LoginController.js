var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = {
    login(req, res){
        let body = req.body;
        User.findOne({ username: body.username}, (err, usr) => {
            if(err){
                return res.status(500).json({
                    code: 500,
                    error: err,
                });
            }
            if(!usr){
                return res.status(401).json({
                    code: 401,
                    error: {
                        msg: 'Unauthorized - Invalid User or Password',
                    },
                });
            }
    
            if( !bcrypt.compareSync(body.password, usr.password) ){
                return res.status(401).json({
                    code: 401,
                    error: {
                        msg: 'Unauthorized - Invalid User or Password',
                    },
                });
            }
    
            let token = jwt.sign({
                user: usr
            }, process.env.TOKEN_SEED, { expiresIn: process.env.TOKEN_DURATION })
    
            let t = jwt.decode(token);
    
            return res.json({
                data: usr,
                token,
                creation: t.iat,
                expires: t.exp,
            });
        });
    }
};