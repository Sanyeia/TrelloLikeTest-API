const express = require('express');
const List = require('../models/List');
const { showOne, errorResponse } = require('../extra/responser');
const { checkToken } = require('../middlewares/auth');
const { filter } = require('../extra/filter_data');

const app = express();
app.use( fileUpload({parseNested: true}) );

app.post('/', (req, res) => {
    let body = req.body;
    let data = filter(body, List);
    let list = new List(data);

    list.save( async (err, list) => {
        if(err){
            return errorResponse(res, err, 400);
        }

        return showOne(res, list, 201);
    });
});

app.put('/:id', [checkToken], (req, res) => {
    let id = req.params.id;
    let body = filter(req.body, List);

    List.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query'}, async (err, list) => {
        if (err) {
            return errorResponse(res, err, 400);
        }

        if (!list) {
            return errorResponse(res, 'List not found', 404);
        }

        return showOne(res, list, 200);
    });
});

app.delete('/:id', [checkToken], (req, res) => {
    let id = req.params.id;

    List.deleteById(id, (err, list) => {
        if(err){
            return errorResponse(res, err, 400);
        }

        if(list == null){
            return errorResponse(res, 'List not found', 404);
        }else{
            return showOne(res, list, 200);
        }

    });
});

module.exports = app;