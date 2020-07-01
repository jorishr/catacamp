require('dotenv').config({ debug: process.env.DEBUG });

const   express     = require('express'),
        router      = express.Router(),
        passport    = require('passport'),
        User        = require('../models/user');

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

router.post('/register', (req, res) => {
    console.log('Starting user registration!');
    User.register(new User({
        username:       req.body.username,
        firstname:      req.body.firstName,
        lastname:       req.body.lastName,
        email:          req.body.email,
        dateOfBirth:    req.body.dateOfBirth,      
    }), req.body.password, 
    (err) => {      
        if(err){
            console.log('Error while registering new user', err);
            return res.render('users/register', {'error': err.message});
            //  if user already exists, the err.message is part of mongoose error reporting  
        }
        //console.log('User registered successfully!');
        req.flash('success', `Welcome to Yelp Camp, ${req.body.username}! You are now registered successfully!`)
        //  auto-login after registration and redirect
        passport.authenticate('local')(req, res, function(){
            console.log('User logged-in successfully!');
            res.redirect('/campgrounds');
        });
    });
});

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
    //console.log('User logout success!');
    req.flash('success', 'Logged out successfully!')
    res.redirect('/campgrounds');
});

module.exports = router;