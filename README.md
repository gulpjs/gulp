<p align="center">
  <a href="http://gulpjs.com">
    <img height="257" width="114" src="https://raw.githubusercontent.com/gulpjs/artwork/master/gulp-2x.png"/>
  </a>
</p>

# gulp [![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-url] [![Support us][gittip-image]][gittip-url] [![Build Status][travis-image]][travis-url] [![Coveralls Status][coveralls-image]][coveralls-url]
> The streaming build system

## Like what we do?

[Support us via gittip](https://www.gittip.com/WeAreFractal/)

## Documentation

For a Getting started guide, API docs, recipes, making a plugin, etc. see the [documentation page](/docs/README.md)!

## Sample `gulpfile.js`

This file is just a quick sample to give you a taste of what gulp does.

```javascript
var gulp = require('gulp');

var coffee = require('gulp-coffee');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');

var rimraf = require('rimraf');

var paths = {
  scripts: ['client/js/**/*.coffee', '!client/external/**/*.coffee'],
  images: 'client/img/**/*'
};

// Not all tasks need to use streams
// A gulpfile is just another node program and you can use all packages available on npm
gulp.task('clean', function(cb){
  rimraf('build/', cb);
});

gulp.task('scripts', ['clean'], function() {
  // Minify and copy all JavaScript (except vendor scripts)
  return gulp.src(paths.scripts)
    .pipe(coffee())
    .pipe(uglify())
    .pipe(concat('all.min.js'))
    .pipe(gulp.dest('build/js'));
});

// Copy all static images
gulp.task('images', ['clean'], function() {
 return gulp.src(paths.images)
    // Pass in options to the task
    .pipe(imagemin({optimizationLevel: 5}))
    .pipe(gulp.dest('build/img'));
});

// Rerun the task when a file changes
gulp.task('watch', function() {
  gulp.watch(paths.scripts, ['scripts']);
  gulp.watch(paths.images, ['images']);
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['watch', 'scripts', 'images']);

```

## Incremental Builds

We recommend these plugins:

- [gulp-changed](https://github.com/sindresorhus/gulp-changed) - only pass through changed files
- [gulp-cached](https://github.com/wearefractal/gulp-cached) - in-memory file cache, not for operation on sets of files 
- [gulp-remember](https://github.com/ahaurw01/gulp-remember) - pairs nicely with gulp-cached
- [gulp-newer](https://github.com/tschaub/gulp-newer) - pass through newer source files only, supports many:1 source:dest

## Want to contribute?

Anyone can help make this project better - check out the [Contributing guide](/CONTRIBUTING.md)!


[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/wearefractal/gulp/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

[gittip-url]: https://www.gittip.com/WeAreFractal/
[gittip-image]: http://img.shields.io/gittip/WeAreFractal.svg

[downloads-image]: http://img.shields.io/npm/dm/gulp.svg
[npm-url]: https://npmjs.org/package/gulp
[npm-image]: http://img.shields.io/npm/v/gulp.svg

[travis-url]: https://travis-ci.org/gulpjs/gulp
[travis-image]: http://img.shields.io/travis/gulpjs/gulp.svg

[coveralls-url]: https://coveralls.io/r/gulpjs/gulp
[coveralls-image]: http://img.shields.io/coveralls/gulpjs/gulp/master.svg
