<p align="center">
  <a href="http://gulpjs.com">
    <img height="194" width="98" src="https://raw.github.com/gulpjs/artwork/master/gulp.png"/>
  </a>
</p>

# gulp [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coveralls Status][coveralls-image]][coveralls-url] [![Dependency Status][daviddm-image]][daviddm-url]
# gulp [![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-url] [![Support us][gittip-image]][gittip-url] [![Build Status][travis-image]][travis-url] [![Coveralls Status][coveralls-image]][coveralls-url]
> The streaming build system

## Like what we do?

[Support us via gittip](https://www.gittip.com/WeAreFractal/)

## Documentation

For a Getting started guide, API docs, recipes, making a plugin, etc. see the [documentation page](/docs/README.md)!

## Sample gulpfile
## Sample `gulpfile.js`

This file is just a quick sample to give you a taste of what gulp does.

```javascript
var gulp = require('gulp');

var coffee = require('gulp-coffee');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');

var paths = {
  scripts: ['client/js/**/*.coffee', '!client/external/**/*.coffee'],
  images: 'client/img/**/*'
};

gulp.task('scripts', function() {
  // Minify and copy all JavaScript (except vendor scripts)
  return gulp.src(paths.scripts)
    .pipe(coffee())
    .pipe(uglify())
    .pipe(concat('all.min.js'))
    .pipe(gulp.dest('build/js'));
});

// Copy all static images
gulp.task('images', function() {
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
gulp.task('default', ['scripts', 'images', 'watch']);

```

## Incremental Builds

We recommend these plugins:

- [gulp-changed](https://github.com/sindresorhus/gulp-changed)
- [gulp-cached](https://github.com/wearefractal/gulp-cached)
- [gulp-newer](https://github.com/tschaub/gulp-newer)
- [gulp-remember](https://github.com/ahaurw01/gulp-remember)

Profile & speed-up your `gulpfile.js` buids with [gulpt](https://github.com/jaguard/gulpt) & [time-require](https://github.com/jaguard/time-require).

## Want to contribute?

Anyone can help make this project better - check out the [Contributing guide](/CONTRIBUTING.md)!


[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/wearefractal/gulp/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

[gittip-url]: https://www.gittip.com/WeAreFractal/
[gittip-image]: http://img.shields.io/gittip/WeAreFractal.svg

[downloads-image]: http://img.shields.io/npm/dm/gulp.svg
[npm-url]: https://npmjs.org/package/gulp
[npm-image]: https://badge.fury.io/js/gulp.svg
[npm-image]: http://img.shields.io/npm/v/gulp.svg

[travis-url]: https://travis-ci.org/gulpjs/gulp
[travis-image]: https://travis-ci.org/gulpjs/gulp.svg?branch=master
[travis-image]: http://img.shields.io/travis/gulpjs/gulp.svg

[coveralls-url]: https://coveralls.io/r/gulpjs/gulp
[coveralls-image]: https://coveralls.io/repos/gulpjs/gulp/badge.png
[depstat-url]: https://david-dm.org/gulpjs/gulp
[depstat-image]: https://david-dm.org/gulpjs/gulp.svg
[daviddm-url]: https://david-dm.org/gulpjs/gulp
[daviddm-image]: https://david-dm.org/gulpjs/gulp.svg?theme=shields.io
[coveralls-image]: http://img.shields.io/coveralls/gulpjs/gulp/master.svg






