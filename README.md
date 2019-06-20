# yelp-camp

Customizations:
-   GIT + GULP: 
        The original project does not include version control nor a taskrunner.
        I use GIT for version control and Gulp+Nodemon+BrowserSync during 
        development. https://gist.github.com/jorishr

-   Modified the file structure to seperate configuration files from the app 
    files. This requires the use of PATH in the EXPRESS setup. 

-   Used a local install of bootstrap v4 instead of the CDN version 3

-   Images are loaded from the server, not an external source.  