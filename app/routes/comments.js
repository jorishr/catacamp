const   express     = require('express'),
        router      = express.Router({mergeParams: true}),  
            //  important merge the params from campground and comments
            //  without it the ID will not be found
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

module.exports = router;