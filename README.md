# Catacamp
- [Catacamp](#catacamp)
  - [Live site](#live-site)
  - [Description](#description)
  - [App structure and main functionality](#app-structure-and-main-functionality)
  - [Developer notes](#developer-notes)
    - [Development Environment](#development-environment)
    - [Build and production environment](#build-and-production-environment)
    - [Deployment](#deployment)
  - [Credits](#credits)

## Live site
[Catacamp](https://catacamp.liondigits.com)

## Description
Fullstack web app for listing campgrounds in Catalonia. Built with NodeJs, ExpressJs, NodeJS, MongoDb and Bootstrap 4.

## App structure and main functionality
- Data models: users, campgrounds and comments with user data association 
- Create, show, update, cascade delete (incl. associated data)
- View:
  - landing page with search box 
  - campground profile page with comment section
  - user profile page with access to user submitted campgrounds
  - if user does not add image, a placeholder image is used
  - view engine: Embedded JS
  - custom error page with status code and end-user friendly message
  - flash messages for user feedback (Connect-flash)
- Authentication
  - sessions with PassportJS
  - session storage with Redis
  - password reset with email confirmation (mail server via Mailgun API)
  - various middleware functions to restrict access to certain routes 
- Other features
  - Google maps API integration for campground locations
  - IP restriction middleware
  - Error handling middleware
  - Logging (Winston)
- UI features (CSS/JS): 
  - css grid layout, 
  - card design, 
  - jumbotron, 
  - generic dark/light gradient, 
  - image zoom effect,
  - image blend animation on landing page (keyframes),
  - social share button with with copy url to clipboard and tooltip,
  - toggle password visibility in forms,
  - all form submit buttons are disabled unless all required form fields have a value

## Developer notes
### Development Environment
See `Dockerfile` and `docker-compose.dev.yaml` for dev environment setup. Overview: NodeJS v12.16.1, MongoDB v5, Redis v6.

The app runs with a new local database. When empty and in development mode, the app will seed the database with some sample data.

Two users are created by default: 
- Username: `admin` password: `!Admin123`
- Username: `camper` password: `!Camper123`
The admin user can delete all campgrounds and comments.

*NOTE*: To have access to all functionality you need the API keys for the mail server (Mailgun), maps (Google Maps) and you have to set an Express Session secret for the login functionality to work. 

GULP task runner for:
  - SASS compilation
  - Nodemon + BrowserSync
  - build task: includes Webpack for js bundling, minification, image optimization 

**Get started**: 
- Clone the repo.
- Run `docker compose -f docker-compose.dev.yaml up --build`

This wil run the app in development mode on port 3000. BrowserSync on port 4000. See NPM scripts and Gulpfile for more details.

### Build and production environment
Use `npm build` to build the production code in the `dist/` folder.

In production mode the app is configured to connect to a hosted MongoDB database and a hosted Redis server. 

With access to the correct `.env` file you can run a production version of the app on a local machine with `npm prod`.

### Deployment
Bash script available to deploy the app to a remote server. See `deploy.sh` for details.


## Credits
This website is a highly modified version of the Yelp-camp project in the Web developer Bootcamp by Colt Steele.