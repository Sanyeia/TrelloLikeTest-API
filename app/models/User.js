const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');
const mongooseHidden = require('mongoose-hidden')()
const uniqueValidator = require('mongoose-unique-validator');
const mongoosePaginate = require('mongoose-paginate-v2');
const bcrypt = require('bcryptjs');

let Schema = mongoose.Schema;

let UserSchema = new Schema({
    name: {
        firstname: {
            type: String,
            required: [true, 'firstname is required'],
        },
        lastname: {
            type: String,
            required: [true, 'lastname is required'],
        },
    },
    username: {
        type: String,
        unique: true,
        required: [true, 'username is required'],
    },
    email: {
        type: String,
        // unique: true,
        // required: [true, 'Email is required'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        required: [true, 'password is required'],
        //secure password validation
        // match: [
        //     /(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
        //     'the password must have: at least 8 characters, at least an upper case letter and at least a digit'
        // ]
    },
    photo: {
        type: String,
    },
    gender: {
        type: String,
        default: 'o',
        enum: {
            values: ['m', 'f', 'o'],
            message: "{VALUE} isn't a valid"
        }
    },
});

//get the user full name
UserSchema.virtual('full_name').get(() => {
    return this.name.firstname + ' ' + this.name.lastname;
});

//search function
UserSchema.query.searchUser = function (search) {
    //create the regex for the query with the given search ignoring case
    search = new RegExp(search, 'i');
    query = {
        $or: [
            { 'name.firstname': search },
            { 'name.lastname': search },
            { username: search },
            { email: search }
        ]
    };

    return this.where(query);
};

/**
 * =================
 * Plugins
 * =================
 */

//hidden attributes plugin, hide password when the user is returned
UserSchema.plugin(mongooseHidden, { hidden: { _id: false, password: true } });

//softdelete plugin
UserSchema.plugin(mongoose_delete, { overrideMethods: ['count', 'find', 'findOne', 'findOneAndUpdate', 'update'] });

//unique validation in this schema
UserSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser unico' });

//pagination plugin
UserSchema.plugin(mongoosePaginate);

/**
 * =================
 * Hooks
 * =================
 */

//hash password before save or update
UserSchema.pre('save', function (next) {
    // only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) {
        // hash the new password
        return next();
    }
    this.password = bcrypt.hashSync(this.password, 10);
    next();
});

module.exports = mongoose.model('User', UserSchema);