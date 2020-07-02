const   express     = require('express'),
        router      = express.Router({mergeParams: true}),  
    /*  Important: merge the params from campground and comments.
        Without it the parameter ID for campgrounds will not be 
        found when urls are shortened. mergeParams makes sure the 
        camprgound ID is accessible here in the comment routes. */ 
        Campground  = require('../models/campground'),
        Comment     = require('../models/comments'),
        isLoggedIn  = require('../middleware/isLoggedIn');
        isCommentOwner = require('../middleware/isCommentOwner');

//  create new comment route

//  render form for the correct Campground
router.get('/new', isLoggedIn, async (req, res, next) => {
    try {
        const currentCampground = await Campground.findById(req.params.id);
        res.render('comments/new-comment', {campground: currentCampground});

    } catch (err){
        err.shouldRedirect = true; 
        return next(err);
    }
    
});

//  Store new comment
//  - lookup current campground id
//  - store new comment in db
//  - associate comment to current campground
//  - isLoggedIn is a dependency thus req.user cannot be undefined
//  - re-render the page
router.post('/', isLoggedIn, async (req, res, next) => {
    try {
        const currentCampground = 
            await Campground.findById(req.params.id).populate('comments');
        const newComment = await Comment.create(req.body.comment);

        newComment.author.id = req.user._id;  
        newComment.author.username = req.user.username;
        newComment.save();

        currentCampground.comments.push(newComment);
        currentCampground.save();   

        req.flash('success', 'New comment added!');
        return res.render('campgrounds/show-campground', { 
            campground: currentCampground,
            api: process.env.GEOCODER_API_KEY_RESTRICTED,
            success: 'Comment succesfully added!'
         });
        //  or you could use the currentCampground._id
    } catch (err){
        err.shouldRedirect = true; 
        return next(err);        
    }
})

//  edit comment route

//render edit form with correct data
router.get('/:comment_id/edit', isCommentOwner, async (req, res, next) => {
    try {
        const currentCampground = await Campground.findById(req.params.id);
        const currentComment = await Comment.findById(req.params.comment_id);
        return res.render('comments/edit-comment', {
            campground: currentCampground, 
            comment: currentComment
        });
    } catch (err){
        err.shouldRedirect = true; 
        return next(err);
    }
});

//  update comment in db and redirect

router.put('/:comment_id', isCommentOwner, async (req, res, next) => {
    try {
        await Comment.findByIdAndUpdate(
            req.params.comment_id, 
            req.body.comment
        ); 
        req.flash('success', 'Comment succesfully updated!');
        return res.redirect(`/campgrounds/${req.params.id}`);
    } catch (err){
        err.shouldRedirect = true; 
        return next(err);
    }
});

//  delete comment route

router.delete('/:comment_id', isCommentOwner, async (req, res, next) => {
    try {
        await Comment.findByIdAndRemove(req.params.comment_id)
        req.flash('success', 'Comment succesfully deleted!');
        return res.redirect(`/campgrounds/${req.params.id}`);
    } catch (err){
        err.shouldRedirect = true; 
        return next(err);
    }     
});
module.exports = router;