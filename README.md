# Catacamp

- [Catacamp](#catacamp)
  - [Live site](#live-site)
  - [Description](#description)
  - [App structure and main functionality](#app-structure-and-main-functionality)
  - [Developer notes](#developer-notes)
    - [Development Environment](#development-environment)
      - [Docker, NodeJs and databases](#docker-nodejs-and-databases)
        - [Task runner](#task-runner)
        - [Getting started](#getting-started)
    - [Build and production environment](#build-and-production-environment)
    - [Deployment](#deployment)

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
  - IP restriction middleware (disabled by default)
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

#### Docker, NodeJs and databases

See `Dockerfile` and `docker-compose.dev.yaml` for the details of the development environment setup. Overview: NodeJS v12.16.1, MongoDB v5, Redis v6.

The app runs with a new local database. When empty and in development mode, the app will seed the database with some sample data.

Two users are created by default:

- Username: `admin` password: `!Admin123`
- Username: `camper` password: `!Camper123`
  The admin user can delete all campgrounds and comments.

_Note_: To have access to all functionality you need API keys for the mail server (Mailgun API), maps (Google Maps API).

The docker-compose file does already set some environment variables, and Redis and MongoDB connection details, but to effectively use the functionality of the app you need API keys for Mailgun and Google Maps.

##### Task runner

Gulp Task runner is used for:

- SASS compilation;
- Nodemon + BrowserSync;
- Build task: includes Webpack for JavaScript bundling, minification and image optimization.

##### Getting started

- Clone the repo.
- Run `docker compose -f docker-compose.dev.yaml up --build`

This wil run the app in development mode. You now should have a Redis container and a MongoDB container and a container for the Express app. The app will automatically run, listening on port 3000. BrowserSync runs on port 4000.

### Build and production environment

Use `npm run build` to build the production code in the `dist` folder. This executes the build tasks defined in the Gulp task runner.

With access to the correct `.env` file with API credentials you can run a production version of the app on a local machine with `npm run prod`.

In production mode the app is configured to connect to a cloud hosted MongoDB database and a cloud hosted Redis server.

### Deployment

Make sure proper keys, links and credentials are present in the NodeJs .env configuration on the server.

While the local development environment relies upon Docker compose with a local database and a local redis server, the setup on the server is _cloud based_ with a hosted database via [MongoDB Cloud Services](https://cloud.mongodb.com/) and a hosted session management database via [Redis Labs Cloud](https://redis.com).
