const   express     = require('express'),
        router      = express.Router({mergeParams: true}),  
    /*  Important: merge the params from campground and comments.
        Without it the parameter ID for campgrounds will not be 
        found when urls are shortened. mergeParams makes sure the 
        camprgound ID is accessible here in the comment routes. */ 
        Campground  = require('../models/campground'),
        Comment     = require('../models/comments'),
        middleware  = require('../middleware');

//  create new comment route

//  render form
router.get('/new', middleware.isLoggedIn, (req, res, next) => {
    Campground.findById(req.params.id, (err, foundData) => {
        if(err){err.shouldRedirect = true; return next(err);};
        res.render('comments/new-comment', {campground: foundData});
    });
});

//  lookup current campground id
//  store new comment in db
//  associate comment to current campground
//  isLoggedIn is a dependency thus req.user cannot be undefined
router.post('/', middleware.isLoggedIn, (req, res, next) => {
    Campground.findById(req.params.id, (err, currentCampground) => {
        if (err){err.shouldRedirect = true; return next(err);};
        Comment.create(req.body.comment, (err, newComment) => {
            if (err){err.shouldRedirect = true; return next(err);}
            newComment.author.id = req.user._id;  
            newComment.author.username = req.user.username;
            newComment.save();
            //console.log(`Saved comment in DB:\n${newComment}\nComment made by: ${req.user.username}`)
            currentCampground.comments.push(newComment);
            currentCampground.save();   
            req.flash('success', 'New comment added!');
            res.redirect(`/campgrounds/${req.params.id}`);
            //  or you could use the currentCampground._id
        });
    });
});

//  edit comment route

//render edit form with correct data
router.get('/:comment_id/edit', middleware.isCommentOwner, (req, res, next) => {
    Campground.findById(req.params.id, (err, currentCampground) => {
        if(err){err.shouldRedirect = true; return next(err);};
        Comment.findById(req.params.comment_id, (err, currentComment) => {
            if(err){err.shouldRedirect = true; return next(err);};
            res.render('comments/edit-comment', {
                campground: currentCampground, 
                comment: currentComment
            });
        });
    });
})

//  update comment in db and redirect

router.put('/:comment_id', middleware.isCommentOwner, (req, res, next) => {
    Comment.findByIdAndUpdate(
        req.params.comment_id, 
        req.body.comment, 
        (err, updatedComment) => {
            if(err){err.shouldRedirect = true; return next(err)};
            req.flash('success', 'Comment succesfully updated!');
            res.redirect(`/campgrounds/${req.params.id}`);
        });
});

//  delete comment route

router.delete('/:comment_id', middleware.isCommentOwner, (req, res, next) => {
    Comment.findByIdAndRemove(req.params.comment_id, (err) => {
        if(err){err.shouldRedirect = true; return next(err);};
        req.flash('success', 'Comment succesfully deleted!');
        res.redirect(`/campgrounds/${req.params.id}`);
        //console.log('Succesfully deleted comment');
    });
});

module.exports = router;