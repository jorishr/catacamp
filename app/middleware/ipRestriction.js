module.exports = ipRestricted = function(req, res, next){
    let userIp =    req.ip ||
                    req.headers['x-forwarded-for'] || 
                    req.connection.remoteAddress || 
                    req.socket.remoteAddress ||
                    req.connection.socket.remoteAddress;
    let allowedIp = process.env.LOCAL_IP;
    if(userIp === allowedIp){
        next();
    } else {
        console.log('\nReceived a request from a non-approved IP address');
        req.flash('error', `This action is disabled for security reasons. Please find the contact details of the site admin at ${process.env.SITE_ADMIN}.`)
        res.redirect('/campgrounds');
    };
};