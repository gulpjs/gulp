# Output both a minified and non-minified version

Outputting both a minified and non-minified version of your combined JavaScript files can be achieved by using `gulp-rename` and piping to `dest` twice (once before minifying and once after minifying):

```js
'use strict';

var gulp = require('gulp');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');

var DEST = 'build/';

gulp.task('default', function() {
  return gulp.src('foo.js')
    // This will output the non-minified version
    .pipe(gulp.dest(DEST))
    // This will minify and rename to foo.min.js
    .pipe(uglify())
    .pipe(rename({ extname: '.min.js' }))
    .pipe(gulp.dest(DEST));
});

```
