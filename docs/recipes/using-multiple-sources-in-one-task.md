# Using multiple sources in one task

```js
// npm install --save-dev gulp merge-stream

var gulp = require('gulp');
var merge = require('merge-stream');

gulp.task('test', function() {
  var bootstrap = gulp.src('bootstrap/js/*.js')
    .pipe(gulp.dest('public/bootstrap'));

  var jquery = gulp.src('jquery.cookie/jquery.cookie.js')
    .pipe(gulp.dest('public/jquery'));

  return merge(bootstrap, jquery);
});
```

An alternate solution for gulp >v4
```js
// npm install --save-dev gulp merge-stream

var gulp = require('gulp');
var gulpStreamToPromise = require('gulp-stream-to-promise');

gulp.task('test', function() {
  var bootstrap = gulp.src('bootstrap/js/*.js')
    .pipe(gulp.dest('public/bootstrap'));

  var jquery = gulp.src('jquery.cookie/jquery.cookie.js')
    .pipe(gulp.dest('public/jquery'));

  return Promise.all([
    gulpStreamToPromise(bootstrap), 
    gulpStreamToPromise(jquery)
  ]);
});

```

`gulp.src` will emit files in the order they were added:

```js
// npm install gulp gulp-concat

var gulp = require('gulp');
var concat = require('gulp-concat');

gulp.task('default', function() {
  return gulp.src(['foo/*', 'bar/*'])
    .pipe(concat('result.txt'))
    .pipe(gulp.dest('build'));
});
