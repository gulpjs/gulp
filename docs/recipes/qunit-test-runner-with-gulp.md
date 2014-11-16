# QUnit test-runner with gulp

### Passing shared module in all tests

```js
// npm install gulp gulp-qunit

var gulp = require('gulp');
var qunit = require('gulp-qunit');

gulp.task('test', function() {
  return gulp.src(['test/test-*.js'])
    .pipe(qunit());
});

gulp.task('default', ['test']);

### Running QUnit tests when files change

```js
// npm install gulp gulp-qunit gulp-util

var gulp = require('gulp');
var qunit = require('gulp-qunit');
var gutil = require('gulp-util');

gulp.task('qunit', function() {
    return gulp.src(['test/*.js'])
      .pipe(qunit())
      .on('error', gutil.log);
});

gulp.task('watch', function() {
    gulp.watch(['js/**', 'test/**'], ['qunit']);
});
```
