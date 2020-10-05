# Running tasks in series

By default, gulp CLI run tasks with maximum concurrency - e.g. it launches
all the tasks at once and waits for nothing. If you want to create a series
where tasks run in a particular order, you should use `gulp.series`;

```js
var gulp = require('gulp');
var doAsyncStuff = require('./stuff');

gulp.task('one', function(done) {
  doAsyncStuff(function(err){
      done(err);
  });
});

gulp.task('two', function(done) {
  // do things
  done();
});

gulp.task('default', gulp.series('one', 'two'));
```

Another example, using a dependency pattern. It uses
[`async-once`](https://www.npmjs.com/package/async-once) to run the `clean`
task operations only once:
```js
var gulp = require('gulp');
var del = require('del'); // rm -rf
var once = require('async-once');

gulp.task('clean', once(function(done) {
  // run only once.
  // for the next call to the clean task, once will call done with
  // the same arguments as the first call.
  del(['output'], done);
}));

gulp.task('templates', gulp.series('clean', function() {
  return gulp.src(['src/templates/*.hbs'])
    // do some concatenation, minification, etc.
    .pipe(gulp.dest('output/templates/'));
}));

gulp.task('styles', gulp.series('clean', function() {
  return gulp.src(['src/styles/app.less'])
    // do some hinting, minification, etc.
    .pipe(gulp.dest('output/css/app.css'));
}));

// templates and styles will be processed in parallel.
// `clean` will be guaranteed to complete before either start.
// `clean` operations will not be run twice,
// even though it is called as a dependency twice.
gulp.task('build', gulp.parallel('templates', 'styles'));

// an alias.
gulp.task('default', gulp.parallel('build'));
```

Note that it's an anti-pattern in Gulp 4 and the logs will show the clean task
running twice. Instead, `templates` and `style` should use dedicated `clean:*`
tasks:
```js
var gulp = require('gulp');
var del = require('del');

gulp.task('clean:templates', function() {
  return del(['output/templates/']);
});

gulp.task('templates', gulp.series('clean:templates', function() {
  return gulp.src(['src/templates/*.hbs'])
    .pipe(gulp.dest('output/templates/'));
});

gulp.task('clean:styles', function() {
  return del(['output/css/']);
});

gulp.task('styles', gulp.series('clean:styles', function() {
  return gulp.src(['src/styles/app.less'])
    .pipe(gulp.dest('output/css/app.css'));
}));

gulp.task('build', gulp.parallel('templates', 'styles'));
gulp.task('default', gulp.parallel('build'));
```
