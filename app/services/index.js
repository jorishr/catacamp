//instantiate the services for each model here
const   Campground        = require('../models/campground'),
        Comment           = require('../models/comments'),
        User              = require('../models/user'),
        CampgroundService = require('./campground');
        CommentService    = require('./comment'),
        UserService       = require('./user');

const campgroundService = new CampgroundService(Campground);
const commentService    = new CommentService(Comment);
const userService       = new UserService(User);

module.exports = {
    campgroundService,
    commentService,
    userService
}