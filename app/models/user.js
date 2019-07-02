const   mongoose                = require('mongoose'),
        passportLocalMongoose   = require('passport-local-mongoose');

let UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    isAdmin: {type: Boolean, default: false}
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