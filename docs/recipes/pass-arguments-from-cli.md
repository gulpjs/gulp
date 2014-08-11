# Pass arguments from the command line

```js
// npm install --save-dev gulp yargs gulp-if gulp-uglify

var args = require('yargs').argv;
var gulp = require('gulp');
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');

var isProduction = args.type === 'production';

gulp.task('scripts', function() {
  return gulp.src('**/*.js')
    .pipe(gulpif(isProduction, uglify())) // only minify in production
    .pipe(gulp.dest('dist'));
});
```

The run gulp with:

```sh
$ gulp scripts --type production
```
