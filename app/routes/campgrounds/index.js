//  =================
//  CAMPGROUND ROUTES
//  =================
//  name            url                     verb    desc
//  ===========================================================================
//  INDEX route     /campgrounds            GET     list (all) data in db
//  NEW route       /campgrounds/new        GET     show form to add new db data
//  CREATE route    /campgrounds            POST    add to DB, then redirect
//  SHOW            /campgrounds/:id        GET     show specific info
//  EDIT            /campgrounds/:id/edit   GET     show edit form
//  UPDATE          /campgrounds/:id        PUT     update db, then redirect
//  DESTROY         /campgrounds/:id        DELETE  delete in DB, then redirect
const   Campground  = require('../../models/campground'),
        express     = require('express'),
        router      = express.Router();

/**
 * ###########
 * INDEX ROUTE
 * ###########
 * - Display all campgrounds
 * - unless the page is rendered with a search query
 * - helper function to escape string
 */
function escapeRegex(queryString) {
    return queryString.replace(
    /[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

router.get('/', async (req, res, next) => {
    try {
        //the noMatch variable is used on the render page to give user feedback
        //about the lack of meaningful search results 
        let noMatch = null;
        if(!req.query.search){
            const allCampgrounds = await Campground.find({})
            return res.render('campgrounds/index', {
                campgrounds: allCampgrounds, 
                noMatch: noMatch
            }) 
        } else {
            const regex = new RegExp(escapeRegex(req.query.search), 'gi');
            const searchResult = await Campground.find({$or:[
                {'name': regex},
                {'location': regex},
                {'author.username': regex}
            ]})
            if(searchResult.length < 1){
                noMatch = 'No matching locations, campground names or users found. Try again!'
                return res.render('campgrounds/index', {
                    campgrounds: searchResult, 
                    noMatch: noMatch
                })    
            } else {
                return res.render('campgrounds/index', {
                    campgrounds: searchResult, 
                    noMatch: noMatch
                }); 
            };
        }

    } catch (err){
        err.shouldRedirect = true; 
        return next(err); 
    }

})  
module.exports = router;        