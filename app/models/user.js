const   mongoose                = require('mongoose'),
        passportLocalMongoose   = require('passport-local-mongoose');

let UserSchema = new mongoose.Schema({
    username: String,
    password: String
});

UserSchema.plugin(passportLocalMongoose);

let User = mongoose.model('User', UserSchema);

module.exports = User;