const   express     = require('express'),
        router      = express.Router(),
        User        = require('../models/user'),
        Campground  = require('../models/campground'),
        middleware  = require('../middleware');

//  ==============
//  PROFILE ROUTES
//  ==============

//  public profile route

router.get('/:id', (req, res, next) => {
    User.findById(req.params.id, (err, foundUser) => {
        if(err){err.shouldRedirect = true; return next(err);};
        Campground.find()
            .where('author.username')
            .equals(foundUser.username)
            .exec((err, foundCampgrounds) => {
                if(err){err.shouldRedirect = true; return next(err);};
                res.render('users/show', {userData: foundUser, campgroundData: foundCampgrounds});
            });
    });
});

//  edit profile route

router.get('/:id/edit', middleware.isProfileOwner, (req, res, next) =>{
    User.findById(req.params.id, (err, foundUser) => {
        if(err){err.shouldRedirect = true; return next(err);};
        res.render('users/edit', {userData: foundUser});
    });
});

//  update profile route

router.put('/:id', middleware.isProfileOwner, (req, res, next) => {
    User.findByIdAndUpdate(
        req.params.id, 
        req.body.profile, 
        (err, updatedUser) => {
            if(err){err.shouldRedirect = true; return next(err);};
            console.log('\nProfile update success!\n\n', updatedUser);
            req.flash('success', 'Profile updated successfully!');
            res.redirect(`/user/${req.params.id}`);
        }
    );
});

//  delete user profile

router.delete('/:id', middleware.isProfileOwner, (req, res, next) => {
    User.findById(req.params.id, (err, foundUser) => {
        if(err){err.shouldRedirect = true; return next(err);};
        Campground.find()
            .where('author.id')
            .equals(foundUser.id)
            .exec((err, foundCampgrounds)=>{
                if(err){err.shouldRedirect = true; return next(err);};
                //  remove user and user associated data from db
                //  comments associated to each campground are taken care of 
                //  with pre-hook in the model
                foundCampgrounds.forEach((campground)=> {
                    campground.remove();
                });
                foundUser.remove();
                req.flash('success', 'Sad to see you go! Your profile was deleted succesfully.');
                res.redirect('/campgrounds');
                //console.log('\nDeleting user profile, success!\n');
            });
    }); 
});

module.exports = router;