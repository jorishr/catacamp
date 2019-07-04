const   express     = require('express'),
        router      = express.Router(),
        Campground  = require('../models/campground'),
        middleware  = require('../middleware'),
        NodeGeocoder = require('node-geocoder');
 
let options = {
    provider: 'google',
    httpAdapter: 'https',
    apiKey: process.env.GEOCODER_API_KEY,
    formatter: null
};
         
let geocoder = NodeGeocoder(options);
        
//  INDEX ROUTE

router.get('/', (req, res) => {
    Campground.find({}, (err, allCampgrounds) => {
            //  the second argument is the data retrieved from the database
            //  call it whatever you want
        if (err) {return console.error(err);}
            else {
                    //  pass the retrieved the data to the ejs file
                    //  if the user is not logged in, req.user = undefined
                    //  when logged in PassportJs adds session data to request
                res.render('campgrounds/index', {campgrounds: allCampgrounds}) 
                return console.log('Retrieved Succesfully from db:\n', allCampgrounds)
            }
    })
});

// CREATE ROUTE

router.post('/', middleware.isLoggedIn, (req, res) => {
    // get data from form at page 'new-campground' and add to campgrounds array
    console.log(req.user)
    let newName = req.body.newName;
    let newImage = req.body.newImage;
    let newPrice = req.body.newPrice;
    let newDescription = req.body.newDescription;
    let author = {id: req.user._id, username: req.user.username}
    geocoder.geocode(req.body.newLocation, (err, locationData) => {
        if (err || !locationData.length) {
            console.log('ERROR\n\n', err);
            req.flash('error', 'Invalid campground address');
            return res.redirect('/campgrounds');
        };
        let lat = locationData[0].latitude;
        let lng = locationData[0].longitude;
        let location = locationData[0].formattedAddress;
        let newCampground = {name: newName, image: newImage, price: newPrice, 
            description: newDescription, author: author, location: location, lat: lat, lng: lng};
        Campground.create(newCampground, (err, newDataEntry) => {
            if(err) {return console.log(err);}
            else {
                // redirect to campgrounds page
                req.flash('success', 'New campground succesfully added!');
                res.redirect('campgrounds');
                console.log('Succesfully added to DB:\n', newDataEntry);
            }
        });
    });
});

//  NEW ROUTE

router.get('/new', middleware.isLoggedIn, (req, res) => {
    res.render('campgrounds/new-campground');
});

//  SHOW ROUTE
//  Note that it is important to declare the NEW route first, if not it would
//  be considered a /:id

router.get('/:id', (req, res) => {
        //  use populate to transform associated comments id into commentObject 
    Campground.findById(req.params.id).populate('comments').exec((err, foundData) => {
        if(err || !foundData){
            req.flash('error', 'Sorry, that campground does not exist!');
            console.log('Error\n', err);
        } else {
            res.render('campgrounds/show-campground', {campground: foundData, api: process.env.GEOCODER_API_KEY_RESTRICTED});
        }
    });
});

//  EDIT ROUTE

router.get('/:id/edit', middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findById(req.params.id, (err, foundData) => {
        if(err){res.redirect('/campgrounds')}
            else {
                res.render('campgrounds/edit-campground', {campground: foundData});
            }
    })
});

//  UPDATE ROUTE

router.put('/:id', middleware.checkCampgroundOwnership, (req, res) => {
    geocoder.geocode(req.body.campground.location, (err, locationData) => {
        console.log('ERROR\n\n', req.body.campground.location)
        if(err || !locationData.length){
            req.flash('error', 'Invalid address');
            res.redirect('/campgrounds');
        }
        req.body.campground.lat = locationData[0].latitude;
        req.body.campground.lng = locationData[0].longitude;
        req.body.campground.location = locationData[0].formattedAddress;
        Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedData) => {
            if(err){
                req.flash('error', 'Error while updating campground!');
                console.log('Error while updating: ', err);
                res.redirect('/campgrounds');
            } else {
                req.flash('success', 'Campground updated succesfully!');
                res.redirect(`/campgrounds/${req.params.id}`);
            };
        });
    });
});

//  DESTROY ROUTE

router.delete('/:id', middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        if(err){
            req.flash('error', 'Error while deleting campground!');
            console.log('Error while deleting:\n', err);
            res.redirect(`/campgrounds/${req.params.id}`)
        } else {
            foundCampground.remove();
            //  associated comment deleting is handled as pre-hook Schema method in data model
            console.log(`Succesfully deleted campground`);
            req.flash('success', 'Campground succesfully deleted!');
            res.redirect('/campgrounds');
        };
    });
});


module.exports = router;