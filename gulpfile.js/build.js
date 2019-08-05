const   {src, dest, parallel}     = require('gulp'), 
        imageMin        = require('gulp-imagemin'),
        //debug           = require('gulp-debug'),
        htmlMin         = require('gulp-htmlmin'),
        terser          = require('gulp-terser'),
        copy            = require('./copy'),        //  import copy OJECT
        styles          = require('./styles');      //  import styles OBJECT

//  copy and styles task are added in the module.exports below

//  paths and globs
const   baseDir     = './app',
        buildDir    = './dist',
        imgGlob     = baseDir + '/public/images/**/*',
        ejsGlob     = baseDir + '/views/**/*.ejs',
        appJsGlob   = [baseDir + '/**/*.js', '!' + baseDir + '/public/scripts/**/*.js'];

//  optimize image files
function optimizeImages(){
    return src(imgGlob, { base: 'app' })
        .pipe(imageMin({
            progressive: true,  // jpeg
            interlaced: true,   // gif
            multipass: true     // svg
        }))
        .pipe(dest(buildDir));
};

/*  
    minify js 
    Note: there is an unresolved issue when processing a large number of files
    through the terser(). Files process correctly, though not all. Console 
    complains about task task not completed.
*/
function appJsBuild(){
    return src(appJsGlob, { base: 'app' })
        //.pipe(debug())
        .pipe(terser())
        .pipe(dest(buildDir));
};

//  minify ejs files
function minifyHtml(){
    return src(ejsGlob, { base: 'app' })
        .pipe(htmlMin({
            collapseWhitespace: true,
            removeComments: true
        }))
        .pipe(dest(buildDir));
};

module.exports = {
    optimizeImages: optimizeImages,
    minifyHtml: minifyHtml,
    appJsBuild: appJsBuild,
    build: parallel(optimizeImages, styles.styleTask, appJsBuild, minifyHtml, copy.copyBuildTask)
};