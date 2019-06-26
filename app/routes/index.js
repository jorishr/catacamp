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
    User.register(new User({username: req.body.username}), req.body.password, (err) => {
        if(err){
            console.log('Error while registering new user', err);
            return res.render('register');  //  if user already exists
        }
        console.log('User registered successfully!');
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
}), 
    (req, res, next) => {
});

//  logout route

router.get('/logout', (req, res) => {
    req.logout();
    console.log('User logout success!');
    res.redirect('/');
});

module.exports = router;