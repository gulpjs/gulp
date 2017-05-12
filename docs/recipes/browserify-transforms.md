# Browserify + Transforms

[Browserify](http://github.com/substack/node-browserify) has become an important and indispensable
tool but requires being wrapped before working well with gulp. Below is a simple recipe for using
Browserify with transforms.

See also: the [Combining Streams to Handle Errors](https://github.com/gulpjs/gulp/blob/master/docs/recipes/combining-streams-to-handle-errors.md) recipe for handling errors with browserify or uglify in your stream.

``` javascript
'use strict';

var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var gutil = require('gulp-util');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('javascript', function () {
  // Bundle with browserify and then run gulp transforms on index.js, producing ./dist/js/app.js
  browserify({
    entries: './entry.js',
    debug: true
  }).bundle()
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
        // Add transformation tasks to the pipeline here.
        .pipe(uglify())
        .on('error', gutil.log)
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist/js/'));
});
```
