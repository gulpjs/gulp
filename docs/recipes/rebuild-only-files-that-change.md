# Rebuild only files that change

With [`gulp-watch`](https://github.com/floatdrop/gulp-watch):

```js
var gulp = require('gulp');
var sass = require('gulp-sass');
var watch = require('gulp-watch');

gulp.task('default', function() {
    return gulp.src('./sass/*.scss')
        .pipe(watch())
        .pipe(sass())
        .pipe(gulp.dest('./dist/'));
});
```
