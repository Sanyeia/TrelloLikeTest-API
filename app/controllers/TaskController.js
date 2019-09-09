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

        Task.find({ list: list_id })
            .findByTitle(req.query.search)
            .filterStatus(req.query.status)
            .sort('order')
            .exec(function (err, tasks) {
                if (err) return errorResponse(res, err, 400);

                //if the list is empty then the result is an empty array instead of null
                if (!tasks) tasks = [];

                return showOne(res, tasks, 200);
            });

    });
};

let searchTasks = (req, res) => {
    Task.find()
        .findByTitle(req.query.q)
        .sort('title')
        .exec((err, tasks) => {
            if (err) return errorResponse(res, err, 400);
            return showOne(res, tasks, 200);
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
        //if it fails it means that the id sent through the params is invalid
        try {
            data.list = mongoose.Types.ObjectId(list_id);
        } catch (error) { return errorResponse(res, 'Invalid list_id', 400); }

        //search for the actual order and add the new register to the bottom
        let count = await Task.countDocuments({ list: list_id });
        data.order = count + 1;

        let task = new Task(data);
        task.save(async (err, task) => {
            if (err) {
                return errorResponse(res, err, 400);
            }

            list.tasks.push(task._id);
            await list.save();

            return showOne(res, task, 201);
        });
    });
};

/**
 * ================
 * Resource Methods
 * ================
 */

app.get('/:id', (req, res) => {
    Task.findOne({ _id: req.params.id })
        .populate({
            path: 'users',
            select: '_id name username'
        })
        .exec((err, task) => {
            if (err) return errorResponse(res, err, 400);

            if (!task) return errorResponse(res, 'Task not found', 404);

            return showOne(res, task, 200);
        });
});

app.put('/:id', (req, res) => {
    let body = req.body;
    let options = { new: true, runValidators: true, context: 'query' };

    Task.findOneAndUpdate({ _id: req.params.id }, { $set: body }, options, (err, task) => {
        if (err) return errorResponse(res, err, 400);

        if (!task) return errorResponse(res, 'Task not found', 404);

        return showOne(res, task, 200);
    });
});

app.patch('/:id/assign', (req, res) => {
    let user_id = req.body.user_id;

    //1-assign 2-remove, by defualt the option is set to assign
    let action = req.body.action ? parseInt(req.body.action) : 1;

    if (!user_id || (action != 1 && action != 2)) {
        return errorResponse(res, 'invalid action - read the documentation and try again', 422);
    }

    //searchs the task by its id
    Task.findOne({ _id: req.params.id }, (err, task) => {
        if (err) return errorResponse(res, err, 400);

        if (!task) return errorResponse(res, 'Task not found', 404);

        //checks if the user with the given user_id exists
        User.findOne({ _id: user_id }, async (err, user) => {
            if (err) return errorResponse(res, err, 400);

            //if not error 404
            if (!user) return errorResponse(res, 'Invalid user', 404);

            let valid = task.users.includes(user._id);
            if(action === 1){
                //checks if the user is already assign to the task
                if (valid) return errorResponse(res, 'User already assigned to this task', 409);
                
                task.users.push(user._id);
            }else{
                if (!valid) return errorResponse(res, "User isn't assigned to this task", 409);
                //removes the user from the assigned attributte in the task
                task.users = task.users.filter(function(u_id){ return u_id == user._id });
            }

            await task.save();
            
            return showOne(res, task, 200);
        });
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
    searchTasks,
    resource: app
};