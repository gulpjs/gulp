# Sharing streams with labeledpipe

Often gulpfiles contain multiple tasks with similar structure.  This can lead to significant repetition, and the chance that minor typos will creep into your code.  With [labeledpipe](https://github.com/factset/labeledpipe), we can create stream factories which create the common structure, then insert additional transforms at arbitrary locations.

```js
var gulp = require('gulp');
var cache = require('gulp-cached');
var remember = require('gulp-remember');
var concat = require('gulp-concat');
var babel = require('gulp-babel');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var cssnano = require('gulp-cssnano');

function scripts() {
  return gulp.src('src/**/*.js')
    .pipe(cache('my-project.js'))
    .pipe(babel())
    .pipe(remember('my-project.js'))
    .pipe(concat('my-project.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist'))
  ;
}

function styles() {
  return gulp.src('src/**/*.scss')
    .pipe(cache('my-project.css'))
    .pipe(sass())
    .pipe(remember('my-project.css'))
    .pipe(concat('my-project.css'))
    .pipe(cssnano())
    .pipe(gulp.dest('dist'))
  ;
}

gulp.task('scripts', scripts);
gulp.task('styles', styles);
```

In the above example, notice that the scripts and styles pipelines both consist of these steps:
  1. Read a set of files
  1. Do some processing on each changed file.
  1. Concatenate all of the files.
  1. Do some processing on the combined file.
  1. Write the combined file to disk.

In the following example we factor this common structure into a single function, `concatPipeline`.  Notice the scripts and styles pipeline are now only concerned with the transforms unique to their file types.

```js
var gulp = require('gulp');
var cache = require('gulp-cached');
var remember = require('gulp-remember');
var concat = require('gulp-concat');
var babel = require('gulp-babel');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var cssnano = require('gulp-cssnano');
var labeledpipe = require('labeledpipe');

function concatPipeline(srcGlob, outputFile) {
  return labeledpipe()
    .pipe('gulpSource', gulp.src, srcGlob)
    .pipe('cache', cache, outputFile)
    .pipe('remember', remember, outputFile)
    .pipe('concat', concat, outputFile)
    .pipe('gulpDest', gulp.dest, 'dist')
  ;
}

var scripts = concatPipeline('src/**/*.js', 'my-project.js')
  .before('remember')
    .pipe('transpile', babel)
  .after('concat')
    .pipe('minify', uglify)
;

var styles = concatPipeline('src/**/*.scss', 'my-project.css')
  .before('remember')
    .pipe('transpile', sass)
  .after('concat')
    .pipe('minify', cssnano)
;

gulp.task('scripts', scripts);
gulp.task('styles', styles);
```

## Sharing pipelines across projects

Labeledpipe can also be used to share pipelines across projects.  Imagine you've factored the previous scripts pipeline into its own module:

```js
var concatPipeline = require('./concat-pipeline');
var babel = require('gulp-babel');
var uglify = require('gulp-uglify');

module.exports = function basicScripts(srcGlob, outputFile) {
  return concatPipeline(srcGlob, outputFile)
    .before('remember')
      .pipe('transpile', babel)
    .after('concat')
      .pipe('minify', uglify)
  ;
};
```

But now you're working on an angular project, and you would really like your scripts pipeline to run each file though `ngAnnotate`:

```js
var gulp = require('gulp');
var annotate = require('gulp-ng-annotate');
var basicScripts = require('./scripts-pipeline')

var scripts = basicScripts('src/**/*.js', 'my-project.js')
  .after('transpile')
    .pipe('ngAnnotate', annotate)
;

gulp.task('scripts', scripts);
```
