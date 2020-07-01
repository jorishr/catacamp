require('dotenv').config({ debug: process.env.DEBUG });
const   Campground  = require('../../models/campground'),
        express     = require('express'),
        router      = express.Router(),
        isCampgroundOwner  = require('../../middleware/isCampgroundOwner'),
        NodeGeocoder= require('node-geocoder'),
        geoOptions  = require('../../middleware/geoDataOptions');

//  EDIT ROUTE

//  render edit form with correct data
router.get('/:id/edit', isCampgroundOwner, async (req, res, next) => {
    try {
        const currentCampground = await Campground.findById(req.params.id);
        return res.render('campgrounds/edit-campground', {
            campground: currentCampground
        });
    } catch (err){
        err.shouldRedirect = true; 
        return next(err);
    }
});

//  UPDATE ROUTE
//  Form input element name attributes: campground[name], 
//  campground[price], etc. means we get an object with all the data 
//  on the req.body.campground object. 
//  Only process location and image before writing to db
router.put('/:id', isCampgroundOwner, async (req, res, next) => {
    try {
        const placeholderImg = 'images/catacamp_placeholder1920x1200.gif'; 
        req.body.campground.image = req.body.campground.image || placeholderImg;
        //get updated location data
        const geocoder = NodeGeocoder(geoOptions);
        const geoData = await geocoder.geocode(req.body.campground.location);
        if(!geoData.length){
            req.flash('error', 'Invalid campground location address');
            return res.redirect(`/campgrounds/${req.params.id}/edit`);
        }
        req.body.campground.lat = geoData[0].latitude;
        req.body.campground.lng = geoData[0].longitude;
        req.body.campground.location = geoData[0].formattedAddress;
        //update db and redirect
        await Campground.findByIdAndUpdate(req.params.id, req.body.campground);
        req.flash('success', 'Campground updated succesfully!');
        return res.redirect(`/campgrounds/${req.params.id}`);
    } catch (err){
        err.shouldRedirect = true; 
        return next(err);
    }
});
module.exports = router;