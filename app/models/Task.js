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
    file: {
        type: String,
    },
    order: {
        type: Number,
        default: 0
    },
    status: {
        type: Number,
        default: 1,
        enum: {
            values: [1,2,3,4],
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

//autoincrement the order field
UserSchema.plugin(AutoIncrement, {inc_field: 'id'});

module.exports = mongoose.model('Task', TaskSchema);