<p align="center">
  <a href="http://gulpjs.com">
    <img height="257" width="114" src="https://raw.githubusercontent.com/gulpjs/artwork/master/gulp-2x.png">
  </a>
</p>

# gulp [![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-url] [![Support us][gittip-image]][gittip-url] [![Build Status][travis-image]][travis-url] [![Coveralls Status][coveralls-image]][coveralls-url]
> The streaming build system

## Like what we do?

[Support us via Gratipay](https://gratipay.com/WeAreFractal/)

## Documentation

For a Getting started guide, API docs, recipes, making a plugin, etc. see the [documentation page](/docs/README.md)!

## Sample `gulpfile.js`

This file is just a quick sample to give you a taste of what gulp does.

```js
var gulp = require('gulp');
var coffee = require('gulp-coffee');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var sourcemaps = require('gulp-sourcemaps');
var del = require('del');

var paths = {
  scripts: ['client/js/**/*.coffee', '!client/external/**/*.coffee'],
  images: 'client/img/**/*'
};

/* Register some tasks to expose to the cli */
gulp.task('build', gulp.series(
  clean,
  gulp.parallel(scripts, images)
));
gulp.task(clean);
gulp.task(watch);

// The default task (called when you run `gulp` from cli)
gulp.task('default', gulp.series('build'));


/* Define our tasks using plain functions */

// Not all tasks need to use streams
// A gulpfile is just another node program and you can use all packages available on npm
function clean(done) {
  // You can use multiple globbing patterns as you would with `gulp.src`
  del(['build'], done);
}

// Copy all static images
function images() {
  return gulp.src(paths.images)
    // Pass in options to the task
    .pipe(imagemin({optimizationLevel: 5}))
    .pipe(gulp.dest('build/img'));
}

// Minify and copy all JavaScript (except vendor scripts)
// with sourcemaps all the way down
function scripts() {
  return gulp.src(paths.scripts)
    .pipe(sourcemaps.init())
      .pipe(coffee())
      .pipe(uglify())
      .pipe(concat('all.min.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('build/js'));
}

// Rerun the task when a file changes
function watch() {
  gulp.watch(paths.scripts, scripts);
  gulp.watch(paths.images, images);
}
```

## Incremental Builds

You can filter out unchanged files between runs of a task using
the `gulp.src` function's `since` option and `gulp.lastRun`:
```js
function images() {
  return gulp.src(paths.images, {since: gulp.lastRun('images')})
    .pipe(imagemin({optimizationLevel: 5}))
    .pipe(gulp.dest('build/img'));
}

function watch() {
  gulp.watch(paths.images, images);
}
```
Task run times are saved in memory and are lost when gulp exits. It will only
save time during the `watch` task when running the `images` task
for a second time.

If you want to compare modification time between files instead, we recommend these plugins:
- [gulp-changed];
- or [gulp-newer] - supports many:1 source:dest.

[gulp-newer] example:
```js
function images() {
  var dest = 'build/img';
  return gulp.src(paths.images)
    .pipe(newer(dest))  // pass through newer images only
    .pipe(imagemin({optimizationLevel: 5}))
    .pipe(gulp.dest(dest));
}
```

If you can't simply filter out unchanged files, but need them in a later phase
of the stream, we recommend these plugins:
- [gulp-cached] - in-memory file cache, not for operation on sets of files
- [gulp-remember] - pairs nicely with gulp-cached

[gulp-remember] example:
```js
function scripts() {
  return gulp.src(scriptsGlob)
    .pipe(cache('scripts'))    // only pass through changed files
    .pipe(header('(function () {')) // do special things to the changed files...
    .pipe(footer('})();'))     // for example,
                               // add a simple module wrap to each file
    .pipe(remember('scripts')) // add back all files to the stream
    .pipe(concat('app.js'))    // do things that require all files
    .pipe(gulp.dest('public/'))
}
```

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

[gulp-cached]: https://github.com/wearefractal/gulp-cached
[gulp-remember]: https://github.com/ahaurw01/gulp-remember
[gulp-changed]: https://github.com/sindresorhus/gulp-changed
[gulp-newer]: https://github.com/tschaub/gulp-newer
