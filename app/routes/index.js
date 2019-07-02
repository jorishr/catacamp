const   express     = require('express'),
        router      = express.Router(),
        passport    = require('passport'),
        User        = require('../models/user');

//  LANDING PAGE ROUTE

router.get('/', (req, res) => {
    res.render('landing')
});

//  AUTH ROUTES

//  register route

router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register', (req, res, next) => {
    console.log('Starting user registration!');
    User.register(new User({username: req.body.username, isAdmin: false}), req.body.password, (err) => {
        if(err){
            console.log('Error while registering new user', err);
            return res.render('register', {'error': err.message});
                //  if user already exists, the err.message is part of mongoose error reporting  
        }
        console.log('User registered successfully!');
        req.flash('success', `Welcome to Yelp Camp, ${req.body.username}! You are now registered successfully!`)
        //  auto-login after registration and redirect
        passport.authenticate('local')(req, res, function(){
            console.log('User logged-in successfully!');
            res.redirect('/campgrounds');
        })

    });
});

//  login route

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/campgrounds',
    failureRedirect: '/login',
    failureFlash: true,
}), 
    (req, res) => {
});

//  logout route

router.get('/logout', (req, res) => {
    req.logout();
    console.log('User logout success!');
    req.flash('success', 'Logged out successfully!')
    res.redirect('/campgrounds');
});

module.exports = router;