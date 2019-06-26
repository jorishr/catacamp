const   express = require('express'),
        router  = express.Router({mergeParams: true}),  
            //  important merge the params from campground and comments
            //  without it the ID will not be found
        Campground = require('../models/campground'),
        Comment    = require('../models/comments');

//  create new comment route

router.get('/new', isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, foundData) => {
        if(err){console.log('Error: ', err)}
            else {
                res.render('comments/new-comment', {campground: foundData});
            };
    });
});

router.post('/', isLoggedIn, (req, res) => {
    //  lookup campground id
    Campground.findById(req.params.id, (err, foundData) => {
        if (err){console.log('Error: ', err)}
            else {
                console.log('Found in DB: \n'. foundData);
                //  store new comment in db
                Comment.create(req.body.comment, (err, savedComment) => {
                    if(err){console.log('Error: ', err)}
                        else {
                            {console.log('Saved comment in DB: \n', savedComment)}
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

//  middleware

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    };
    res.redirect('/login');
};

module.exports = router;