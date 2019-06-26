//  ============
//  SCHEMA SETUP FOR CAMPGROUND DATA
//  ============
const mongoose = require('mongoose');

let commentSchema = new mongoose.Schema({
    text: String,
    author: {
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
            //  each request now has a user object: req.user
            //  with two properties: req.user.username and req.user.id        
        },
        username: String
    }
        //  we store part of the users data inside the comment instead of looking it
        //  up everytime a comment is called from the db. this can only be done in a
        //  non-relational db like Mongo 
});

let Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;