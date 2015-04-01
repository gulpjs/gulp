# Fast browserify builds with watchify

As a [browserify](http://github.com/substack/node-browserify) project begins to expand, the time to bundle it slowly gets longer and longer. While it might start at 1 second, it's possible to be waiting 30 seconds for your project to build on particularly large projects.

That's why [substack](http://github.com/substack) wrote [watchify](http://github.com/substack/watchify), a persistent browserify bundler that watches files for changes and *only rebuilds what it needs to*. This way, that first build might still take 30 seconds, but subsequent builds can still run in under 100ms – which is a huge improvement.

Watchify doesn't have a gulp plugin, but it doesn't need one either: you can use [vinyl-source-stream](http://github.com/hughsk/vinyl-source-stream) to pipe the bundle stream into your gulp pipeline.

``` javascript
var gulp = require('gulp');
var gutil = require('gulp-util');
var source = require('vinyl-source-stream');
var watchify = require('watchify');
var browserify = require('browserify');

var bundler = browserify({
  entries: ['./src/index.js'], //the file to bundle
  transform: 'brfs', //transforms here
  debug: true, //source maps
  cache: {}, packageCache: {}, fullPaths: true //required by watchify
});
var watcher = watchify(bundler);

gulp.task('js', bundle); // so you can run `gulp js` to build the file
watcher.on('update', bundle); // on any dep update, runs the bundler
watcher.on('log', gutil.log); // output build logs to terminal

function bundle() {
  return watcher.bundle()
    // log errors if they happen
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('./dist'));
}
```
