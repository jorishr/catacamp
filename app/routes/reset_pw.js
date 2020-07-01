require('dotenv').config({ debug: process.env.DEBUG });
const   express     = require('express'),
        router      = express.Router(),
        User        = require('../models/user'),
        async       = require('async'),
        crypto      = require('crypto'),
        mailgun     = require('mailgun-js'),
        getMailTemplate = require('../helpers/mailgun');

//  =====================
//  RESET PASSWORD ROUTES
//  =====================

//  mailgun basic setup

const mailgunDomain = process.env.MAILGUN_DOMAIN;
const mailgunApiKey = process.env.MAILGUN_APIKEY;
const mailgunHost   = process.env.MAILGUN_HOST;
const mg = mailgun({
    apiKey: mailgunApiKey, 
    domain: mailgunDomain, 
    host: mailgunHost
});

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
                const token = bytes.toString('hex');  
                //  Encode each byte as two hexadecimal characters
                cb(err, token);
            });
        },
        //  find the user email in db and add token to user data
        (token, cb) => {
            User.findOne({email: req.body.email}, (err, currentUser) => {
                if(err || !currentUser){
                    console.log('Error: User not found or unexpected error.', err);
                    req.flash('error', 'No matching user data found. Try again with different email.');
                    res.redirect('/forgot');
                } else {
                    currentUser.resetPasswordToken = token;
                    currentUser.resetPasswordExpires = Date.now() + 3600000; //  1 hour
                    currentUser.save((err) => {
                        cb(err, token, currentUser);
                    });
                };
            });
        },
        //  mailgun configuration
        (token, currentUser, cb) => {
            const mailData = getMailTemplate(currentUser, req.headers.host, token);
            mg.messages().send(mailData, function (error, body) {
                if(error){
                    error.shouldRedirect = true;
                    return next(error);
                }
                req.flash('success', `An email has been sent to ${currentUser.email} with further instructions.`);
                cb(error, 'All Done');
            })
        }
    ], (err) =>{
        if(err){
            err.shouldRedirect = true;
            return next(err);
        };
        return res.redirect('/campgrounds');
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
                    });
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
                text: `Hello CataCamp user,\nThis is a confirmation that the password for your account ${foundUser.email} has been changed.\n`
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