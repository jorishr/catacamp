const   { campgroundService }  = require('../../services/index'),
        express     = require('express'),
        router      = express.Router();
//  SHOW ROUTE
//  Note that it is important to declare the NEW route first, if not it would
//  be considered a /:id

//  use populate() to transform associated comments id into commentObject
//  this page require an API key render Google Maps 
router.get('/:id', async (req, res, next) => {
    try {
        const current = 
            await campgroundService.findById(req.params.id);
        await current.populate('comments').execPopulate();
        return res.render('campgrounds/show-campground', {
            campground: current, 
            api: process.env.GEOCODER_API_KEY_RESTRICTED
        });
    } catch (err){
        //if id is not found Mongoose will throw an error
        err.messageForConsole = err;
        err.shouldRedirect = true;
        err.statusCode = '404';
        err.message = 'You got lost. This route does not exists!';
        next(err);
    }
});
module.exports = router;