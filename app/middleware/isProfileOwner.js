const User = require('../models/user');
module.exports = function (req, res , next){
    if(req.isAuthenticated()){
        User.findById(req.params.id, (err, foundUser) =>{
            if(err){
                console.log('\nError looking up user id:\n', err);
                req.flash('error', 'Something went wrong, try again.');
                res.redirect('back');
            } else {
                if(foundUser._id.equals(req.user._id) || req.user.isAdmin){
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
    };
};