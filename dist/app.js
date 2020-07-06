require("dotenv").config({debug:process.env.DEBUG});const path=require("path"),express=require("express"),app=express(),bodyParser=require("body-parser"),methodOverride=require("method-override"),flash=require("connect-flash"),passport=require("passport"),LocalStrategy=require("passport-local"),expressSession=require("express-session"),User=require("./models/user"),errorHandler=require("./middleware/error"),favicon=require("serve-favicon"),index=require("./routes/index"),comments=require("./routes/comments"),resetPw=require("./routes/reset_pw"),userProfile=require("./routes/profile"),campgroundIndex=require("./routes/campgrounds/index"),campgroundShow=require("./routes/campgrounds/show"),campgroundCreate=require("./routes/campgrounds/create"),campgroundEdit=require("./routes/campgrounds/edit"),campgroundDestroy=require("./routes/campgrounds/destroy"),{RedisClient:RedisClient}=require("redis");app.use(express.static(path.join(__dirname,"public"))),app.use(methodOverride("_method")),app.use(bodyParser.urlencoded({extended:!0})),app.use(flash()),app.use(favicon(path.join(__dirname,"public","images","favicon.ico"))),app.set("views",path.join(__dirname,"views")),app.set("view engine","ejs"),app.locals.moment=require("moment");const redis=require("redis"),RedisStore=require("connect-redis")(expressSession);if("production"===process.env.NODE_ENV){const e=redis.createClient(process.env.REDIS_PORT,process.env.REDIS_HOST);e.on("error",e=>{console.log("Redis error: ",e)}),app.use(expressSession({store:new RedisStore({client:e}),secret:process.env.EXPRESS_SECRET,saveUninitialized:!1,resave:!1}))}else app.use(expressSession({secret:process.env.EXPRESS_SECRET,saveUninitialized:!1,resave:!1}));app.use(passport.initialize()),app.use(passport.session()),passport.use(new LocalStrategy(User.authenticate())),passport.serializeUser(User.serializeUser()),passport.deserializeUser(User.deserializeUser()),app.use((e,r,s)=>{r.locals.currentUser=e.user,r.locals.error=e.flash("error"),r.locals.success=e.flash("success"),s()}),app.use(index),app.use("/campgrounds/:id/comments",comments),app.use("/campgrounds",campgroundIndex),app.use("/campgrounds",campgroundCreate),app.use("/campgrounds",campgroundShow),app.use("/campgrounds",campgroundEdit),app.use("/campgrounds",campgroundDestroy),app.use(resetPw),app.use("/user",userProfile),app.get("*",(e,r,s)=>{let o=new Error(`The page: '${e.originalUrl}' does not exist or cannot be found!`);o.messageForConsole=`${e.ip} tried to reach ${e.originalUrl}`,o.statusCode=404,o.shouldRedirect=!0,s(o)}),app.use(errorHandler),module.exports=app;