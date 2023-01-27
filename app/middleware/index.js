const isLoggedIn = require("./isLoggedIn"),
  isCampgroundOwner = require("./isCampgroundOwner"),
  isCommentOwner = require("./isCommentOwner"),
  isProfileOwner = require("./isProfileOwner"),
  ipRestricted = require("./ipRestriction"),
  pagination = require("./pagination");

middlewareObj = {
  isLoggedIn,
  isCampgroundOwner,
  isCommentOwner,
  isProfileOwner,
  ipRestricted,
  pagination,
};

module.exports = middlewareObj;
