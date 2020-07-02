require('dotenv').config({ debug: process.env.DEBUG });
const   Campground  = require('../../models/campground'),
        express     = require('express'),
        router      = express.Router(),
        isLoggedIn  = require('../../middleware/isLoggedIn'),
        NodeGeocoder= require('node-geocoder'),
        geoOptions  = require('../../helpers/geoDataOptions');

// CREATE ROUTE

//render form
router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new-campground');
});

//save to db
router.post('/', isLoggedIn, async (req, res, next) => {
    try {
        //collect form data at 'new-campground' page
        const { newName, newPrice, newDescription } = req.body;
        const placeholderImg = 'images/catacamp_placeholder1920x1200.gif'; 
        const newImage = req.body.newImage || placeholderImg;
        const author = { id: req.user._id, username: req.user.username };
        //get location data
        const geocoder = NodeGeocoder(geoOptions);
        const geoData = await geocoder.geocode(req.body.newLocation);
        if(!geoData.length){
            req.flash('error', 'Invalid campground location address');
            return res.redirect('/campgrounds/new');
        }
        const lat = geoData[0].latitude;
        const lng = geoData[0].longitude;
        const location = geoData[0].formattedAddress;
        //create new data object
        const newCampground = {
            name: newName, 
            image: newImage, 
            price: newPrice, 
            description: newDescription, 
            author: author, 
            location: location, 
            lat: lat, 
            lng: lng
        }
        //add to db and redirect
        await Campground.create(newCampground);
        req.flash('success', 'New campground succesfully added!');
        return res.redirect('campgrounds');
    } catch (err){
        err.status = 500;
        err.message = err;
        //console.log(err)
        req.flash('error', 'An error occurred. Try again or contact the administrator');
        return res.redirect('/campgrounds/new');
    }
});
module.exports = router;