const   path        = require('path'),
        express     = require('express'),
        app         = express(),
        port        = 3000,
        bodyParser  = require('body-parser'),
        mongoose    = require('mongoose'),
        db          = mongoose.connection,
        seedDB      = require('./seeds'),
        Campground  = require('./models/campground'),
        Comment     = require('./models/comments'),
        passport    = require('passport'),
        LocalStrategy = require('passport-local'),
        expressSession = require('express-session'),
        User        = require('./models/user');

      
//  BASIC EXPRESS/MONGO CONFIG

mongoose.connect('mongodb://localhost/yelp-camp', {useNewUrlParser: true});
db.on('error', console.error.bind(console, 'connection error:'));

app.listen(port, () => console.log(`Express Server is listening on port ${port}`));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: true}));

seedDB();   //  new ID's are generated on server restart

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//  ===============
//  PASSPORT CONFIG
//  ===============

app.use(expressSession({
    secret: 'This is a secret',
    saveUninitialized: false,
    resave: false
}))

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//  make currentUser object available on all routes
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});


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
    res.render('landing')
});

// INDEX ROUTE

app.get('/campgrounds', (req, res) => {
    Campground.find({}, (err, allCampgrounds) => {
            //  the second argument is the data retrieved from the database
            //  call it whatever you want
        if (err) {return console.error(err);}
            else {
                    //  pass the retrieved the data to the ejs file
                    //  if the user is not logged in, req.user = undefined
                    //  when logged in PassportJs adds session data to request
                res.render('campgrounds/index', {campgrounds: allCampgrounds, currentUser: req.user}) 
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
    res.render('campgrounds/new-campground');
});

//  SHOW ROUTE
//  Note that it is important to declare the NEW route first, if not it would
//  be considered a /:id

app.get('/campgrounds/:id', (req, res) => {
        //  use populate to transform associated comments id into commentObject 
    Campground.findById(req.params.id).populate('comments').exec((err, foundData) => {
        if(err){console.log('Error', err)}
        else {
            res.render('campgrounds/show-campground', {campground: foundData});
        }
    });
})

//  ===============
//  COMMENTS ROUTE
//  ===============

app.get('/campgrounds/:id/comments/new', isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, foundData) => {
        if(err){console.log('Error: ', err)}
            else {
                res.render('comments/new-comment', {campground: foundData});
            };
    });
});

app.post('/campgrounds/:id/comments', isLoggedIn, (req, res) => {
    //  lookup campground id
    Campground.findById(req.params.id, (err, foundData) => {
        if (err){console.log('Error: ', err)}
            else {
                console.log('Found in DB: \n'. foundData);
                //  store new comment in db
                Comment.create(req.body.comment, (err, savedComment) => {
                    if(err){console.log('Error: ', err)}
                        else {
                            {console.log('Saved comment in DB: \n', savedComment)}
                            //  associate comment to campground 
                            foundData.comments.push(savedComment);
                            foundData.save();   //  comments array in foundData(=campground:id)
                            //  redirect
                            res.redirect(`/campgrounds/${req.params.id}`);
                                        //  or id also stored in foundData._id
                        }
                })
            }
    })
});
//  ===============
//  AUTH ROUTE
//  ===============

app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', (req, res, next) => {
    console.log('Starting user registration!');
    User.register(new User({username: req.body.username}), req.body.password, (err) => {
        if(err){
            console.log('Error while registering new user', err);
            return res.render('register');  //  if user already exists
        }
        console.log('User registered successfully!');
        //  auto-login after registration and redirect
        passport.authenticate('local')(req, res, function(){
            console.log('User logged-in successfully!');
            res.redirect('/campgrounds');
        })

    });
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', passport.authenticate('local', {
    successRedirect: '/campgrounds',
    failureRedirect: '/login',
}), 
    (req, res, next) => {
});

app.get('/logout', (req, res) => {
    req.logout();
    console.log('User logout success!');
    res.redirect('/');
});

//  custom middleware: check if user is logged in

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    };
    res.redirect('/login');
};
