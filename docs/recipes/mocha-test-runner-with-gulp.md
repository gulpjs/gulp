# Mocha test-runner with gulp

### Passing shared module in all tests

```js
var gulp = require('gulp');
var mocha = require('gulp-mocha');
 
gulp.task('tests', function() {
    return gulp.src(['test/test-*.js'], { read: false })
        .pipe(mocha({
            reporter: 'spec',
            globals: {
                should: require('should')
            }
        }));
});
```

### Running mocha tests when files change

With bundled `gulp.watch` and [`gulp-batch`](https://github.com/floatdrop/gulp-batch) (see readme of gulp-batch for reasons):

```js
// npm install gulp gulp-watch gulp-mocha gulp-batch
 
var gulp = require('gulp');
var mocha = require('gulp-mocha');
var batch = require('gulp-batch');
var gutil = require('gulp-util');

gulp.task('mocha', function () {
    return gulp.src(['test/*.js'], { read: false })
        .pipe(mocha({ reporter: 'list' }))
        .on('error', gutil.log);
});

gulp.watch(['lib/**', 'test/**'], batch(function(events, cb) {
    gulp.run('mocha', cb);
}));
```

With [`gulp-watch`](https://github.com/floatdrop/gulp-watch) plugin:

```js
// npm i gulp gulp-watch gulp-mocha

var gulp = require('gulp');
var mocha = require('gulp-mocha');
var watch = require('gulp-watch');
var gutil = require('gulp-util')

gulp.task('mocha', function () {
    return gulp.src(['test/*.js'], { read: false })
        .pipe(mocha({ reporter: 'list' }))
        .on('error', gutil.log);
});

gulp.task('watch', function() {
    return gulp.src(['lib/**', 'test/**'], { read: false })
        .pipe(watch(function(events, cb) {
            gulp.run('mocha', cb);
        }));
});

gulp.task('default', ['mocha', 'watch']);

// run `gulp watch` or just `gulp` for watching and rerunning tests
```
