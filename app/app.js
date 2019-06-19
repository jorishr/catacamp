const   path        = require('path'),
        express     = require('express'),
        app         = express(),
        port        = 3000,
        bodyParser  = require('body-parser'),
        mongoose    = require('mongoose'),
        db          = mongoose.connection;    
       
//  BASIC EXPRESS/MONGO CONFIG

mongoose.connect('mongodb://localhost/yelp-camp', {useNewUrlParser: true});
db.on('error', console.error.bind(console, 'connection error:'));

app.listen(port, () => console.log(`Express Server is listening on port ${port}`));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: true}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//  ============
//  SCHEMA SETUP
//  ============

let campgroundSchema = new mongoose.Schema({
    name: String,
        image: String,
        description: String
});

let Campground = mongoose.model('Campground', campgroundSchema);

/* Campground.create(
    {name: 'Salmon Creek', image: 'images/2164766085.png', description: 'Test'},
    (err, savedData) => {
            //  the second argument is the data object written to the db
            //  name it what you want
        if (err) {return console.error(err);}
        else {return console.log('Succesfully saved:\n', savedData)}
    }
); */


//  ========
//  ROUTES
//  ========
//  name            url                     verb    desc
//  ===========================================================================
//  INDEX route     /campgrounds            GET     list (all) data in db
//  NEW route       /campgrounds/new        GET     show form to add new db data
//  CREATE route    /campgrounds            POST    add to DB, then redirect
//  SHOW            /campgrounds/:id        GET     show specific info
//  EDIT            /campgrounds/:id/edit   GET     show edit form
//  UPDATE          /campgrounds/:id        PUT     update db, then redirect
//  DESTROY         /campgrounds/:id        DELETE  delete in DB, then redirect

app.get('/', (req, res) => {
    res.render('home')
});

// INDEX ROUTE

app.get('/campgrounds', (req, res) => {
    Campground.find({}, (err, allCampgrounds) => {
            //  the second argument is the data retrieved from the database
            //  call it whatever you want
        if (err) {return console.error(err);}
            else {
                    //  pass the retrieved the data to the ejs file
                res.render('index', {campgrounds:allCampgrounds}) 
                return console.log('Retrieved Succesfully from db:\n', allCampgrounds)
            }
    })
});

// CREATE ROUTE

app.post('/campgrounds', (req, res) => {
    // get data from form at page 'new-campground' and add to campgrounds array
    let newName = req.body.newName;
    let newImage = req.body.newImage;
    let newDescription = req.body.newDescription;
    let newCampground = {name: newName, image: newImage, description: newDescription};
    Campground.create(newCampground, (err, newDataEntry) => {
        if(err) {return console.log(err);}
        else {
                // redirect to campgrounds page
            res.redirect('campgrounds');
            console.log('Succesfully added to DB:\n', newDataEntry);
        }
    });
});

//  NEW ROUTE

app.get('/campgrounds/new', (req, res) => {
    res.render('new-campground');
});

//  SHOW ROUTE
//  Note that it is important to declare the NEW route first, if not it would
//  be considered a /:id

app.get('/campgrounds/:id', (req, res) => {
    Campground.findById(req.params.id, (err, foundData) => {
        if(err){console.log('Error', err)}
        else {
            res.render('show-campground', {campground: foundData});
        }
    });
})
