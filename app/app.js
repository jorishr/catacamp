const   path            = require('path'),
        express         = require('express'),
        app             = express(),
        port            = 3000,
        bodyParser      = require('body-parser'),
        mongoose        = require('mongoose'),
        db              = mongoose.connection,
        seedDB          = require('./seeds'),
        passport        = require('passport'),
        LocalStrategy   = require('passport-local'),
        expressSession  = require('express-session'),
        User            = require('./models/user'),
        indexRoutes         = require('./routes/index'),
        commentRoutes       = require('./routes/comments'),
        campgroundRoutes    = require('./routes/campgrounds');

      
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

//  import all routes
app.use(indexRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);
app.use('/campgrounds', campgroundRoutes);

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