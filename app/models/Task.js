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

//search function
TaskSchema.statics.findByTitle = function (search, list_id) {
    //only tasks from the list
    let query = { list: list_id };
    if (search) {
        //create the regex for the query with the given search ignoring case
        search = new RegExp(search, 'i');
        query.$or = [{ title: search }];
    }

    return this.find(query).sort('order');
};

//query helper that filters tasks by status
TaskSchema.query.filterStatus = function (status) {
    let query = {};
    status = parseInt(status);
    //only if the parameter is sent and the status is an integer between 1 and 4
    if (status && (status >= 1 && status <= 4) ) {
        //only tasks with the given status
        query.status = status;
    } else {
        //by default returns only tasks with status different from 4 (Archived)
        query.status = { $ne: 4 };
    }
    console.log(status,query);    
    return this.where(query);
};

module.exports = mongoose.model('Task', TaskSchema);