const logger = require('../helpers/logger');
//  make the error object available through res object
//  set a generic server error status code if none is included in the err
//  render the error.ejs page for the user
//  if shouldRedirect is not defined in the error, send the original err data
async function errorHandler (err, req, res, next) {
    //console.error('\nError:\n', err.statusCode, err.messageForConsole);
    await logger.error(
      `${err.statusCode || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    res.locals.error = err;
    if (!err.statusCode){err.statusCode = 500;}; 
    if (err.shouldRedirect) {
      return res.render('error') 
    } else {
      return res.status(err.statusCode).send(err.message);
    };
};

module.exports = errorHandler;