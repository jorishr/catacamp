require('dotenv').config({ debug: process.env.DEBUG });

const   express     = require('express'),
        router      = express.Router(),
        passport    = require('passport'),
        User        = require('../models/user'),
        Campground  = require('../models/campground'),
        middleware  = require('../middleware'),
        async       = require('async'),
        crypto      = require('crypto'),
        mailgun     = require("mailgun-js");

//  LANDING PAGE ROUTE

router.get('/', (req, res) => {
    res.render('landing')
});

//  ===========
//  AUTH ROUTES
//  ===========

//  register route

router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register', (req, res, next) => {
    console.log('Starting user registration!');
    User.register(new User({
            username:       req.body.username,
            firstname:      req.body.firstName,
            lastname:       req.body.lastName,
            email:          req.body.email,
            dateOfBirth:    req.body.dateOfBirth,      
            isAdmin:        false
            }), req.body.password, (err) => {
       
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

//  ==============
//  PROFILE ROUTES
//  ==============

//  public profile route

router.get('/user/:id', (req, res) => {
    User.findById(req.params.id, (err, foundUser) => {
        if(err){
            console.log('Error\n\n', err);
            req.flash('error', 'Error while looking up user id');
            res.redirect('/campgrounds');
        } else {
            Campground.find().where('author.username').equals(foundUser.username).exec((err, foundCampgrounds) => {
                if(err){
                    console.log('Error\n\n', err);
                    req.flash('error', 'Error while looking user associated campgrounds');
                    res.redirect('/campgrounds');
                } else {
                    res.render('users/show', {userData: foundUser, campgroundData: foundCampgrounds});
                };
            });
        };
    });
});

//  edit profile route

router.get('/user/:id/edit', middleware.checkProfileOwnership, (req, res) =>{
    User.findById(req.params.id, (err, foundUser) => {
        if(err){
            console.log('Error\n\n', err);
            req.flash('error', 'Error while looking up user id');
            res.redirect('/campgrounds');
        } else {
            res.render('users/edit', {userData: foundUser});
        };
    });
});

//  update profile route

router.put('/user/:id', (req, res) => {
    User.findByIdAndUpdate(req.params.id, req.body.profile, (err, updatedUser) => {
        if(err){
            console.log('\nError\n\n', err);
            req.flash('error', 'Error while updating profile data. Try again.');
            res.redirect(`/user/${req.params.id}/edit`);
        } else {
            console.log('\nProfile update success!\n\n', updatedUser);
            req.flash('success', 'Profile updated successfully!');
            res.redirect(`/user/${req.params.id}`);
        };
    });
});

//  delete user profile

router.delete('/user/:id', (req, res) => {
    User.findById(req.params.id, (err, foundUser) => {
        if(err){
            console.log('\nError while deleting user profile:\n', err);
            req.flash('error', 'Error while deleting your user profile. Try again!');
            res.redirect(`/user/${req.params.id}/edit`);
        } else {
            Campground.find().where('author.id').equals(foundUser.id).exec((err, foundCampgrounds)=>{
                if(err){
                    console.log('\nError while looking up user associated data:\n', err);
                    req.flash('error', 'Error while deleting your user profile. Try again!');
                    res.redirect(`/user/${req.params.id}/edit`);
                } else {
                //  remove user and user associated data from db
                //  comments associated to each campground are taken care of with pre-hook in the model
                    foundCampgrounds.forEach((campground)=> {
                        campground.remove();
                    });
                    foundUser.remove();
                    req.flash('success', 'Sad to see you go! Your profile was deleted succesfully.');
                    res.redirect('/campgrounds');
                    console.log('\nDeleting user profile, success!\n');
                };
            });
        };
    }); 
});

//  =====================
//  RESET PASSWORD ROUTES
//  =====================

//  mailgun basic setup

const mailgunDomain = process.env.MAILGUN_DOMAIN;
const mailgunApiKey = process.env.MAILGUN_APIKEY;
const mg = mailgun({apiKey: mailgunApiKey, domain: mailgunDomain});

//  forgot password route

router.get('/forgot', (req, res) => {
    res.render('users/forgot');
});

//  reset password start route

router.post('/forgot', (req, res, next) => {
    async.waterfall([
        //  create a token
        (cb) => {
            crypto.randomBytes(20, (err, bytes) => {
                let token = bytes.toString('hex');  
                //  Encode each byte as two hexadecimal characters
                cb(err, token);
            });
        },
        //  find the user email in db and add token to user data
        (token, cb) => {
            User.findOne({email: req.body.email}, (err, foundUser) => {
                if(err || !foundUser){
                    console.log('Error: User not found or unexpected error.', err);
                    req.flash('error', 'No matching user data found. Try again with different email.');
                    res.redirect('/forgot');
                } else {
                    foundUser.resetPasswordToken = token;
                    foundUser.resetPasswordExpires = Date.now() + 36000000; //  1 hour
                    foundUser.save((err) => {
                        cb(err, token, foundUser);
                    });
                };
            });
        },
        //  mailgun configuration
        (token, foundUser, cb) => {
            let mailData = {
                to: foundUser.email,
                from: 'CataCamp <catacamp@catacamp.com>',
                subject: 'CataCamp Password Reset',
                text: 
`Hello CataCamp user,\n
You are receiving this because you (or someone else) have requested the reset of the password for your account.\n 
Please click on the following link, or paste this into your browser to complete the process:\n 
\thttp://${req.headers.host}/reset/${token}\n\n
If you did not request this, please ignore this email and your password will remain unchanged.`
            }
            mg.messages().send(mailData, function (error, body) {
                if(error){
                    console.log(error);
                }
                console.log('\nMailgun:\n', body);
                req.flash('success', `An email has been sent to ${foundUser.email} with further instructions.`);
                cb(error, 'All Done');
            })
        }
    ], (err) =>{
        if(err){
            return next(err);
        };
        res.redirect('/forgot');
    });
});

//  reset password edit route

router.get('/reset/:token', (req, res) => {
    User.findOne({
        //  look for the user with corresponding token
        //  and check if token expiration is greater than now
        resetPasswordToken: req.params.token, 
        resetPasswordExpires: {$gt: Date.now()}
    }, (err, foundUser) => {
        if(err || !foundUser){
            console.log('Unexpected error', err);
            req.flash('error', 'Your password reset token is invalid or has expired.');
            return res.redirect('/forgot');
        } else {
            res.render('users/reset', {token: req.params.token});
        };
    });
});

//  reset password update route

router.post('/reset/:token', (req, res) => {
    async.waterfall([
        (cb) => {
            User.findOne({ 
                resetPasswordToken: req.params.token, 
                resetPasswordExpires: {$gt: Date.now()} 
            }, (err, foundUser) => {
                if(err || !foundUser){
                    console.log('\nUnexpected error:\n', err);
                    req.flash('error', 'Password reset token is invalid or has expired.');
                    return res.redirect('back');
                } 
                if(req.body.password === req.body.confirm){
                    foundUser.setPassword(req.body.password, (err) => {
                    foundUser.resetPasswordToken = undefined;
                    foundUser.resetPasswordExpires = undefined;
  
                    foundUser.save((err) => {
                        req.logIn(foundUser, (err) => {
                            cb(err, foundUser);
                        });
                    });
                    console.log('\nPassword changed successfully!\n')
                })
                } else {
                    req.flash('error', 'Passwords do not match.');
                    return res.redirect('back');
                };
            });
        },
        (foundUser, cb) => {
            //  mailgun config
            let mailData = {
                to: foundUser.email,
                from: 'CataCamp <catacamp@catacamp.com>',
                subject: 'Your CataCamp Password has changed',
                text: `Hello CataCamp user,\n This is a confirmation that the password for your account ${foundUser.email} has been changed.\n`
            }
            mg.messages().send(mailData, function (error, body) {
                if(error){
                    console.log(error);
                }
                console.log('\nMailgun:\n', body);
                req.flash('success', `Your password has been changed successfully!`);
                cb(error, 'All Done');
            })
        }
    ], (err) => {
        res.redirect('/campgrounds');
    })
});

module.exports = router;