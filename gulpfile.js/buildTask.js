const   {src, dest}     = require('gulp'), 
        del             = require('del'),
        imageMin        = require('gulp-imagemin'),
        cssnano         = require('gulp-cssnano'),
        rev             = require('gulp-rev'),
        revReplace      = require('gulp-rev-replace'),
        uglify          = require('gulp-uglify'),
        replaceInFile   = require('replace-in-file'),
        htmlMin         = require('gulp-htmlmin');

let imageFiles = '';
let imageDest = '';

function optimizeImages(){
    return src(imageFiles)
        .pipe(imageMin({
            progressive: true,  // jpeg
            interlaced: true,   // gif
            multipass: true     // svg
        }))
        .pipe(dest(imageDest));
};

function cssBuild(){
    return src('./app/temp/styles/styles.css')
        .pipe(cssnano())    
        .pipe(rev())
        .pipe(dest('./dist/assets/styles'))
        .pipe(rev.manifest())   // produces rev-manifest.json
        .pipe(dest('./dist/assets/styles'))
};

function minifyHtml(){
    return src('./app/index.html')
        .pipe(htmlMin({
            collapseWhitespace: true,
            removeComments: true
        }))
        .pipe(dest('./dist'));
};