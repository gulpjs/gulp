# Running Shell Commands

Sometimes it is helpful to be able to call existing command line tools from gulp.

There are 2 ways to handle this: node's [`child_process`](https://nodejs.org/api/child_process.html)
built-in module or [`gulp-exec`](https://github.com/robrich/gulp-exec) if you need to integrate the
command with an existing pipeline.

```js
'use strict';

var cp = require('child_process');
var gulp = require('gulp');

gulp.task('reset', function() {
  // In gulp 4, you can return a child process to signal task completion
  return cp.execFile('git checkout -- .');
});
```

```js
'use strict';

var gulp = require('gulp');
var exec = require('gulp-exec');

gulp.task('reset', function() {
  return gulp.src('./**/**')
    .pipe(exec('git checkout -- <%= file.path %>'));
});
```
