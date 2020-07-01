//  make the error object available through res object
//  set a generic server error status code if none is included in the err
//  render the error.ejs page for the user
//  if shouldRedirect is not defined in the error, send the original err data
function errorHandler (err, req, res, next) {
    console.error('\nError:\n', err.statusCode, err.messageForConsole);
    res.locals.error = err;
    if (!err.statusCode){err.statusCode = 500;}; 
    if (err.shouldRedirect) {
      res.render('error') 
    } else {
        res.status(err.statusCode).send(err.message);
    };
};

module.exports = errorHandler;