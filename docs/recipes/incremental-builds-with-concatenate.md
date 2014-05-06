# Incremental rebuilding, including operating on full file sets

The trouble with incremental rebuilds is you often want to operate on _all_ processed files, not just single files. For example, you may want to lint and module-wrap just the file(s) that have changed, then concatenate it with all other linted and module-wrapped files. This is difficult without the use of temp files.

Use [gulp-cached](https://github.com/wearefractal/gulp-cached) and [gulp-remember](https://github.com/ahaurw01/gulp-remember) to achieve this goal.

```javascript
var gulp = require('gulp'),
    header = require('gulp-header'),
    footer = require('gulp-footer'),
    concat = require('gulp-concat'),
    jshint = require('gulp-jshint'),
    cached = require('gulp-cached'),
    remember = require('gulp-remember');

var scriptsGlob = 'src/**/*.js';

gulp.task('scripts', function () {
  return gulp.src(scriptsGlob)
      .pipe(cached('scripts')) // only pass through changed files
      .pipe(jshint()) // do special things to the changed files...
      .pipe(header('(function () {')) // e.g. jshinting ^^^
      .pipe(footer('})();')) // and some kind of module wrapping
      .pipe(remember('scripts')) // add back all files to the stream
      .pipe(concat('app.js')) // do things that require all files
      .pipe(gulp.dest('public/'))
});

gulp.task('watch', function () {
  var watcher = gulp.watch(scriptsGlob, ['scripts']); // watch the same files in our scripts task
  watcher.on('change', function (event) {
    if (event.type === 'deleted') { // if a file is deleted, forget about it
      delete cache.caches['scripts'][event.path]; // gulp-cached remove api
      remember.forget('scripts', event.path); // gulp-remember remove api
    }
  });
});
```
