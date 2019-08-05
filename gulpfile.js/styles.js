require('dotenv').config({ debug: process.env.DEBUG });

const   {src, dest}     = require('gulp'),
        gulpif          = require('gulp-if'),
        autoprefixer    = require('autoprefixer'),
        sass            = require('gulp-sass'),
        postcss         = require('gulp-postcss'),
        cssnano         = require('gulp-cssnano'),
        devMode         = (process.env.NODE_ENV === 'development'),
        buildMode       = (process.env.NODE_ENV === 'production');
    
sass.compiler = require('node-sass');

const   baseDir     = './app'
        buildDir    = './dist';
        sassGlob    = baseDir + '/public/styles/**/*.scss',
        publicDir   = baseDir + '/public';
        
// cssnano options
const cssnanoOptions = {
    reduceIdents: {
        keyframes: false
    },
    discardUnused: {
        keyframes: false
    }
};

function styleTask(){
    //console.log('Mode: ', process.env.NODE_ENV);
    return src(sassGlob, { sourcemaps: devMode ? true : false })
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss([autoprefixer]))
        .pipe(gulpif(buildMode, cssnano(cssnanoOptions)))    
        .pipe(dest(devMode ? publicDir : buildDir + '/public', { sourcemaps: devMode ? true : false }))
};

module.exports = {
    styleTask: styleTask,
    sassGlob: sassGlob
};