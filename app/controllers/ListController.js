const express = require('express');
const mongoose = require('mongoose');
const List = require('../models/List');
const User = require('../models/User');
const { showOne, errorResponse } = require('../extra/responser');
const { filter } = require('../extra/filter_data');

const app = express();

app.get('/', (req, res) => {
    List.findOne({ owner: req.user._id }, (err, lists) => {
        if (err) {
            return errorResponse(res, err, 400);
        }
        
        if (!lists) {
            lists = [];
        }
        
        return showOne(res, lists, 200);
    })
});

app.get('/:id/users', (req, res) => {
    List.findOne({ _id: req.params.id })
    .populate('users', 'name username photo email')
    .exec( (err, list) => {
        if (err) {
            return errorResponse(res, err, 400);
        }

        if (!list) return errorResponse(res, 'List not found', 404);
        
        return showOne(res, list.users, 200);
    });
});

app.get('/shared', (req, res) => {
    List.findOne({ users: req.user._id }, (err, lists) => {
        if (err) {
            return errorResponse(res, err, 400);
        }
        
        if (!lists) {
            lists = [];
        }
        
        return showOne(res, lists, 200);
    })
});

app.post('/', (req, res) => {
    let body = req.body;
    let data = filter(body, List);
    
    //try to create an ObjectId for the new object
    //if it fails it means that the id sent through the params is invalid
    try {
        data.owner = mongoose.Types.ObjectId(req.user._id);
    } catch (error) { return errorResponse(res, 'Invalid list_id', 400); }
    
    let list = new List(data);

    list.save((err, list) => {
        if (err) {
            return errorResponse(res, err, 400);
        }

        return showOne(res, list, 201);
    });
});

app.patch('/:id/share', (req, res) => {
    let body = req.body;
    if(!body.user_id || body.user == req.user._id){
        return errorResponse(res, 'invalid user to share', 422);
    }
    List.findOne({ _id: req.params.id }, (err, list) => {
        if (err) {
            return errorResponse(res, err, 400);
        }

        if (!list) {
            return errorResponse(res, 'List not found', 404);
        }

        User.findOne({ _id: body.user_id }, async (err, user) => {
            if (err) return errorResponse(res, err, 400);
            
            if (!user) return errorResponse(res, 'Invalid user', 404);

            //checks if the user is already on the list
            if( list.users.includes(user._id) ) return errorResponse(res, 'User already on the list', 409);

            list.users.push(user._id);
            await list.save();

            return showOne(res, list, 200);
        });
    });
});

app.put('/:id', (req, res) => {
    let id = req.params.id;
    let body = filter(req.body, List);

    List.findOneAndUpdate(id, {$set: body}, { new: true, runValidators: true, context: 'query' }, (err, list) => {
        if (err) return errorResponse(res, err, 400);

        if (!list) return errorResponse(res, 'List not found', 404);

        return showOne(res, list, 200);
    });
});

app.delete('/:id', (req, res) => {
    List.findById(req.params.id, (err, list) => {
        if (err) return errorResponse(res, err, 400);

        if (!list) return errorResponse(res, 'List not found', 404);

        list.remove((err, list) => {
            if (err) return errorResponse(res, err, 400);

            return showOne(res, list, 200);
        });
    });
});

module.exports = app;