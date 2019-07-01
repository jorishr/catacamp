const Campground = require('../models/campground');

middlewareObj = {};

middlewareObj.isLoggedIn = function (req, res, next){
    if(req.isAuthenticated()){
        return next();
    };
    res.redirect('/login');
};

middlewareObj.checkOwnership = function (req, res , next){
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
    };
};

module.exports = middlewareObj;
