const   express     = require('express'),
        router      = express.Router(),
        { campgroundService, userService } = require('../services/index'), 
        isProfileOwner = require('../middleware/isProfileOwner');

//  ==============
//  PROFILE ROUTES
//  ==============

//  public profile route

router.get('/:id', async (req, res, next) => {
    try {
        const currentUser = await userService.findById(req.params.id);
        const campgrounds = await campgroundService.findAllMatches(
            'author.username',
            currentUser.username
        );
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
        const current = await userService.findById(req.params.id);
        return res.render('users/edit', {userData: current});
    } catch (err){
        err.shouldRedirect = true; 
        return next(err);
    }
});

//  update profile route

router.put('/:id', isProfileOwner, async (req, res, next) => {
    try {
        await userService.findByIdAndUpdate(
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
        const currentUser = await userService.findById(req.params.id);
        const campgrounds = await campgroundService.findAllMatches(
            'author.id',
            currentUser.id
        );
        //  remove user and user associated data from db
        //  comments associated to each campground are taken care of 
        //  with pre-hook in the model
        campgrounds.forEach((campground)=> {
            campground.deleteOne();
        });
        currentUser.deleteOne();
        req.flash('success', 'Sad to see you go! Your profile was deleted successfully.');
        return res.redirect('/campgrounds');
    } catch (err){
        err.shouldRedirect = true; 
        return next(err);
    }
}); 
module.exports = router;