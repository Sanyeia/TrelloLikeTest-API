const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

let Schema = mongoose.Schema;

let TaskSchema = new Schema({
    title: {
        type: String,
        required: [true, 'title is required'],
    },
    description: {
        type: String,
    },
    order: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        default: 1,
        enum: {
            //(Open, In-Progress, Completed, Archived)
            values: ['1', '2', '3', '4'],
            message: "{VALUE} isn't a valid"
        }
    },
    list: {
        type: Schema.Types.ObjectId,
        ref: 'List'
    },
    users: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
});


TaskSchema.statics.findByTitle = function (search, list_id) {
    //only tasks from the list and status different from 4 (Archived)
    let query = {
        list: list_id,
        status: {$ne: 4},
    };

    if (search) {
        //create the regex for the query with the given search ignoring case
        search = new RegExp(search, 'i');
        query.$or = [{ title: search }];
    }

    return this.find(query).sort('order');
};

module.exports = mongoose.model('Task', TaskSchema);