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

router.get('/new', middleware.isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, foundData) => {
        if(err){console.log('Error: ', err)}
            else {
                res.render('comments/new-comment', {campground: foundData});
            };
    });
});

router.post('/', middleware.isLoggedIn, (req, res) => {
    //  lookup campground id
    Campground.findById(req.params.id, (err, foundData) => {
        if (err){console.log('Error: ', err)}
            else {
                console.log('Found in DB: \n', foundData);
                //  store new comment in db
                Comment.create(req.body.comment, (err, savedComment) => {
                    if(err){console.log('Error: ', err)}
                        else {
                            savedComment.author.id = req.user._id;  
                            //  isLoggedIn is dependency thus this will not be undefined
                            savedComment.author.username = req.user.username;
                            savedComment.save();
                            console.log(`Saved comment in DB:\n${savedComment}\nComment made by: ${req.user.username}`)
                            //  associate comment to campground 
                            foundData.comments.push(savedComment);
                            foundData.save();   //  comments array in foundData(=campground:id)
                            //  redirect
                            res.redirect(`/campgrounds/${req.params.id}`);
                                        //  or id also stored in foundData._id
                        }
                })
            }
    })
});

//  edit comment route

router.get('/:comment_id/edit', middleware.checkCommentOwnership, (req, res) => {
    Campground.findById(req.params.id, (err, foundData) => {
        if(err){
            console.log('Error looking up data in db: \n', err);
            res.redirect('back');
        } else {
            Comment.findById(req.params.comment_id, (err, foundCommentData) => {
                if(err){
                    console.log('Error looking up comment data:\n', err);
                    res.redirect('back');
                } else {
                    res.render('comments/edit-comment', {campground: foundData, comment: foundCommentData});
                };
            });
        };
    });
})
//  update comment route

router.put('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
        if(err){
            console.log('Error updating the db:\n', err);
            res.redirect('back');
        } else {
            res.redirect(`/campgrounds/${req.params.id}`);
        }
    });
});

//  delete comment route

router.delete('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndRemove(req.params.comment_id, (err) => {
        if(err){
            console.log('Error while deleting:\n', err);
            res.redirect('back');
        } else {
            res.redirect(`/campgrounds/${req.params.id}`);
            console.log('Succesfully deleted comment');
        };
    });
});
module.exports = router;