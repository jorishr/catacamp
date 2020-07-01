const   Campground  = require('../models/campground');
module.exports = function (req, res , next){
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