const express = require('express');
const mongoose = require('mongoose');
const List = require('../models/List');
const { showOne, errorResponse } = require('../extra/responser');
const { filter } = require('../extra/filter_data');

const app = express();

app.get('/', (req, res) => {
    /**
     * this query is not paginated beacuse it's a small application right now 
     * so for now and for convinience all the resuls are returned
     */
    List.find()
    .populate({
        path: 'tasks',
        select: '_id title status'
    })
    .exec( (err, lists) => {
        if (err) {
            return errorResponse(res, err, 400);
        }

        if (!lists) {
            return showOne(res, [], 200);
        }

        return showOne(res, lists, 200);
    });
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


app.put('/:id', (req, res) => {
    let id = req.params.id;
    let body = filter(req.body, List);

    List.findOneAndUpdate(id, { $set: body }, { new: true, runValidators: true, context: 'query' }, (err, list) => {
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