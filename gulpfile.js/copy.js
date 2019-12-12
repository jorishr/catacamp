const   { src, dest, series, parallel }  = require('gulp'),
        del                              = require('del'),
        debug                            = require('gulp-debug');

//  globs and paths
const   baseDir         = './app'
        buildDir        = './dist'
        webfontsGlob    = './node_modules/@fortawesome/fontawesome-free/webfonts/**',
        vendorDir       = baseDir + '/public/styles/vendor',
        buildVendorDir  = buildDir + '/public/styles/vendor';
        configFiles     = ['.env', 'README.md']; 

//  copy fontawesome webfonts for development
function copyDevFiles(){
    return src(webfontsGlob)
    .pipe(dest(vendorDir + '/fontawesome/webfonts'));
};

function clean(){
    return del(vendorDir + '/fontawesome');
}

//  copy fontawesome webfonts for build
function copyBuildFiles(){
    return src(webfontsGlob)
    .pipe(dest(buildVendorDir + '/fontawesome/webfonts'));
};

// copy .env and readme
function copyConfigFiles(){
    return src(configFiles)
    .pipe(debug())
    .pipe(dest(buildDir));
};

module.exports = {
    copyDevTask: series(clean, copyDevFiles),
    copyBuildTask: copyBuildFiles
}