# Pass parameters from the command line
## bonus: keeping those tasks DRY

---

`gulpfile.js`

```js
// npm install gulp yargs gulp-if gulp-uglify
var args   = require('yargs').argv;
var gulp   = require('gulp');
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');

var isProduction = args.type === 'production';

gulp.task('scripts', function() {
  return gulp.src('**/*.js')
    .pipe(gulpif(isProduction, uglify())) // only minify if production
    .pipe(gulp.dest('dist'));
});
```

---

`cli`

`gulp scripts --type production`
