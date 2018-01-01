# Mocha test-runner with gulp

### Passing shared module in all tests

```js
// npm install gulp@next gulp-mocha

var gulp = require('gulp');
var mocha = require('gulp-mocha');

gulp.task('default', function() {
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

```js
// npm install gulp@next gulp-mocha gulplog

var gulp = require('gulp');
var mocha = require('gulp-mocha');
var log = require('gulplog');

gulp.task('mocha', function() {
    return gulp.src(['test/*.js'], { read: false })
        .pipe(mocha({ reporter: 'list' }))
        .on('error', log.error);
});

gulp.task('watch-mocha', function() {
    gulp.watch(['lib/**', 'test/**'], gulp.series('mocha'));
});
```
