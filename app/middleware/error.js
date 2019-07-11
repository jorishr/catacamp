function errorHandler (err, req, res, next) {
    console.error('\nError:\n', err.statusCode, err.messageConsole);
    //  set a generic server error status code if none is included in the err
    if (!err.statusCode){err.statusCode = 500;}; 
    if (err.shouldRedirect) {
    //  render the error.ejs page for the user
      res.render('error', {error: err}) 
    } else {
        //  if shouldRedirect is not defined in the error, send the original err data
        res.status(err.statusCode).send(err.message);
    };
};

module.exports = errorHandler;