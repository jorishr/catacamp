const { sendConfEmail, sendTokenEmail } = require('../helpers/mailgun/send');
const   express     = require('express'),
        router      = express.Router(),
        User        = require('../models/user'),
        async       = require('async'),
        crypto      = require('crypto');

//  =====================
//  RESET PASSWORD ROUTES
//  =====================

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
                    //console.log('Error: User not found or unexpected error.', err);
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
        (token, currentUser, cb) => {
            sendTokenEmail(token, currentUser, cb, req, next);
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

//  accessible for users who received email link and token
//  only render form if token is correct and corresponding user is found
router.get('/reset/:token', (req, res) => {
    User.findOne({
        //  look for the user with corresponding token
        //  and check if token expiration is greater than now
        resetPasswordToken: req.params.token, 
        resetPasswordExpires: {$gt: Date.now()}
    }, (err, foundUser) => {
        if(err || !foundUser){
            //console.log('Unexpected error', err);
            req.flash('error', 'Your password reset token is invalid or has expired.');
            return res.redirect('/forgot');
        } else {
            res.render('users/reset', {token: req.params.token});
        };
    });
});

//  reset password update route

router.post('/reset/:token', (req, res, next) => {
    async.waterfall([
        (cb) => {
            User.findOne({ 
                resetPasswordToken: req.params.token, 
                resetPasswordExpires: {$gt: Date.now()} 
            }, (err, foundUser) => {
                if(err || !foundUser){
                    //console.log('\nUnexpected error:\n', err);
                    req.flash('error', 'Password reset token is invalid or has expired.');
                    return res.redirect('back');
                } 
                if(req.body.password === req.body.confirm){
                    foundUser.setPassword(req.body.password, (err) => {
                        foundUser.resetPasswordToken = undefined;
                        foundUser.resetPasswordExpires = undefined;
                        foundUser.save(err => {
                            req.logIn(foundUser, (err) => {
                                sendConfEmail(foundUser, cb, req, next);
                            });
                        });
                    });
                } else {
                    req.flash('error', 'Passwords do not match.');
                    return res.redirect('back');
                };
            });
        }
    ], (err) => {
        if(err){ 
            err.shouldRedirect = true;
            next(err);
        }
        res.redirect('/campgrounds');
    })
});

module.exports = router;