const   express     = require('express'),
        router      = express.Router({mergeParams: true}),  
    /*  Important: merge the params from campground and comments.
        Without it the parameter ID for campgrounds will not be 
        found when urls are shortened. mergeParams makes sure the 
        campground ID is accessible here in the comment routes. */ 
        { campgroundService, commentService } = require('../services/index'),
        { isLoggedIn, isCommentOwner } = require('../middleware/index');

//  create new comment route

//  render form for the correct Campground
router.get('/new', isLoggedIn, async (req, res, next) => {
    try {
        const current = await campgroundService.findById(req.params.id);
        res.render('comments/new-comment', {campground: current});

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
        const current = 
            await campgroundService.findById(req.params.id);
        await current.populate('comments').execPopulate();

        const newComment = await commentService.create(req.body.comment);
        newComment.author.id = req.user._id;  
        newComment.author.username = req.user.username;
        newComment.save();

        current.comments.push(newComment);
        current.save();   

        req.flash('success', 'New comment added!');
        return res.render('campgrounds/show-campground', { 
            campground: current,
            api: process.env.GEOCODER_API_KEY_RESTRICTED,
            success: 'Comment successfully added!'
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
        const currentCampground = await campgroundService.findById(req.params.id);
        const currentComment = await commentService.findById(req.params.comment_id);
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
        await commentService.findByIdAndUpdate(
            req.params.comment_id, 
            req.body.comment
        ); 
        req.flash('success', 'Comment successfully updated!');
        return res.redirect(`/campgrounds/${req.params.id}`);
    } catch (err){
        err.shouldRedirect = true; 
        return next(err);
    }
});

//  delete comment route

router.delete('/:comment_id', isCommentOwner, async (req, res, next) => {
    try {
        await commentService.findByIdAndRemove(req.params.comment_id)
        req.flash('success', 'Comment successfully deleted!');
        return res.redirect(`/campgrounds/${req.params.id}`);
    } catch (err){
        err.shouldRedirect = true; 
        return next(err);
    }     
});
module.exports = router;