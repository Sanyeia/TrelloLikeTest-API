const express = require('express');

const Task = require('../models/Task');
const { showOne, errorResponse } = require('../extra/responser');
const { createFile } = require('../extra/file_util');
const { checkToken } = require('../middlewares/auth');
const { filter } = require('../extra/filter_data');

const app = express();
app.use( fileUpload({parseNested: true}) );

app.post('/', (req, res) => {
    let body = req.body;
    let data = filter(body, Task);
    let task = new Task(data);

    task.save( async (err, task) => {
        if(err){
            return errorResponse(res, err, 400);
        }

        if ( Object.keys(req.files).length != 0 && req.files.image ) {
            let url = createFile('task', req.files.image);

            task.file = url;
            await task.save();
        }

        return showOne(res, task, 201);
    });
});

app.put('/:id', [checkToken], (req, res) => {
    let id = req.params.id;
    let body = filter(req.body, Task);

    Task.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query'}, async (err, task) => {
        if (err) {
            return errorResponse(res, err, 400);
        }

        if (!task) {
            return errorResponse(res, 'Task not found', 404);
        }

        if ( Object.keys(req.files).length != 0 && req.files.image ) {
            let url = updateFile('task', req.files.image, task.file);

            if(url){
                task.file = url;
                await task.save();
            }
        }

        return showOne(res, task, 200);
    });
});

app.delete('/:id', [checkToken], (req, res) => {
    let id = req.params.id;

    Task.deleteById(id, (err, task) => {
        if(err){
            return errorResponse(res, err, 400);
        }

        if(task == null){
            return errorResponse(res, 'Task not found', 404);
        }else{
            return showOne(res, task, 200);
        }

    });
});

module.exports = app;