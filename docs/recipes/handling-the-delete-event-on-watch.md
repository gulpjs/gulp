# Handling the Delete Event on Watch

You can listen for `'change'` events to fire on the watcher returned from `gulp.watch`.

Each change event has a `type` property. If `type` is `'deleted'`, you can delete the file
from your destination directory, using something like:

```js
'use strict';

var del = require('del');
var path = require('path');
var gulp = require('gulp');
var header = require('gulp-header');
var footer = require('gulp-footer');

gulp.task('scripts', function() {
  return gulp.src('src/**/*.js', {base: 'src'})
    .pipe(header('(function () {\r\n\t\'use strict\'\r\n'))
    .pipe(footer('\r\n})();'))
    .pipe(gulp.dest('build'));
});

gulp.task('watch', function () {
  var watcher = gulp.watch('src/**/*.js', ['scripts']);

  watcher.on('change', function (event) {
    if (event.type === 'deleted') {
      // Simulating the {base: 'src'} used with gulp.src in the scripts task
      var filePathFromSrc = path.relative(path.resolve('src'), event.path);

      // Concatenating the 'build' absolute path used by gulp.dest in the scripts task
      var destFilePath = path.resolve('build', filePathFromSrc);

      del.sync(destFilePath);
    }
  });
});
```
