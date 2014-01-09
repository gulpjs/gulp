<p align="center">
  <a href="http://gulpjs.com">
    <img height="194" width="98" src="https://raw.github.com/gulpjs/artwork/master/gulp.png"/>
  </a>
  <br/>
  <a href="http://gulpjs.com/">Visit our website!</a>
</p>

# gulp [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][depstat-image]][depstat-url]
> The streaming build system

## Documentation

For Getting started, API docs, recipes, making a plugin, etc. see the [documentation page](/docs/README.md)!

## Sample gulpfile

This file is just a quick sample to give you a taste of what gulp does.

```javascript
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');

gulp.task('scripts', function() {
  // Minify and copy all JavaScript (except vendor scripts)
  return gulp.src(['client/js/**/*.js', '!client/js/vendor/**'])
    .pipe(uglify())
    .pipe(gulp.dest('build/js'));
});

// Copy all static images
gulp.task('images', function() {
 return gulp.src('client/img/**')
    .pipe(imagemin())
    .pipe(gulp.dest('build/img'));
});

// The default task (called when you run `gulp`)
gulp.task('default', function() {
  gulp.run('scripts', 'copy');

  // Watch files and run tasks if they change
  gulp.watch('client/js/**', function() {
    gulp.run('scripts');
  });

  gulp.watch('client/img/**', function() {
    gulp.run('images');
  });
});
```


## gulp CLI

### Tasks

Tasks can be executed by running `gulp <task> <othertask>`. Just running `gulp` will execute the task you registered called `default`. If there is no `default` task gulp will error.

### Compilers

You can use any language you want for your gulpfile. You will have to specify the language module name so the CLI can load it (and its associated extensions) before attempting to find your gulpfile. Make sure you have this module installed accessible by the folder you are running the CLI in.

Example:

```
gulp dosomething --require coffee-script
```


[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/wearefractal/gulp/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

[npm-url]: https://npmjs.org/package/gulp
[npm-image]: https://badge.fury.io/js/gulp.png
[travis-url]: https://travis-ci.org/gulpjs/gulp
[travis-image]: https://travis-ci.org/gulpjs/gulp.png?branch=master
[depstat-url]: https://david-dm.org/gulpjs/gulp
[depstat-image]: https://david-dm.org/gulpjs/gulp.png
