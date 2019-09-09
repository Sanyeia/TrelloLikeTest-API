const express = require('express');
const fileUpload = require('express-fileupload');
const { showOne, errorResponse, showAll } = require('../extra/responser');
const User = require('../models/User');
const paginate = require('../extra/paginate');

const app = express();
app.use(fileUpload({ parseNested: true }));

app.get('/', (req, res) => {
    let search = req.query.search;
    let query = {};
    if (search) {
        //create the regex for the query with the given search ignoring case
        search = new RegExp(search, 'i');
        query = {
            $or: [
                { 'name.firstname': search },
                { 'name.lastname': search },
                { username: search },
                { email: search }
            ]
        };
    }

    //query options
    let options = {
        select: 'name username photo email',
        sort: { username: 1 },
    };
    
    paginate(User, req.query, query, options)
    .then( (users) => {
        return showAll(res, users, 200);
    })
    .catch( (err) => {
        return errorResponse(res, err, 400);
    });
});

app.put('/:id', (req, res) => {
    let id = req.params.id;

    User.findByIdAndUpdate(id, {$set: req.body}, { new: true, runValidators: true, context: 'query' }, async (err, user) => {
        if (err) {
            return errorResponse(res, err, 400);
        }

        if (!user) {
            return errorResponse(res, 'User not found', 404);
        }

        if (Object.keys(req.files).length != 0 && req.files.image) {
            let url = updateFile('user', req.files.image, user.photo);

            if (url) {
                user.photo = url;
                await user.save();
            }
        }

        return showOne(res, user, 200);
    });
});

app.delete('/:id', (req, res) => {
    User.findById(req.params.id, (err, user) => {
        if (err) return errorResponse(res, err, 400);

        if (!user) return errorResponse(res, 'User not found', 404);

        user.remove((err, user) => {
            if (err) return errorResponse(res, err, 400);
            
            return showOne(res, user, 200);
        });
    });
});

module.exports = app;