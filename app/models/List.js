const mongoose = require('mongoose');
const Task = require('../models/Task');

let Schema = mongoose.Schema;

let ListSchema = new Schema({
    title: {
        type: String,
        required: [true, 'title is required'],
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    users: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
});

ListSchema.pre('remove', function(next) {
    Task.findOneAndDelete({list: this._id}, (err, tasks) => {
        if(err) next(err);

        next();
    });
});

module.exports = mongoose.model('List', ListSchema);