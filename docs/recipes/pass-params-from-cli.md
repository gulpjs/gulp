# Pass parameters from the command line
## bonus: keeping those tasks DRY

---

`gulpfile.js`

```js
// npm install gulp gulp-util gulp-if gulp-uglify 
var gulp   = require('gulp');
var gutil  = require('gulp-util');
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');

var isProduction = gutil.env.type === 'production';

gulp.task('scripts', function () {
  return gulp.src('**/*.js')
    .pipe(gulpif(isProduction, uglify())) // only minify if production
    .pipe(gulp.dest('dist'));
});
```

---

`cli`

`gulp scripts --type production`
