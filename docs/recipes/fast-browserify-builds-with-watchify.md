# Fast browserify builds with watchify

You can use ```gulp.watch()``` to rerun [browserify](http://github.com/substack/node-browserify) when you change your JavaScript files, but as a browserify project begins to expand, the time to bundle it slowly gets longer and longer. While it might start at 1 second, it's possible to be waiting 30 seconds for your project to build on particularly large projects.

That's why [substack](http://github.com/substack) wrote [watchify](http://github.com/substack/watchify), a persistent browserify bundler that watches files for changes and *only rebuilds what it needs to*. This way, that first build might still take 30 seconds, but subsequent builds can still run in under 100ms – which is a huge improvement.

Watchify doesn't have a gulp plugin, but it doesn't need one either: you can use [vinyl-source-stream](http://github.com/hughsk/vinyl-source-stream) to pipe the bundle stream into your gulp pipeline.

``` javascript
var gulp = require('gulp');
var gutil = require('gulp-util');
var source = require('vinyl-source-stream');
var watchify = require('watchify');
var browserify = require('browserify');

gulp.task('watch', function() {
  // Add any Browserify options that would 
  // normally be passed on the command line.
  // Setting 'debug' to true enables source maps.
  watchify.args.debug = true;

  // Wrap the browserify bundle with watchify.
  var bundler = watchify(browserify('./src/index.js', watchify.args));

  // Optionally, you can apply transforms
  // and other configuration options on the
  // bundler just as you would with browserify
  bundler.transform('brfs');

  bundler
    .on('update', rebundle) // Watchify emits an 'update' whenever the contents change.
    .on('log', function(msg) { console.log("watchify - " + msg); });

  function rebundle() {
    return bundler.bundle()
      // log errors if they happen
      .on('error', gutil.log.bind(gutil, 'Browserify Error'))
      .pipe(source('bundle.js')) // Create a vinyl file instance for the output from bundler.
      .pipe(gulp.dest('./dist')); // Write index.js out to ./dist
  }

  return rebundle();
});
```
