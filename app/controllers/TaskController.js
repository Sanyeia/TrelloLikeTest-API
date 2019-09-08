const express = require('express');
const mongoose = require('mongoose');
const List = require('../models/List');
const User = require('../models/User');
const Task = require('../models/Task');
const { showOne, errorResponse } = require('../extra/responser');
const { filter } = require('../extra/filter_data');

const app = express();

/**
 * ================
 * Specific Methods
 * ================
 */
let listTasks = (req, res) => {
    let list_id = req.params.list;

    List.findOne({ _id: list_id }, (err, list) => {
        if (err) return errorResponse(res, err, 400);

        if (!list) return errorResponse(res, 'List not found', 404);

        Task.findByTitle(req.query.search, list_id)
        .then( (tasks) => {
            

            //if the list is empty then the result is an empty array instead of null
            if (!tasks) tasks = [];

            return showOne(res, tasks, 200);
        }).catch( (err) => {
            if (err) return errorResponse(res, err, 400);
        });
    });
};

let newTask = (req, res) => {
    let list_id = req.params.list;
    List.findOne({ _id: list_id }, async (err, list) => {
        if (err) return errorResponse(res, err, 400);

        if (!list) return errorResponse(res, 'List not found', 404);

        let body = req.body;
        let data = filter(body, Task);

        //try to create an ObjectId for the new object
        //if it fails it means that the id sended through the params is invalid
        try {
            data.list = mongoose.Types.ObjectId(list_id);
        } catch (error) { return errorResponse(res, 'Invalid list_id', 400); }

        //search for the actual order and add the new register to the bottom
        let count = await Task.countDocuments({ list: list_id });
        data.order = count + 1;

        let task = new Task(data);
        task.save((err, task) => {
            if (err) {
                return errorResponse(res, err, 400);
            }

            return showOne(res, task, 201);
        });
    });
};

/**
 * ================
 * Resource Methods
 * ================
 */

app.patch('/:id', (req, res) => {
    let body = req.body;
    let options = { new: true, runValidators: true, context: 'query'};

    Task.findOneAndUpdate({_id: req.params.id}, {$set: body}, options, (err, task) => {
        if (err) return errorResponse(res, err, 400);

        if (!task) return errorResponse(res, 'Task not found', 404);

        return showOne(res, task, 200);
    });
});

app.patch('/:id/assign', (req, res) => {
    let user_id = req.body.user_id;
    
    //if the user_id is not in the request or is the same user
    if(!user_id || user_id == req.user._id){
        return errorResponse(res, 'invalid user to assign', 422);
    }

    //finds the task by its id
    Task.findOne({ _id: req.params.id }, (err, task) => {
        if (err) return errorResponse(res, err, 400);

        if (!task) return errorResponse(res, 'Task not found', 404);

        //checks if the user with the given user_id exists
        User.findOne({ _id: user_id }, async (err, user) => {
            if (err) return errorResponse(res, err, 400);
            
            //if not error 404
            if (!user) return errorResponse(res, 'Invalid user', 404);

            //checks if the user is already assign to the task
            if( task.users.includes(user._id) ) return errorResponse(res, 'User already assigned to this task', 409);

            task.users.push(user._id);
            await task.save();

            return showOne(res, task, 200);
        });
    });
});

app.patch('/:id/order', (req, res) => {
    let user_id = req.body.user_id;
    
    //if the user_id is not in the request or is the same user
    if(!user_id || user_id == req.user._id){
        return errorResponse(res, 'invalid user to assign', 422);
    }

    Task.findOne({ _id: req.params.id }, async (err, task) => {
        if (err) return errorResponse(res, err, 400);

        if (!task) return errorResponse(res, 'Task not found', 404);

        task.users.push(user._id);
        await task.save();

        return showOne(res, task, 200);
    });
});

app.delete('/:id', (req, res) => {
    Task.findById(req.params.id, (err, task) => {
        if (err) return errorResponse(res, err, 400);

        if (!task) return errorResponse(res, 'Task not found', 404);

        task.remove((err, task) => {
            if (err) return errorResponse(res, err, 400);
            
            return showOne(res, task, 200);
        });
    });
});

module.exports = {
    newTask,
    listTasks,
    resource: app
};