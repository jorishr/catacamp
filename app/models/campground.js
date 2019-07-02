//  ============
//  SCHEMA SETUP FOR CAMPGROUND DATA
//  ============
const mongoose = require('mongoose');

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

let Campground = mongoose.model('Campground', campgroundSchema);

module.exports = Campground;

/* Campground.create(
    {name: 'Salmon Creek', image: 'images/2164766085.png', description: 'Test'},
    (err, savedData) => {
            //  the second argument is the data object written to the db
            //  name it what you want
        if (err) {return console.error(err);}
        else {return console.log('Succesfully saved:\n', savedData)}
    }
); */
