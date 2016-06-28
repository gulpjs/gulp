<p align="center">
  <a href="http://gulpjs.com">
    <img height="257" width="114" src="https://raw.githubusercontent.com/gulpjs/artwork/master/gulp-2x.png">
  </a>
  <p align="center">The streaming build system</p>
</p>

[![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coveralls Status][coveralls-image]][coveralls-url] [![Gitter chat][gitter-image]][gitter-url] [![OpenCollective](https://opencollective.com/gulpjs/backers/badge.svg)](#backers) 
[![OpenCollective](https://opencollective.com/gulpjs/sponsors/badge.svg)](#sponsors)


## What is gulp?

- **Automation** - gulp is a toolkit that helps you automate painful or time-consuming tasks in your development workflow.
- **Platform-agnostic** - Integrations are built into all major IDEs and people are using gulp with PHP, .NET, Node.js, Java, and other platforms.
- **Strong Ecosystem** - Use npm modules to do anything you want + over 2000 curated plugins for streaming file transformations
- **Simple** - By providing only a minimal API surface, gulp is easy to learn and simple to use

## Documentation

For a Getting started guide, API docs, recipes, making a plugin, etc. check out our docs!

- Need something reliable? Check out the [documentation for the current release](/docs/README.md)!
- Want to help us test the latest and greatest? Check out the [documentation for the next release](https://github.com/gulpjs/gulp/tree/4.0)!

## Sample `gulpfile.js`

This file will give you a taste of what gulp does.

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

// Not all tasks need to use streams
// A gulpfile is just another node program and you can use any package available on npm
gulp.task('clean', function() {
  // You can use multiple globbing patterns as you would with `gulp.src`
  return del(['build']);
});

gulp.task('scripts', ['clean'], function() {
  // Minify and copy all JavaScript (except vendor scripts)
  // with sourcemaps all the way down
  return gulp.src(paths.scripts)
    .pipe(sourcemaps.init())
      .pipe(coffee())
      .pipe(uglify())
      .pipe(concat('all.min.js'))
    .pipe(sourcemaps.write())
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
- [gulp-cached](https://github.com/contra/gulp-cached) - in-memory file cache, not for operation on sets of files
- [gulp-remember](https://github.com/ahaurw01/gulp-remember) - pairs nicely with gulp-cached
- [gulp-newer](https://github.com/tschaub/gulp-newer) - pass through newer source files only, supports many:1 source:dest

## Want to contribute?

Anyone can help make this project better - check out our [Contributing guide](/CONTRIBUTING.md)!

[downloads-image]: https://img.shields.io/npm/dm/gulp.svg
[npm-url]: https://www.npmjs.com/package/gulp
[npm-image]: https://img.shields.io/npm/v/gulp.svg

[travis-url]: https://travis-ci.org/gulpjs/gulp
[travis-image]: https://img.shields.io/travis/gulpjs/gulp/master.svg

[coveralls-url]: https://coveralls.io/r/gulpjs/gulp
[coveralls-image]: https://img.shields.io/coveralls/gulpjs/gulp/master.svg

[gitter-url]: https://gitter.im/gulpjs/gulp
[gitter-image]: https://badges.gitter.im/gulpjs/gulp.svg


## Backers
Support us with a monthly donation and help us continue our activities. [[Become a backer](https://opencollective.com/gulpjs#backer)]

<a href="https://opencollective.com/gulpjs/backer/0/website" target="_blank"><img src="https://opencollective.com/gulpjs/backer/0/avatar.svg"></a>
<a href="https://opencollective.com/gulpjs/backer/1/website" target="_blank"><img src="https://opencollective.com/gulpjs/backer/1/avatar.svg"></a>
<a href="https://opencollective.com/gulpjs/backer/2/website" target="_blank"><img src="https://opencollective.com/gulpjs/backer/2/avatar.svg"></a>
<a href="https://opencollective.com/gulpjs/backer/3/website" target="_blank"><img src="https://opencollective.com/gulpjs/backer/3/avatar.svg"></a>
<a href="https://opencollective.com/gulpjs/backer/4/website" target="_blank"><img src="https://opencollective.com/gulpjs/backer/4/avatar.svg"></a>
<a href="https://opencollective.com/gulpjs/backer/5/website" target="_blank"><img src="https://opencollective.com/gulpjs/backer/5/avatar.svg"></a>
<a href="https://opencollective.com/gulpjs/backer/6/website" target="_blank"><img src="https://opencollective.com/gulpjs/backer/6/avatar.svg"></a>
<a href="https://opencollective.com/gulpjs/backer/7/website" target="_blank"><img src="https://opencollective.com/gulpjs/backer/7/avatar.svg"></a>
<a href="https://opencollective.com/gulpjs/backer/8/website" target="_blank"><img src="https://opencollective.com/gulpjs/backer/8/avatar.svg"></a>
<a href="https://opencollective.com/gulpjs/backer/9/website" target="_blank"><img src="https://opencollective.com/gulpjs/backer/9/avatar.svg"></a>
<a href="https://opencollective.com/gulpjs/backer/10/website" target="_blank"><img src="https://opencollective.com/gulpjs/backer/10/avatar.svg"></a>
<a href="https://opencollective.com/gulpjs/backer/11/website" target="_blank"><img src="https://opencollective.com/gulpjs/backer/11/avatar.svg"></a>
<a href="https://opencollective.com/gulpjs/backer/12/website" target="_blank"><img src="https://opencollective.com/gulpjs/backer/12/avatar.svg"></a>
<a href="https://opencollective.com/gulpjs/backer/13/website" target="_blank"><img src="https://opencollective.com/gulpjs/backer/13/avatar.svg"></a>
<a href="https://opencollective.com/gulpjs/backer/14/website" target="_blank"><img src="https://opencollective.com/gulpjs/backer/14/avatar.svg"></a>
<a href="https://opencollective.com/gulpjs/backer/15/website" target="_blank"><img src="https://opencollective.com/gulpjs/backer/15/avatar.svg"></a>
<a href="https://opencollective.com/gulpjs/backer/16/website" target="_blank"><img src="https://opencollective.com/gulpjs/backer/16/avatar.svg"></a>
<a href="https://opencollective.com/gulpjs/backer/17/website" target="_blank"><img src="https://opencollective.com/gulpjs/backer/17/avatar.svg"></a>
<a href="https://opencollective.com/gulpjs/backer/18/website" target="_blank"><img src="https://opencollective.com/gulpjs/backer/18/avatar.svg"></a>
<a href="https://opencollective.com/gulpjs/backer/19/website" target="_blank"><img src="https://opencollective.com/gulpjs/backer/19/avatar.svg"></a>
<a href="https://opencollective.com/gulpjs/backer/20/website" target="_blank"><img src="https://opencollective.com/gulpjs/backer/20/avatar.svg"></a>
<a href="https://opencollective.com/gulpjs/backer/21/website" target="_blank"><img src="https://opencollective.com/gulpjs/backer/21/avatar.svg"></a>
<a href="https://opencollective.com/gulpjs/backer/22/website" target="_blank"><img src="https://opencollective.com/gulpjs/backer/22/avatar.svg"></a>
<a href="https://opencollective.com/gulpjs/backer/23/website" target="_blank"><img src="https://opencollective.com/gulpjs/backer/23/avatar.svg"></a>
<a href="https://opencollective.com/gulpjs/backer/24/website" target="_blank"><img src="https://opencollective.com/gulpjs/backer/24/avatar.svg"></a>
<a href="https://opencollective.com/gulpjs/backer/25/website" target="_blank"><img src="https://opencollective.com/gulpjs/backer/25/avatar.svg"></a>
<a href="https://opencollective.com/gulpjs/backer/26/website" target="_blank"><img src="https://opencollective.com/gulpjs/backer/26/avatar.svg"></a>
<a href="https://opencollective.com/gulpjs/backer/27/website" target="_blank"><img src="https://opencollective.com/gulpjs/backer/27/avatar.svg"></a>
<a href="https://opencollective.com/gulpjs/backer/28/website" target="_blank"><img src="https://opencollective.com/gulpjs/backer/28/avatar.svg"></a>
<a href="https://opencollective.com/gulpjs/backer/29/website" target="_blank"><img src="https://opencollective.com/gulpjs/backer/29/avatar.svg"></a>


## Sponsors
Become a sponsor and get your logo on our README on Github with a link to your site. [[Become a sponsor](https://opencollective.com/gulpjs#sponsor)]

<a href="https://opencollective.com/gulpjs/sponsor/0/website" target="_blank"><img src="https://opencollective.com/gulpjs/sponsor/0/avatar.svg"></a>
<a href="https://opencollective.com/gulpjs/sponsor/1/website" target="_blank"><img src="https://opencollective.com/gulpjs/sponsor/1/avatar.svg"></a>
<a href="https://opencollective.com/gulpjs/sponsor/2/website" target="_blank"><img src="https://opencollective.com/gulpjs/sponsor/2/avatar.svg"></a>
<a href="https://opencollective.com/gulpjs/sponsor/3/website" target="_blank"><img src="https://opencollective.com/gulpjs/sponsor/3/avatar.svg"></a>
<a href="https://opencollective.com/gulpjs/sponsor/4/website" target="_blank"><img src="https://opencollective.com/gulpjs/sponsor/4/avatar.svg"></a>
<a href="https://opencollective.com/gulpjs/sponsor/5/website" target="_blank"><img src="https://opencollective.com/gulpjs/sponsor/5/avatar.svg"></a>
<a href="https://opencollective.com/gulpjs/sponsor/6/website" target="_blank"><img src="https://opencollective.com/gulpjs/sponsor/6/avatar.svg"></a>
<a href="https://opencollective.com/gulpjs/sponsor/7/website" target="_blank"><img src="https://opencollective.com/gulpjs/sponsor/7/avatar.svg"></a>
<a href="https://opencollective.com/gulpjs/sponsor/8/website" target="_blank"><img src="https://opencollective.com/gulpjs/sponsor/8/avatar.svg"></a>
<a href="https://opencollective.com/gulpjs/sponsor/9/website" target="_blank"><img src="https://opencollective.com/gulpjs/sponsor/9/avatar.svg"></a>
<a href="https://opencollective.com/gulpjs/sponsor/10/website" target="_blank"><img src="https://opencollective.com/gulpjs/sponsor/10/avatar.svg"></a>
<a href="https://opencollective.com/gulpjs/sponsor/11/website" target="_blank"><img src="https://opencollective.com/gulpjs/sponsor/11/avatar.svg"></a>
<a href="https://opencollective.com/gulpjs/sponsor/12/website" target="_blank"><img src="https://opencollective.com/gulpjs/sponsor/12/avatar.svg"></a>
<a href="https://opencollective.com/gulpjs/sponsor/13/website" target="_blank"><img src="https://opencollective.com/gulpjs/sponsor/13/avatar.svg"></a>
<a href="https://opencollective.com/gulpjs/sponsor/14/website" target="_blank"><img src="https://opencollective.com/gulpjs/sponsor/14/avatar.svg"></a>
<a href="https://opencollective.com/gulpjs/sponsor/15/website" target="_blank"><img src="https://opencollective.com/gulpjs/sponsor/15/avatar.svg"></a>
<a href="https://opencollective.com/gulpjs/sponsor/16/website" target="_blank"><img src="https://opencollective.com/gulpjs/sponsor/16/avatar.svg"></a>
<a href="https://opencollective.com/gulpjs/sponsor/17/website" target="_blank"><img src="https://opencollective.com/gulpjs/sponsor/17/avatar.svg"></a>
<a href="https://opencollective.com/gulpjs/sponsor/18/website" target="_blank"><img src="https://opencollective.com/gulpjs/sponsor/18/avatar.svg"></a>
<a href="https://opencollective.com/gulpjs/sponsor/19/website" target="_blank"><img src="https://opencollective.com/gulpjs/sponsor/19/avatar.svg"></a>
<a href="https://opencollective.com/gulpjs/sponsor/20/website" target="_blank"><img src="https://opencollective.com/gulpjs/sponsor/20/avatar.svg"></a>
<a href="https://opencollective.com/gulpjs/sponsor/21/website" target="_blank"><img src="https://opencollective.com/gulpjs/sponsor/21/avatar.svg"></a>
<a href="https://opencollective.com/gulpjs/sponsor/22/website" target="_blank"><img src="https://opencollective.com/gulpjs/sponsor/22/avatar.svg"></a>
<a href="https://opencollective.com/gulpjs/sponsor/23/website" target="_blank"><img src="https://opencollective.com/gulpjs/sponsor/23/avatar.svg"></a>
<a href="https://opencollective.com/gulpjs/sponsor/24/website" target="_blank"><img src="https://opencollective.com/gulpjs/sponsor/24/avatar.svg"></a>
<a href="https://opencollective.com/gulpjs/sponsor/25/website" target="_blank"><img src="https://opencollective.com/gulpjs/sponsor/25/avatar.svg"></a>
<a href="https://opencollective.com/gulpjs/sponsor/26/website" target="_blank"><img src="https://opencollective.com/gulpjs/sponsor/26/avatar.svg"></a>
<a href="https://opencollective.com/gulpjs/sponsor/27/website" target="_blank"><img src="https://opencollective.com/gulpjs/sponsor/27/avatar.svg"></a>
<a href="https://opencollective.com/gulpjs/sponsor/28/website" target="_blank"><img src="https://opencollective.com/gulpjs/sponsor/28/avatar.svg"></a>
<a href="https://opencollective.com/gulpjs/sponsor/29/website" target="_blank"><img src="https://opencollective.com/gulpjs/sponsor/29/avatar.svg"></a>
