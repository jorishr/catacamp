require('dotenv').config({ debug: process.env.DEBUG });

const   path            = require('path'),
        express         = require('express'),
        app             = express(),
        bodyParser      = require('body-parser'),
        mongoose        = require('mongoose'),
        db              = mongoose.connection,
        port            = process.env.DB_PORT,
        methodOverride  = require('method-override'),
        flash           = require('connect-flash'),
        seedDB          = require('./seeds'),
        passport        = require('passport'),
        LocalStrategy   = require('passport-local'),
        expressSession  = require('express-session'),
        User            = require('./models/user'),
        indexRoutes         = require('./routes/index'),
        commentRoutes       = require('./routes/comments'),
        campgroundRoutes    = require('./routes/campgrounds'),
        resetPwRoutes       = require('./routes/reset_pw'),
        userProfileRoutes   = require('./routes/profile');

//  BASIC EXPRESS/MONGO CONFIG
mongoose.connect(process.env.DB_CONN, {useNewUrlParser: true});
db.on('error', console.error.bind(console, 'connection error:'));

app.listen(port, () => console.log(`Express Server is listening on port ${port}`));

app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(flash());

//  seeding the db with new ID's generated on server restart
//  seedDB();
//  no longer needed once user data association is setup   

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//  make variable moment available in all view files 
app.locals.moment = require('moment');  

//  ===============
//  PASSPORT CONFIG
//  ===============

app.use(expressSession({
    secret: process.env.EXPRESS_SECRET,
    saveUninitialized: false,
    resave: false
}))

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//  make currentUser object and flash messages available on all routes

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});

//  import all routes
app.use(indexRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);
app.use('/campgrounds', campgroundRoutes),
app.use(resetPwRoutes),
app.use('/user', userProfileRoutes);