const   Campground  = require('../models/campground'),
        Comment     = require('../models/comments');

middlewareObj = {};

middlewareObj.isLoggedIn = function (req, res, next){
    if(req.isAuthenticated()){
        return next();
    };
    req.flash('error', 'You need to be logged in!')
    res.redirect('/login');
};

middlewareObj.checkCampgroundOwnership = function (req, res , next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, (err, foundData) => {
            if(err || !foundData){
                req.flash('error', 'No corresponding data found in the database!');
                res.redirect('/campgrounds');
            } else {     
                if(foundData.author.id.equals(req.user._id) || req.user.isAdmin){
                    //  the first one is a mongoose object, the second a string
                    //  use the mongoose method instead if standard ===
                    next();
                } else {
                    req.flash('error', 'You don\'t have permission to do that!');
                    res.redirect('/campgrounds');
                };
            };
        });
    } else {
        req.flash('error', 'You need to be logged in!');
        res.redirect('/campgrounds');
    }
};

middlewareObj.checkCommentOwnership = function (req, res , next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, (err, foundCommentData) => {
            if(err || !foundCommentData){
                req.flash('error', 'No corresponding comment found in the database!');
                res.redirect('back');
            } else {
                if(foundCommentData.author.id.equals(req.user._id) || req.user.isAdmin){
                    //  the first one is a mongoose object, the second a string
                    //  use the mongoose method instead if standard ===
                    next();
                } else {
                    req.flash('error', 'You don\'t have permission to do that!');
                    res.redirect('/campgrounds');
                };
            };
        });
    } else {
        req.flash('error', 'You need to be logged in!');
        res.redirect('/campgrounds');
    }
};

module.exports = middlewareObj;
