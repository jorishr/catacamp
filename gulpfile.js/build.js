const   {src, dest, parallel}     = require('gulp'), 
        del             = require('del'),
        imageMin        = require('gulp-imagemin'),
        cssnano         = require('gulp-cssnano'),
        rev             = require('gulp-rev'),
        revReplace      = require('gulp-rev-replace'),
        replaceInFile   = require('replace-in-file'),
        htmlMin         = require('gulp-htmlmin'),
        terser          = require('gulp-terser'),
        debug           = require('gulp-debug'),
        copy            = require('./copy');

// paths and globs
const   baseDir     = './app',
        buildDir    = './dist',
        imgGlob     = baseDir + '/public/images/**/*',
        cssGlob     = baseDir + '/public/*.css',
        ejsGlob     = baseDir + '/views/**/*.ejs',
        appJsGlob   = [baseDir + '/**/*.js', '!' + baseDir + '/public/scripts/**/*.js'],
        scriptsGlob = baseDir + '/public/scripts/**/*.js';


//  copy fontawesome files into build/public

function optimizeImages(){
    return src(imgGlob, { base: 'app' })
        .pipe(imageMin({
            progressive: true,  // jpeg
            interlaced: true,   // gif
            multipass: true     // svg
        }))
        .pipe(dest(buildDir));
};

//  minify css files
function cssBuild(){
    return src(cssGlob, { base: 'app' })
        .pipe(cssnano())    
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
    cssBuild: cssBuild,
    minifyHtml: minifyHtml,
    appJsBuild: appJsBuild,
    build: parallel(optimizeImages, cssBuild, appJsBuild, minifyHtml, copy.copyBuildTask)
};