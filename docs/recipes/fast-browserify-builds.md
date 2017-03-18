# Fast browserify builds

[browserify]: http://github.com/substack/node-browserify
[watchify]: http://github.com/substack/watchify

As a [browserify][] project begins to expand, the time to bundle it slowly gets longer and longer. While it might start at 1 second, it's possible to be waiting 30 seconds for your project to build on particularly large projects.

We can speed the build process up by manipulating the [browserify][] cache object so we *only rebuild what changed*. This way, that first build might still take 30 seconds, but subsequent builds can still run in under 100ms – which is a huge improvement.

``` javascript
var gulp = require('gulp');
var path = require('path');
var gutil = require('gulp-util');
var source = require('vinyl-source-stream');
var browserify = require('browserify');

var bundler;
var bundlerCache = {};
var changedPath;

gulp.task('build', function(done) {

  if (changedPath) {
    delete bundlerCache[path.resolve(changedPath)];
  }

  if (!bundler) {
    bundler = browserify('src/index.js', {
      cache: bundlerCache,
      packageCache: {},
      fullPaths: true
    });

    // Configure your bundler as you like
    // bundler
    //   .transform(reactify)
    //   .transform(es6ify);

    // Implement caching
    bundler.on('dep', function (dep) {
      if (typeof dep.id === 'string') {
        bundlerCache[dep.id] = dep;
      }
    });
  }

  return bundler.bundle()
    .on('error', function(e) {
      gutil.log('Browserify Error', e);
      if (done) done();
    })
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('./dist'));
});

gulp.task('watch', ['build'], function() {
  var watcher = gulp.watch(['src/**/*.js'], ['build']);
  watcher.on('change', function(event) {
    changedPath = event.path;
  });
});
```
