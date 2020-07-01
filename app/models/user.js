//  ============
//  SCHEMA SETUP FOR USER PROFILE DATA
//  ============
const   mongoose                = require('mongoose'),
        passportLocalMongoose   = require('passport-local-mongoose');

let UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    firstname: String,
    lastname: String,
    email: String,
    dateOfBirth: Date,
    isAdmin: {type: Boolean, default: false},
    resetPasswordToken: String,
    resetPasswordExpires: Date
});

let options = {
    errorMessages: {
        IncorrectPasswordError: 'Password is incorrect',
        IncorrectUsernameError: 'Username is incorrect or does not exist'
    }
};

UserSchema.plugin(passportLocalMongoose, options);

let User = mongoose.model('User', UserSchema);

module.exports = User;