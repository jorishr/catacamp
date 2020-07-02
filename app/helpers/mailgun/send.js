require('dotenv').config({ debug: process.env.DEBUG });

const   getTokenMailTemplate = require('./templates').getTokenMailTemplate,
        getConfMailTemplate  = require('./templates').getConfMailTemplate,
        mailgun       = require('mailgun-js'),
        mailgunDomain = process.env.MAILGUN_DOMAIN,
        mailgunApiKey = process.env.MAILGUN_APIKEY,
        mailgunHost   = process.env.MAILGUN_HOST,
        mg = mailgun({
            apiKey: mailgunApiKey, 
            domain: mailgunDomain, 
            host: mailgunHost
        });

function sendTokenEmail(token, currentUser, cb, req, next){
    const mailData = getTokenMailTemplate(currentUser, req.headers.host, token);
        mg.messages().send(mailData, function (error, body) {
            if(error){
                error.shouldRedirect = true;
                error.statusCode = 500;
                error.messageForConsole = 'Sending token email failed.'
                return next(error);
            }
            req.flash('success', `An email has been sent to ${currentUser.email} with further instructions.`);
            cb(error, 'All Done');
        })
}

function sendConfEmail(foundUser, cb, req, next) {
    const mailData = getConfMailTemplate(foundUser);
    mg.messages().send(mailData, function (error, body) {
        if(error){
            error.shouldRedirect = true;
            error.statusCode = 500;
            error.messageForConsole = 'Sending confirmation email failed.'
            next(error);
        }
        req.flash('success', `Your password has been changed successfully!`);
        cb(error, 'All Done');  //mailgun cb to signal end of waterfall fn
    })
}
module.exports = {
    sendTokenEmail,
    sendConfEmail
}