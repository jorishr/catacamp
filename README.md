# Catacamp
- [Catacamp](#catacamp)
  - [Live site](#live-site)
  - [Description](#description)
  - [Features](#features)
  - [Dev notes](#dev-notes)
  - [Commands](#commands)
    - [Development mode](#development-mode)
    - [Build](#build)
    - [Production](#production)
  - [Credits](#credits)

## Live site
[Catacamp](https://catacamp.liondigits.com)

## Description
Fullstack web app for listing campgrounds in Catalonia with MongoDb, ExpressJs, NodeJS and Bootstrap 4.

## Features
- CSS: 
    - css grid layout, 
    - card design, 
    - jumbotron, 
    - generic dark/light gradient, 
    - image zoom effect
    - image blend animation on landing page (keyframes)

- JS: 
    - social share button with with copy url to clipboard and tooltip,
    - toggle password visibility in forms,
    - all form submit buttons are disabled unless all required form fields have a value

- App structure and functionality
    - Data models: users, campgrounds, comments with user data association 
    - Create, show, update, cascade delete (incl. associated data)
    - if user does not add image, a placeholder image is used
    - View: 
        - campground profile page with comment section
        - user profile page with access to user submitted campgrounds
        - search box

- ExpressJs features
    - view engine: Embedded JS (.ejs)
    - search function
    - sessions with PassportJS Authentication
    - session storage with Redis in production
    - forgot password reset with email confirmation (Mailgun)
    - custom error page with status code
    - flash messages for user feedback (Connect-flash)
    - google maps API integration for campground locations
    - ip restriction middleware

## Dev notes
- NodeJS v12.16.1
- local install of Bootstrap v4 and FontAwesome 
- GULP for:
    - SASS compilation
    - Nodemon+BrowserSync
    - build task: webpack for js bundling, minification, image optimization 

## Commands
### Development mode
In dev mode the app is configured to connect to a local version of the MongoDB database. Use `npm start` to run the development server and start the Gulp file watch tasks.

### Build
Use `npm build` to build the production code.

### Production
In production mode the app is configured to connect to the remotely hosted live MongoDB database. Also, the app is configured to work with Redis in production on the live server. 

If you want to check out the production code in a browser on a local machine you can Use `npm prod`. This local server will only work if you have a local version of Redis installed. Alternatively, you can adjust the environment variables to connect to a remote Redis server.  

## Credits
This website is a highly modified version of the Yelp-camp project in the Web developer Bootcamp by Colt Steele.