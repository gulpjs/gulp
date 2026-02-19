# Sass and Nunjucks with static asset revisioning

Static asset revisioning by appending content hash to filenames. Make sure to set the files to [never expire](http://developer.yahoo.com/performance/rules.html#expires) for this to have an effect.

Sass and Nunjucks are here just to demonstrate how to implement static asset revisioning in a more real-world scenario. The content has will be appended in production, so it's recommended to add the following npm scripts to `package.json`:

```json
{
  "scripts": {
    "dev": "gulp-dev",
    "build": "NODE_ENV=production gulp build"
  }
}
```

Now to install the required dependencies:

```sh
npm install --save-dev gulp gulp-rev gulp-rev-rewrite gulp-sass gulp-nunjucks gulp-if del
```

And, finally, `gulpfile.js`:

```js
const gulp = require('gulp')
const sass = require('gulp-sass')
const nunjucks = require('gulp-nunjucks')
const rev = require('gulp-rev')
const revRewrite = require('gulp-rev-rewrite')
const gulpIf = require('gulp-if')
const del = require('del')

const isProd = process.env.NODE_ENV === 'production'

function clean() {
  return del('dist')
}

function styles() {
  return gulp
    .src('styles/style.scss')
    .pipe(sass().on('error', sass.logError))
    // appends the content hash
    .pipe(gulpIf(isProd, rev()))
    .pipe(gulp.dest('dist'))
    // output rev-manifest.json
    .pipe(gulpIf(isProd, rev.manifest()))
    .pipe(gulp.dest('dist'))
}

function views() {
  const manifest = gulp.src(
    'dist/rev-manifest.json',
    // in development the manifest doesn't exist
    { allowEmpty: !isProd }
   )
  return gulp
    .src('views/**/*.njk')
    .pipe(nunjucks.compile({ title: 'Hello world!' }))
    // this updates the reference(s) to revisioned assets
    .pipe(gulpIf(isProd, revRewrite({ manifest })))
    .pipe(gulp.dest('dist'))
}

function watch() {
  gulp.watch('styles/**/*.scss')
  gulp.watch('views/**/*.njk')
}

// after everything is done, we no longer need the manifest file
function deleteRevManifest() {
  return del('dist/rev-manifest.json')
}

exports.dev = gulp.series(clean, gulp.parallel(styles, views), watch)
// in build it's important that "views" runs AFTER "styles"
// if it runs before, the manifest file won't exist yet
exports.build = gulp.series(clean, styles, views, deleteRevManifest)
```
