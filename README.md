# Catacamp

# Description
Fullstack web app for listing campgrounds in Catalonia with MongoDb, Express, NodeJS and Bootstrap 4.

# Features
- CSS: 
    - css grid layout, 
    - card design, 
    - jumbotron, 
    - generic dark/light gradient, 
    - image zoom effect

- JS: 
    - social share button with with copy url to clipboard and tooltip,
    - toggle password visibility in forms,
    - all form submit buttons are disabled unless all requried form fields have a value

- API Functionality
    - Models: users, campgrounds, comments with user data association 
    - Create, show, update, cascade delete (incl. associated data)
    - if user does not add image, a placeholder image is used
    - View: 
        - campground profile page with comment section
        - user profile page with access to user submitted campgrounds

- EXPRESS features
    - view engine: Embedded JS (.ejs)
    - sessions with PassportJS Authentication
    - forgot password reset with email confirmation (Mailgun)
    - custom error page with status code
    - flash messages for user feedback (Connect-flash)
    - google maps API integration for campground locations
    - ip restriction middleware

# Dev notes
- local install of Bootstrap v4 and FontAwesome 
- GULP for:
    - SASS compilation
    - Nodemon+BrowserSync
    - buildtask: webpack for js bundling, minification, image optimization 

# Credits

This website is a highly modified version of the Yelp-camp project in the Webdeveloper Bootcamp by Colt Steele.