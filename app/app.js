require("dotenv").config({ debug: process.env.DEBUG });

const path = require("path"),
  express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  methodOverride = require("method-override"),
  flash = require("connect-flash"),
  passport = require("passport"),
  LocalStrategy = require("passport-local"),
  expressSession = require("express-session"),
  User = require("./models/user"),
  errorHandler = require("./middleware/error"),
  favicon = require("serve-favicon");

//import routes
const index = require("./routes/index"),
  comments = require("./routes/comments"),
  resetPw = require("./routes/reset_pw"),
  userProfile = require("./routes/profile"),
  campgroundIndex = require("./routes/campgrounds/index"),
  campgroundShow = require("./routes/campgrounds/show"),
  campgroundCreate = require("./routes/campgrounds/create"),
  campgroundEdit = require("./routes/campgrounds/edit"),
  campgroundDestroy = require("./routes/campgrounds/destroy");

app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(flash());
app.use(favicon(path.join(__dirname, "public", "images", "favicon.ico")));

//view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

//  make variable moment available in all view files
app.locals.moment = require("moment");

//  =====================================
//  EXPRESS SESSION AND PASSPORTJS CONFIG
//  =====================================

const redis = require("redis");
const RedisStore = require("connect-redis")(expressSession);
let redisClient;

if (process.env.NODE_ENV === "development") {
  redisClient = redis.createClient(
    process.env.REDIS_LOCAL_PORT,
    process.env.REDIS_LOCAL_HOST
  );
} else {
  redisClient = redis.createClient({
    host: process.env.REDIS_CLOUD_HOST,
    port: process.env.REDIS_CLOUD_PORT,
    password: process.env.REDIS_CLOUD_PW,
  });
}

redisClient.on("connect", () => {
  console.log("Redis Connected");
});
redisClient.on("error", (err) => {
  console.log("Redis error: ", err);
});

app.use(
  expressSession({
    store: new RedisStore({
      client: redisClient,
    }),
    secret: process.env.EXPRESS_SECRET,
    saveUninitialized: false,
    resave: false,
    cookie: {
      secure: false,
      httpOnly: false,
      maxAge: 1000 * 60 * 10, // in milliseconds
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//  make currentUser object and flash messages available on all routes
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

//  =================
//  IMPORT ALL ROUTES
//  =================

app.use(index);
app.use("/campgrounds/:id/comments", comments);
app.use("/campgrounds", campgroundIndex);
app.use("/campgrounds", campgroundCreate);
app.use("/campgrounds", campgroundShow);
app.use("/campgrounds", campgroundEdit);
app.use("/campgrounds", campgroundDestroy);
app.use(resetPw);
app.use("/user", userProfile);

//  ==============
//  ERROR HANDLING
//  ==============

//  catch 404 errors
app.get("*", (req, res, next) => {
  let err = new Error(
    `The page: '${req.originalUrl}' does not exist or cannot be found!`
  );
  err.messageForConsole = `${req.ip} tried to reach ${req.originalUrl}`;
  err.statusCode = 404;
  err.shouldRedirect = true;
  next(err);
});

//  error handling middleware
app.use(errorHandler);

module.exports = app;
