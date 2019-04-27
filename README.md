<p align="center">
  <a href="https://gulpjs.com">
    <img height="257" width="114" src="https://raw.githubusercontent.com/gulpjs/artwork/master/gulp-2x.png">
  </a>
  <p align="center">The streaming build system</p>
</p>

[![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-url] [![Azure Pipelines Build Status][azure-pipelines-image]][azure-pipelines-url] [![Build Status][travis-image]][travis-url] [![AppVeyor Build Status][appveyor-image]][appveyor-url] [![Coveralls Status][coveralls-image]][coveralls-url] [![OpenCollective Backers][backer-badge]][backer-url] [![OpenCollective Sponsors][sponsor-badge]][sponsor-url] [![Gitter chat][gitter-image]][gitter-url]


## What is gulp?

- **Automation** - gulp is a toolkit that helps you automate painful or time-consuming tasks in your development workflow.
- **Platform-agnostic** - Integrations are built into all major IDEs and people are using gulp with PHP, .NET, Node.js, Java, and other platforms.
- **Strong Ecosystem** - Use npm modules to do anything you want + over 2000 curated plugins for streaming file transformations
- **Simple** - By providing only a minimal API surface, gulp is easy to learn and simple to use

## What's new in 4.0?!

* The task system was rewritten from the ground-up, allowing task composition using `series()` and `parallel()` methods
* The watcher was updated, now using chokidar (no more need for gulp-watch!), with feature parity to our task system
* First-class support was added for incremental builds using `lastRun()`
* A `symlink()` method was exposed to create symlinks instead of copying files
* Built-in support for sourcemaps was added - the gulp-sourcemaps plugin is no longer necessary!
* Task registration of exported functions - using node or ES exports - is now recommended
* Custom registries were designed, allowing for shared tasks or augmented functionality
* Stream implementations were improved, allowing for better conditional and phased builds

## Installation

Follow our [Quick Start guide][quick-start].

## Roadmap

Find out about all our work-in-progress and outstanding issues at https://github.com/orgs/gulpjs/projects.

## Documentation

Check out the [Getting Started guide][getting-started-guide] and [API docs][api-docs] on our website!

__Excuse our dust! All other docs will be behind until we get everything updated. Please open an issue if something isn't working.__

## Sample `gulpfile.js`

This file will give you a taste of what gulp does.

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
 * Specify if tasks run in series or parallel using `gulp.series` and `gulp.parallel`
 */
var build = gulp.series(clean, gulp.parallel(styles, scripts));

/*
 * You can use CommonJS `exports` module notation to declare tasks
 */
exports.clean = clean;
exports.styles = styles;
exports.scripts = scripts;
exports.watch = watch;
exports.build = build;
/*
 * Define default task that can be called by just running `gulp` from cli
 */
exports.default = build;
```

## Use latest JavaScript version in your gulpfile

__Most new versions of node support most features that Babel provides, except the `import`/`export` syntax. When only that syntax is desired, rename to `gulpfile.esm.js`, install the [esm][esm-module] module, and skip the Babel portion below.__

Node already supports a lot of __ES2015+__ features, but to avoid compatibility problems we suggest to install Babel and rename your `gulpfile.js` to `gulpfile.babel.js`.

```sh
npm install --save-dev @babel/register @babel/core @babel/preset-env
```

Then create a **.babelrc** file with the preset configuration.

```js
{
  "presets": [ "@babel/preset-env" ]
}
```

And here's the same sample from above written in **ES2015+**.

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
 * For small tasks you can export arrow functions
 */
export const clean = () => del([ 'assets' ]);

/*
 * You can also declare named functions and export them as tasks
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

 /*
  * You could even use `export as` to rename exported tasks
  */
function watchFiles() {
  gulp.watch(paths.scripts.src, scripts);
  gulp.watch(paths.styles.src, styles);
}
export { watchFiles as watch };

const build = gulp.series(clean, gulp.parallel(styles, scripts));
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
  return gulp.src(paths.images.src, {since: gulp.lastRun(images)})
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

[azure-pipelines-url]: https://dev.azure.com/gulpjs/gulp/_build/latest?definitionId=1&branchName=master
[azure-pipelines-image]: https://dev.azure.com/gulpjs/gulp/_apis/build/status/gulp?branchName=master

[travis-url]: https://travis-ci.org/gulpjs/gulp
[travis-image]: https://img.shields.io/travis/gulpjs/gulp.svg?label=travis-ci

[appveyor-url]: https://ci.appveyor.com/project/gulpjs/gulp
[appveyor-image]: https://img.shields.io/appveyor/ci/gulpjs/gulp.svg?label=appveyor

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

[quick-start]: https://gulpjs.com/docs/en/getting-started/quick-start
[getting-started-guide]: https://gulpjs.com/docs/en/getting-started/quick-start
[api-docs]: https://gulpjs.com/docs/en/api/concepts
