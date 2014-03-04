# Sharing Streams with Stream Factories

If you use the same plugins in multiple tasks you might find yourself getting that itch to DRY things up. This method will allow you to create factories to split out your commonly used stream chains.

This uses [lazypipe](https://github.com/OverZealous/lazypipe) to get the job done.

Let's take a look at what this will do for you.

This is our sample file:

```js
var gulp = require('gulp');

var uglify = require('gulp-uglify');
var coffee = require('gulp-coffee');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');

gulp.task('bootstrap', function() {
  return gulp.src('bootstrap/js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter(stylish))
    .pipe(uglify())
    .pipe(gulp.dest('public/bootstrap'));
});

gulp.task('coffee', function() {
  return gulp.src('lib/js/*.coffee')
    .pipe(coffee())
    .pipe(jshint())
    .pipe(jshint.reporter(stylish))
    .pipe(uglify())
    .pipe(gulp.dest('public/js'));
});
```

and our file after using lazypipe looks like this:

```js
var gulp = require('gulp');
var lazypipe = require('lazypipe');

var uglify = require('gulp-uglify');
var coffee = require('gulp-coffee');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');

// give lazypipe
var jsTransform = lazypipe()
  .pipe(jshint)
  .pipe(jshint.reporter, stylish)
  .pipe(uglify);

gulp.task('bootstrap', function() {
  return gulp.src('bootstrap/js/*.js')
    .pipe(jsTransform())
    .pipe(gulp.dest('public/bootstrap'));
});

gulp.task('coffee', function() {
  return gulp.src('lib/js/*.coffee')
    .pipe(coffee())
    .pipe(jsTransform())
    .pipe(gulp.dest('public/js'));
});
```

You can see we split out our javascript pipeline (jshint + uglify) that was being reused in multiple tasks into a factory. These factories can be reused in as many tasks as you want. You can also nest factories and you can chain factories together for great effect. Splitting out each shared pipeline also gives you one central location to modify if you decide to change up your workflow.
