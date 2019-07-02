const   Campground  = require('../models/campground'),
        Comment     = require('../models/comments');

middlewareObj = {};

middlewareObj.isLoggedIn = function (req, res, next){
    if(req.isAuthenticated()){
        return next();
    };
    res.redirect('/login');
};

middlewareObj.checkCampgroundOwnership = function (req, res , next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, (err, foundData) => {
            if(err){
                res.redirect('back');
            } else {     
                if(foundData.author.id.equals(req.user._id)){
                    //  the first one is a mongoose object, the second a string
                    //  use the mongoose method instead if standard ===
                    next();
                } else {
                    res.redirect('back');
                };
            };
        });
    } else {
        res.redirect('back');
    }
};

middlewareObj.checkCommentOwnership = function (req, res , next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, (err, foundCommentData) => {
            if(err){
                res.redirect('back');
            } else {
                if(foundCommentData.author.id.equals(req.user._id)){
                    //  the first one is a mongoose object, the second a string
                    //  use the mongoose method instead if standard ===
                    next();
                } else {
                    res.redirect('back');
                };
            };
        });
    } else {
        res.redirect('back');
    }
};

module.exports = middlewareObj;
