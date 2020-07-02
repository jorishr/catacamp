const   isLoggedIn = require('./isLoggedIn'),
        isCampgroundOwner = require('./isCampgroundOwner'),
        isCommentOwner = require('./isCommentOwner'),
        isProfileOwner = require('./isProfileOwner'),
        ipRestricted   = require('./ipRestriction');
   
middlewareObj = {
    isLoggedIn,
    isCampgroundOwner,
    isCommentOwner,
    isProfileOwner,
    ipRestricted
};

module.exports = middlewareObj;