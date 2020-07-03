require('dotenv').config({ debug: process.env.DEBUG });

const   express     = require('express'),
        router      = express.Router(),
        passport    = require('passport'),
        { userService } = require('../services/index');

//  ==================
//  LANDING PAGE ROUTE
//  ==================

router.get('/', (req, res) => {
    res.render('landing')
});

//  ===========
//  AUTH ROUTES
//  ===========

//  register route

router.get('/register', (req, res) => {
    res.render('users/register');
});

router.post('/register', async (req, res, next) => {
    try {
        await userService.register({
            username:       req.body.username,
            firstname:      req.body.firstName,
            lastname:       req.body.lastName,
            email:          req.body.email,
            dateOfBirth:    req.body.dateOfBirth,      
        }, req.body.password)
        req.flash('success', `Welcome to Yelp Camp, ${req.body.username}! You are now registered successfully!`)
        //  auto-login after registration and redirect
        passport.authenticate('local')(req, res, function(){
            res.redirect('/campgrounds');
        });
    } catch (err){
        return res.render('users/register', {'error': err.message});
        //  if user already exists, the err.message is part of mongoose 
        //  error reporting  
    }
})
//  login route

router.get('/login', (req, res) => {
    res.render('users/login');
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/campgrounds',
    failureRedirect: '/login',
    failureFlash: 'Invalid username or password.'
}), 
    (req, res, next) => {
        if(err){err.shouldRedirect = true; return next(err);};
});

//  logout route

router.get('/logout', (req, res, next) => {
    req.logout();
    req.flash('success', 'Logged out successfully!')
    res.redirect('/campgrounds');
});

module.exports = router;