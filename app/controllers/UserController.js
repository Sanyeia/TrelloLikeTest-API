const express = require('express');
const fileUpload = require('express-fileupload');
const { createFile } = require('../extra/file_util');
const { checkToken } = require('../middlewares/auth');
const { filter } = require('../extra/filter_data');
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

app.post('/', (req, res) => {
    let body = req.body;
    let data = filter(body, User);

    if (body.name) {
        data.name = {
            firstname: body.name.firstname,
            lastname: body.name.lastname
        };
    }

    let user = new User(data);

    user.save(async (err, user) => {
        if (err) {
            return errorResponse(res, err, 400);
        }

        if (Object.keys(req.files).length != 0 && req.files.image) {
            let url = createFile('user', req.files.image);

            user.photo = url;
            await user.save();
        }

        return showOne(res, user, 201);
    });
});

app.put('/:id', [checkToken], (req, res) => {
    let id = req.params.id;
    let body = filter(req.body, User);

    User.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, async (err, user) => {
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

app.delete('/:id', [checkToken], (req, res) => {
    let id = req.params.id;

    User.deleteById(id, (err, user) => {
        if (err) {
            return errorResponse(res, err, 400);
        }

        if (user == null) {
            return errorResponse(res, 'User not found', 404);
        } else {
            return showOne(res, user, 200);
        }

    });
});

module.exports = app;