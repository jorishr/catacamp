//  ============
//  SCHEMA SETUP FOR CAMPGROUND DATA
//  ============
const mongoose = require('mongoose');
const Comment = require('./comments');

let campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    price: String,
    location: String,
    lat: Number,
    lng: Number,
    createdAt: {type: Date, default: Date.now},
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        username: String
    },
    comments: [
        {   //  data association, see seeds.js
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ]
});

campgroundSchema.pre('remove', async function(next){
    console.log('\nStarting pre-hook\n');
    try {
        await Comment.remove({
            "_id": {
                $in: this.comments
    //  this refers to the campground object the remove method is called upon
    //  comments that are referenced in the comments array of the campground object will be deleted
            }
        });
        next();
    } 
    catch(err){
        next(err);
    }
});

let Campground = mongoose.model('Campground', campgroundSchema);

module.exports = Campground;