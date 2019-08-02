const   {src, dest}     = require('gulp'),
        autoprefixer    = require('autoprefixer'),
        sass            = require('gulp-sass'),
        postcss         = require('gulp-postcss');
    
sass.compiler = require('node-sass');

const   baseDir     = './app'
        sassGlob    = baseDir + '/public/styles/**/*.scss',
        publicFldr  = baseDir + '/public';

function styleTask(){
    return src(sassGlob, { sourcemaps: true })
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss([autoprefixer]))
        .pipe(dest(publicFldr, { sourcemaps: true }))
};

module.exports = {
    styleTask: styleTask,
    sassGlob: sassGlob
};