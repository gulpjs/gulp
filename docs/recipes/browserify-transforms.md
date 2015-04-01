# Browserify + Transforms

[Browserify](http://github.com/substack/node-browserify) has become an important and indispensable
tool but requires being wrapped before working well with gulp. Below is a simple recipe for using
Browserify with transforms.

See also: the [Combining Streams to Handle Errors](https://github.com/gulpjs/gulp/blob/master/docs/recipes/combining-streams-to-handle-errors.md) recipe for handling errors with browserify or uglify in your stream.

``` javascript
'use strict';

var browserify = require('browserify');
var gulp = require('gulp');
var transform = require('vinyl-transform');
var gutil = require('gulp-util');
var reactify = require('reactify');

gulp.task('javascript', function () {
  // set up the browserify instance on a task basis
  var b = browserify({
    debug: true,
    // defining transforms here will avoid crashing your stream
    transform: [reactify]
  });
  // transform regular node stream to gulp (buffered vinyl) stream
  var browserified = transform(function(filename) {
    b.add(filename);
    return b.bundle();
  });

  return gulp.src('./app.js')
    .pipe(browserified)
    .pipe(sourcemaps.init({loadMaps: true}))
        // Add transformation tasks to the pipeline here.
        .pipe(uglify())
        .on('error', gutil.log)
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist/js/'));
});
```
