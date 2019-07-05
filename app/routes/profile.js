const   express     = require('express'),
        router      = express.Router(),
        User        = require('../models/user'),
        Campground  = require('../models/campground'),
        middleware  = require('../middleware');

//  ==============
//  PROFILE ROUTES
//  ==============

//  public profile route

router.get('/:id', (req, res) => {
    User.findById(req.params.id, (err, foundUser) => {
        if(err){
            console.log('Error\n\n', err);
            req.flash('error', 'Error while looking up user id');
            res.redirect('/campgrounds');
        } else {
            Campground.find().where('author.username').equals(foundUser.username).exec((err, foundCampgrounds) => {
                if(err){
                    console.log('Error\n\n', err);
                    req.flash('error', 'Error while looking user associated campgrounds');
                    res.redirect('/campgrounds');
                } else {
                    res.render('users/show', {userData: foundUser, campgroundData: foundCampgrounds});
                };
            });
        };
    });
});

//  edit profile route

router.get('/:id/edit', middleware.checkProfileOwnership, (req, res) =>{
    User.findById(req.params.id, (err, foundUser) => {
        if(err){
            console.log('Error\n\n', err);
            req.flash('error', 'Error while looking up user id');
            res.redirect('/campgrounds');
        } else {
            res.render('users/edit', {userData: foundUser});
        };
    });
});

//  update profile route

router.put('/:id', middleware.checkProfileOwnership, (req, res) => {
    User.findByIdAndUpdate(req.params.id, req.body.profile, (err, updatedUser) => {
        if(err){
            console.log('\nError\n\n', err);
            req.flash('error', 'Error while updating profile data. Try again.');
            res.redirect(`/user/${req.params.id}/edit`);
        } else {
            console.log('\nProfile update success!\n\n', updatedUser);
            req.flash('success', 'Profile updated successfully!');
            res.redirect(`/user/${req.params.id}`);
        };
    });
});

//  delete user profile

router.delete('/:id', middleware.checkProfileOwnership, (req, res) => {
    User.findById(req.params.id, (err, foundUser) => {
        if(err){
            console.log('\nError while deleting user profile:\n', err);
            req.flash('error', 'Error while deleting your user profile. Try again!');
            res.redirect(`/user/${req.params.id}/edit`);
        } else {
            Campground.find().where('author.id').equals(foundUser.id).exec((err, foundCampgrounds)=>{
                if(err){
                    console.log('\nError while looking up user associated data:\n', err);
                    req.flash('error', 'Error while deleting your user profile. Try again!');
                    res.redirect(`/user/${req.params.id}/edit`);
                } else {
                //  remove user and user associated data from db
                //  comments associated to each campground are taken care of with pre-hook in the model
                    foundCampgrounds.forEach((campground)=> {
                        campground.remove();
                    });
                    foundUser.remove();
                    req.flash('success', 'Sad to see you go! Your profile was deleted succesfully.');
                    res.redirect('/campgrounds');
                    console.log('\nDeleting user profile, success!\n');
                };
            });
        };
    }); 
});

module.exports = router;