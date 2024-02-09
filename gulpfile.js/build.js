const { src, dest, parallel, series } = require("gulp"),
  imageMin = require("gulp-imagemin"),
  //debug = require('gulp-debug'),
  htmlMin = require("gulp-htmlmin"),
  replace = require("gulp-replace"),
  terser = require("gulp-terser"),
  copy = require("./copy"),
  styles = require("./styles");

//  copy and styles task are added in the module.exports below

const baseDir = "./app",
  buildDir = "./dist",
  imgGlob = baseDir + "/public/images/**/*",
  ejsGlob = baseDir + "/views/**/*.ejs",
  appJsGlob = [baseDir + "/**/*.js", "!" + baseDir + "/public/scripts/**/*.js"];

function optimizeImages() {
  return src(imgGlob, { base: "app" })
    .pipe(
      imageMin(
        [
          imageMin.gifsicle({ interlaced: true }),
          imageMin.jpegtran({ quality: 75, progressive: true }),
          imageMin.optipng({ optimizationLevel: 5 }),
        ],
        { verbose: true }
      )
    )
    .pipe(dest(buildDir));
}

/*  
    minify js 
    Note: there is an unresolved issue when processing a large number of files
    through the terser(). Files process correctly, though not all. Console 
    complains about task task not completed.
*/
function appJsBuild() {
  return (
    src(appJsGlob, { base: "app" })
      //.pipe(debug())
      .pipe(terser())
      .pipe(dest(buildDir))
  );
}

function minifyHtml() {
  return src(ejsGlob, { base: "app" })
    .pipe(
      htmlMin({
        collapseWhitespace: true,
        removeComments: true,
      })
    )
    .pipe(dest(buildDir));
}

function replaceDbString() {
  return src(`${buildDir}/bin/www.js`)
    .pipe(replace("DB_CONN_LOCAL", "DB_CONN_CLOUD"))
    .pipe(dest(`${buildDir}/bin`));
}

function replaceRedisString() {
  return src(`${buildDir}/app.js`)
    .pipe(replace("REDIS_LOCAL_HOST", "REDIS_CLOUD_HOST"))
    .pipe(replace("REDIS_LOCAL_PORT", "REDIS_CLOUD_PORT"))
    .pipe(dest(`${buildDir}`));
}

module.exports = {
  optimizeImages: optimizeImages,
  minifyHtml: minifyHtml,
  appJsBuild: appJsBuild,
  build: series(
    parallel(
      optimizeImages,
      styles.styleTask,
      appJsBuild,
      minifyHtml,
      copy.copyBuildTask
    ),
    parallel(replaceDbString, replaceRedisString)
  ),
};
