const   express     = require('express'),
        router      = express.Router({mergeParams: true}),  
            /*  important; merge the params from campground and comments
                without it the parameter ID for campgrounds will not be 
                found when urls are shortened. mergeParams makes sure the 
                camprgound ID is accesible here in the comment routes. */ 
        Campground  = require('../models/campground'),
        Comment     = require('../models/comments'),
        middleware  = require('../middleware');

//  create new comment route

router.get('/new', middleware.isLoggedIn, (req, res, next) => {
    Campground.findById(req.params.id, (err, foundData) => {
        if(err){err.shouldRedirect = true; return next(err);};
        res.render('comments/new-comment', {campground: foundData});
    });
});

router.post('/', middleware.isLoggedIn, (req, res, next) => {
    //  lookup campground id
    Campground.findById(req.params.id, (err, foundData) => {
        if (err){err.shouldRedirect = true; return next(err);};
        //  store new comment in db
        Comment.create(req.body.comment, (err, savedComment) => {
            if (err){err.shouldRedirect = true; return next(err);}
            savedComment.author.id = req.user._id;  
            //  isLoggedIn is dependency thus this will not be undefined
            savedComment.author.username = req.user.username;
            savedComment.save();
            console.log(`Saved comment in DB:\n${savedComment}\nComment made by: ${req.user.username}`)
            //  associate comment to campground 
            foundData.comments.push(savedComment);
            foundData.save();   //  comments array in foundData(=campground:id)
            //  redirect
            req.flash('success', 'New comment added!');
            res.redirect(`/campgrounds/${req.params.id}`);
                    //  or id also stored in foundData._id
        });
    });
});

//  edit comment route

router.get('/:comment_id/edit', middleware.isCommentOwner, (req, res, next) => {
    Campground.findById(req.params.id, (err, foundData) => {
        if(err){err.shouldRedirect = true; return next(err);};
        Comment.findById(req.params.comment_id, (err, foundCommentData) => {
            if(err){err.shouldRedirect = true; return next(err);};
            res.render('comments/edit-comment', {campground: foundData, comment: foundCommentData});
        });
    });
})
//  update comment route

router.put('/:comment_id', middleware.isCommentOwner, (req, res, next) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
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
        console.log('Succesfully deleted comment');
    });
});

module.exports = router;