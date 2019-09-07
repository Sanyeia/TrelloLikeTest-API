const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let ListSchema = new Schema({
    title: {
        type: String,
        required: [true, 'title is required'],
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
});

module.exports = mongoose.model('List', ListSchema);