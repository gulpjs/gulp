<!-- front-matter
id: api-series
title: series()
hide_title: true
sidebar_label: series()
-->

# `gulp.series(...tasks)`

Takes a number of task names or functions and returns a function of the composed
tasks or functions.

When using task names, the task should already be registered.

When the returned function is executed, the tasks or functions will be executed
in series, each waiting for the prior to finish. If an error occurs,
execution will stop.

```js
gulp.task('one', function(done) {
  // do stuff
  done();
});

gulp.task('two', function(done) {
  // do stuff
  done();
});

gulp.task('default', gulp.series('one', 'two', function(done) {
  // do more stuff
  done();
}));
```

## tasks
Type: `Array`, `String` or `Function`

A task name, a function or an array of either.
