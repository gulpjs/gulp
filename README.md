<p align="center">
  <a href="http://gulpjs.com">
    <img height="257" width="114" src="https://raw.githubusercontent.com/gulpjs/artwork/master/gulp-2x.png">
  </a>
  <p align="center">The streaming build system</p>
</p>

[![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coveralls Status][coveralls-image]][coveralls-url] [![OpenCollective Backers][backer-badge]][backer-url] [![OpenCollective Sponsors][sponsor-badge]][sponsor-url] [![Gitter chat][gitter-image]][gitter-url]


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

/*
require gulp-load-plugins, and call it
gulp-load-plugins will require individually,
all the plugins installed in package.json at the root directory.
plugins are available for perusal, via camelcased names, minus gulp
eg: gulp-clean-css is accessed by $.cleanCss
*/
var $ = require('gulp-load-plugins')();

/*NOTE: the plugin del , doesn't begin with a "gulp-". Hence we manually load it into gulpfile*/

var del = require('del');

var paths = {
  scripts: ['client/js/**/*.coffee', '!client/external/**/*.coffee'],
  images: 'client/img/**/*'
};


/*
Anatomy of a gulp function
//If you do not pass a glob , make sure you define your glob before calling gulp.src();
function doSomething(glob){
  gulp.src(glob)
  .pipe(plugin 1)
  .pipe(plugin 2)
  .
  .
  pipe(plugin <n>)
  .gulp.dest('path string');
}
*/

/*
Anatomy of a gulp task
gulp.task(<task-name>,[dependencies array],body);
*/

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
    .pipe($.sourcemaps.init())
      .pipe($.coffee())
      .pipe($.uglify())
      .pipe($.concat('all.min.js'))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('build/js'));
});

// Copy all static images
gulp.task('images', ['clean'], function() {
  return gulp.src(paths.images)
    // Pass in options to the task
    .pipe($.imagemin({optimizationLevel: 5}))
    .pipe(gulp.dest('build/img'));
});

//Illustrting a cache implementation in gulp
var optimizeStyles = function(src) {
    
    return gulp.src(src).
    pipe($.cached('styles')).
    pipe($.autoprefixer({
        browsers: ['last 2 versions']
    })).
    pipe($.dest(function(file) {
        return file.base
    })).
    pipe($.remember('auto-prefixed-stylesheets')).
    pipe($.concat('app.css')).
    pipe($.dest('build/css')).
    pipe($.cleanCss()).
    pipe($.rename({
        suffix: '.min'
    })).
    pipe(gulp.dest('build/css'));
};
/*
NOTE: We use two caches above. first with gulp-cached and then with gulp-remember
Because , gulp-cached only pipes modifications down the pipeline
On the first run , everything is new and thus cached
On subsequent runs, only modified files are updated on the gulp-remember cache
*/

//define styles optimiser task
//*@return returns a stream to notify on task completion
gulp.task('optimizeStyles', function() {
    var src = ['css/**/*.css', 'fonts/google/**/*.css'];
    return optimizeStyles(src);
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

## Backers

Support us with a monthly donation and help us continue our activities.

[![Backers][backers-image]][support-url]

## Sponsors

Become a sponsor to get your logo on our README on Github.

[![Sponsors][sponsors-image]][support-url]

[downloads-image]: https://img.shields.io/npm/dm/gulp.svg
[npm-url]: https://www.npmjs.com/package/gulp
[npm-image]: https://img.shields.io/npm/v/gulp.svg

[travis-url]: https://travis-ci.org/gulpjs/gulp
[travis-image]: https://img.shields.io/travis/gulpjs/gulp/master.svg

[coveralls-url]: https://coveralls.io/r/gulpjs/gulp
[coveralls-image]: https://img.shields.io/coveralls/gulpjs/gulp/master.svg

[gitter-url]: https://gitter.im/gulpjs/gulp
[gitter-image]: https://badges.gitter.im/gulpjs/gulp.svg

[backer-url]: #backers
[backer-badge]: https://opencollective.com/gulpjs/backers/badge.svg?color=blue
[sponsor-url]: #sponsors
[sponsor-badge]: https://opencollective.com/gulpjs/sponsors/badge.svg?color=blue

[support-url]: https://opencollective.com/gulpjs#support

[backers-image]: https://opencollective.com/gulpjs/backers.svg
[sponsors-image]: https://opencollective.com/gulpjs/sponsors.svg
