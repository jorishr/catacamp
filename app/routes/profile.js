const   express     = require('express'),
        router      = express.Router(),
        User        = require('../models/user'),
        Campground  = require('../models/campground'),
        isProfileOwner = require('../middleware/isProfileOwner');

//  ==============
//  PROFILE ROUTES
//  ==============

//  public profile route

router.get('/:id', async (req, res, next) => {
    try {
        const currentUser = await User.findById(req.params.id);
        const campgrounds = await Campground.find()
            .where('author.username')
            .equals(currentUser.username);
        return res.render('users/show', {
            userData: currentUser, 
            campgroundData: campgrounds});
    } catch(err){
        err.shouldRedirect = true; 
        return next(err);
    }    
});

//  edit profile route

router.get('/:id/edit', isProfileOwner, async (req, res, next) => {
    try {
        const currentUser = await User.findById(req.params.id);
        return res.render('users/edit', {userData: currentUser});
    } catch (err){
        err.shouldRedirect = true; 
        return next(err);
    }
});

//  update profile route

router.put('/:id', isProfileOwner, async (req, res, next) => {
    try {
        await User.findByIdAndUpdate(
            req.params.id, 
            req.body.profile
        )
        req.flash('success', 'Profile updated successfully!');
        return res.redirect(`/user/${req.params.id}`);
    } catch (err){
        err.shouldRedirect = true; 
        return next(err);
    }
});

//  delete user profile

router.delete('/:id', isProfileOwner, async (req, res, next) => {
    try {
        const currentUser = await User.findById(req.params.id);
        const campgrounds = await Campground.find()
            .where('author.id')
            .equals(currentUser.id);
        //  remove user and user associated data from db
        //  comments associated to each campground are taken care of 
        //  with pre-hook in the model
        campgrounds.forEach((campground)=> {
            campground.remove();
        });
        currentUser.remove();
        req.flash('success', 'Sad to see you go! Your profile was deleted succesfully.');
        return res.redirect('/campgrounds');
    } catch (err){
        err.shouldRedirect = true; 
        return next(err);
    }
}); 
module.exports = router;