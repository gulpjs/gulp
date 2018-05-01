<!-- front-matter
id: api-parallel
title: parallel()
hide_title: true
sidebar_label: parallel()
-->

# `gulp.parallel(...tasks)`

Takes a number of task names or functions and returns a function of the composed
tasks or functions.

When using task names, the task should already be registered.

When the returned function is executed, the tasks or functions will be executed
in parallel, all being executed at the same time. If an error occurs,
all execution will complete.

```js
gulp.task('one', function(done) {
  // do stuff
  done();
});

gulp.task('two', function(done) {
  // do stuff
  done();
});

gulp.task('default', gulp.parallel('one', 'two', function(done) {
  // do more stuff
  done();
}));
```

## tasks
Type: `Array`, `String` or `Function`

A task name, a function or an array of either.

