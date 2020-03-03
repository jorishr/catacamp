const   { series, watch, parallel } = require('gulp'),
        nodemon     = require('nodemon'),
        browserSync = require('browser-sync'),
        styles      = require('./styles'),      
        jsTask      = require('./scripts'),
        copy        = require('./copy'),        
        build       = require('./build');    

//  globs and paths
const   baseDir     = './app'
        styleFiles  = styles.sassGlob,
        ejsFiles    = baseDir + '/views/**/*.ejs',
        jsFiles     = baseDir + '/public/scripts/**/*.js';

/*  
    Nodemon config:
    - watch core server file(s) that require server restart on change
    - changes in js files in the public are handled seperately in jsTask 
    - browser-sync delay to account for server loading time
  */
function startNodemon(cb) {
    let called = false;
    return nodemon({
        script: baseDir + '/app.js',
        watch:  baseDir + '/**/*.js',
        ignore: baseDir + '/public'
    })
    .on('start', function onStart() {
        // ensure start only got called once
        if (!called) { cb(); }
        called = true;
    })
    .on('restart', function onRestart() {
        // reload connected browsers after a slight delay
        console.log('Restarting server...');
        setTimeout(function reload() {
            browserSync.reload({
                stream: false
            });
        }, 4000);
    });
};

//  browser-sync
function startBrowserSync (){
    browserSync({
      //    proxy the expressjs app and use a different port 
      proxy: 'http://localhost:3000',
      port: 4000,
      files: baseDir + '/public/*.css'   //  watch main css file changes and inject
    });
};

function bsReload(cb) {
    browserSync.reload({
        stream: false
    });
    cb();
};

//  watch task
function watchFiles(){
    watch(styleFiles, styles.styleTask);
    watch(ejsFiles, bsReload);
    watch(jsFiles, series(jsTask, bsReload));
};

exports.watch = parallel(series(startNodemon, startBrowserSync), watchFiles);
exports.copy = copy.copyDevTask;
/*
exports.js = jsTask;
exports.styles = styles.styleTask; 
exports.img = build.optimizeImg;
exports.html = build.minifyHtml;
exports.jsBuild = build.appJsBuild; 
*/
exports.build = build.build;