# Sourcemaps with Sass (gulp-sass) and Autoprefixer

Sass and Autoprefixer play well together, but it can be hard to get nice sourcemaps when mixing these. 
This solution seems to work for many people.


```js
// npm install --save-dev gulp gulp-autoprefixer gulp-sass gulp-sourcemaps gulp-filter gulp-plumber

var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var gulpFilter = require('gulp-filter');
var plumber = require('gulp-plumber');

// we define some constants here so they can be reused
var SRC = 'scss/**/*.{scss,sass}';
var DEST = 'css/';

// avoid writing sourcemaps of sourcemaps
var filter = gulpFilter(['*.css', '!*.map']);

gulp.task('default', function() {
	return gulp.src(SRC)
      .pipe(plumber())
      .pipe(sourcemaps.init())
      .pipe(sass({ errLogToConsole: true }))
      .pipe(sourcemaps.write('./'))
      .pipe(filter)
      .pipe(autoprefixer({ browsers: ['last 2 versions' ], cascade: true })) // autoprefixer options. Just an example
      .pipe(filter.restore())
      .pipe(gulp.dest(DEST));
  });
});

```
