# Rollup with rollup-stream

Like Browserify, [Rollup](https://rollupjs.org/) is a bundler and thus only fits naturally into gulp if it's at the start of the pipeline. Unlike Browserify, Rollup doesn't natively produce a stream as output and needs to be wrapped before it can take this position. [rollup-stream](https://github.com/Permutatrix/rollup-stream) does this for you, producing output just like that of Browserify's `bundle()` method&mdash;as a result, most of the Browserify recipes here will also work with rollup-stream.

## Basic usage
```js
// npm install --save-dev gulp@next rollup-stream vinyl-source-stream
var gulp = require('gulp');
var rollup = require('rollup-stream');
var source = require('vinyl-source-stream');

gulp.task('rollup', function() {
  return rollup({
      entry: './src/main.js'
    })

    // give the file the name you want to output with
    .pipe(source('app.js'))

    // and output to ./dist/app.js as normal.
    .pipe(gulp.dest('./dist'));
});
```

## Usage with sourcemaps
```js
// npm install --save-dev gulp@next rollup-stream gulp-sourcemaps vinyl-source-stream vinyl-buffer
// optional: npm install --save-dev gulp-rename
var gulp = require('gulp');
var rollup = require('rollup-stream');
var sourcemaps = require('gulp-sourcemaps');
//var rename = require('gulp-rename');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

gulp.task('rollup', function() {
  return rollup({
      entry: './src/main.js',
      sourceMap: true
    })

    // point to the entry file.
    .pipe(source('main.js', './src'))

    // buffer the output. most gulp plugins, including gulp-sourcemaps, don't support streams.
    .pipe(buffer())

    // tell gulp-sourcemaps to load the inline sourcemap produced by rollup-stream.
    .pipe(sourcemaps.init({loadMaps: true}))

        // transform the code further here.

    // if you want to output with a different name from the input file, use gulp-rename here.
    //.pipe(rename('index.js'))

    // write the sourcemap alongside the output file.
    .pipe(sourcemaps.write('.'))

    // and output to ./dist/main.js as normal.
    .pipe(gulp.dest('./dist'));
});
```
