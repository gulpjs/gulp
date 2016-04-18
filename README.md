<p align="center">
  <a href="http://gulpjs.com">
    <img height="257" width="114" src="https://raw.githubusercontent.com/gulpjs/artwork/master/gulp-2x.png">
  </a>
  <p align="center">The streaming build system</p>
</p>

[![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coveralls Status][coveralls-image]][coveralls-url] [![Gitter chat][gitter-image]][gitter-url]

## What is gulp?

- **Automation** - gulp is a toolkit that helps you automate painful or time-consuming tasks in your development workflow.
- **Platform-agnostic** - Integrations are built into all major IDEs and people are using gulp with PHP, .NET, Node.js, Java, and other platforms.
- **Strong Ecosystem** - Use npm modules to do anything you want + over 2000 curated plugins for streaming file transformations
- **Simple** - By providing only a minimal API surface, gulp is easy to learn and simple to use

## Documentation

For a Getting started guide, API docs, recipes, making a plugin, etc. see the [documentation page](/docs/README.md)!

## Sample `gulpfile.js`

This file is just a quick sample to give you a taste of what gulp does.

```js
var gulp = require('gulp');
var less = require('gulp-less');
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var cleanCSS = require('gulp-clean-css');
var del = require('del');

var paths = {
  styles: {
    src: 'src/styles/**/*.less',
    dest: 'assets/styles/'
  },
  scripts: {
    src: 'src/scripts/**/*.js',
    dest: 'assets/scripts/'
  }
};

/* Not all tasks need to use streams, a gulpfile is just another node program
 * and you can use all packages available on npm, but it must return either a
 * Promise, a Stream or take a callback and call it
 */
function clean() {
  // You can use multiple globbing patterns as you would with `gulp.src`,
  // for example if you are using del 2.0 or above, return its promise
  return del([ 'assets' ]);
}

/*
 * Define our tasks using plain functions
 */
function styles() {
  return gulp.src(paths.styles.src)
    .pipe(less())
    .pipe(cleanCSS())
    // pass in options to the stream
    .pipe(rename({
      basename: 'main',
      suffix: '.min'
    }))
    .pipe(gulp.dest(paths.styles.dest));
}

function scripts() {
  return gulp.src(paths.scripts.src, { sourcemaps: true })
    .pipe(babel())
    .pipe(uglify())
    .pipe(concat('main.min.js'))
    .pipe(gulp.dest(paths.scripts.dest));
}

function watch() {
  gulp.watch(paths.scripts.src, scripts);
  gulp.watch(paths.styles.src, styles);
}

/*
 * You can use CommonJS `exports` module notation to declare tasks
 */
exports.clean = clean;
exports.styles = styles;
exports.scripts = scripts;
exports.watch = watch;

/*
 * Specify if tasks run in series or parallel using `gulp.series` and `gulp.parallel`
 */
var build = gulp.series(clean, gulp.parallel(styles, scripts));

/*
 * You can still use `gulp.task` to expose tasks
 */
gulp.task('build', build);

/*
 * Define default task that can be called by just running `gulp` from cli
 */
gulp.task('default', build);
```

## Use last JavaScript version in your gulpfile

Node already supports a lot of **ES2015**, to avoid compatibility problem we suggest to install Babel and rename your `gulpfile.js` as `gulpfile.babel.js`.

```sh
npm install --save-dev babel-register babel-preset-es2015
```

Then create a **.babelrc** file with the preset configuration.

```js
{
  "presets": [ "es2015" ]
}
```

And here's the same sample from above written in **ES2015**.

```js
import gulp from 'gulp';
import less from 'gulp-less';
import babel from 'gulp-babel';
import concat from 'gulp-concat';
import uglify from 'gulp-uglify';
import rename from 'gulp-rename';
import cleanCSS from 'gulp-clean-css';
import del from 'del';

const paths = {
  styles: {
    src: 'src/styles/**/*.less',
    dest: 'assets/styles/'
  },
  scripts: {
    src: 'src/scripts/**/*.js',
    dest: 'assets/scripts/'
  }
};

/*
 * For small tasks you can use arrow functions and export
 */
const clean = () => del([ 'assets' ]);
export { clean };

/*
 * You can still declare named functions and export them as tasks
 */
export function styles() {
  return gulp.src(paths.styles.src)
    .pipe(less())
    .pipe(cleanCSS())
    // pass in options to the stream
    .pipe(rename({
      basename: 'main',
      suffix: '.min'
    }))
    .pipe(gulp.dest(paths.styles.dest));
}

export function scripts() {
  return gulp.src(paths.scripts.src, { sourcemaps: true })
    .pipe(babel())
    .pipe(uglify())
    .pipe(concat('main.min.js'))
    .pipe(gulp.dest(paths.scripts.dest));
}

export function watch() {
  gulp.watch(paths.scripts.src, scripts);
  gulp.watch(paths.styles.src, styles);
}

const build = gulp.series(clean, gulp.parallel(styles, scripts));
export { build };

/*
 * Export a default task
 */
export default build;
```

## Incremental Builds

You can filter out unchanged files between runs of a task using
the `gulp.src` function's `since` option and `gulp.lastRun`:
```js
const paths = {
  ...
  images: {
    src: 'src/images/**/*.{jpg,jpeg,png}',
    dest: 'build/img/'
  }
}

function images() {
  return gulp.src(paths.images.src, {since: gulp.lastRun('images')})
    .pipe(imagemin({optimizationLevel: 5}))
    .pipe(gulp.dest(paths.images.dest));
}

function watch() {
  gulp.watch(paths.images.src, images);
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

Anyone can help make this project better - check out our [Contributing guide](/CONTRIBUTING.md)!

[downloads-image]: http://img.shields.io/npm/dm/gulp.svg
[npm-url]: https://npmjs.org/package/gulp
[npm-image]: http://img.shields.io/npm/v/gulp.svg

[travis-url]: https://travis-ci.org/gulpjs/gulp
[travis-image]: http://img.shields.io/travis/gulpjs/gulp.svg

[coveralls-url]: https://coveralls.io/r/gulpjs/gulp
[coveralls-image]: http://img.shields.io/coveralls/gulpjs/gulp/master.svg

[gitter-url]: https://gitter.im/gulpjs/gulp
[gitter-image]: https://badges.gitter.im/gulpjs/gulp.png

[gulp-cached]: https://github.com/wearefractal/gulp-cached
[gulp-remember]: https://github.com/ahaurw01/gulp-remember
[gulp-changed]: https://github.com/sindresorhus/gulp-changed
[gulp-newer]: https://github.com/tschaub/gulp-newer
