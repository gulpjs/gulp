<!-- front-matter
id: api-task
title: task()
hide_title: true
sidebar_label: task()
-->

# `gulp.task([name,] fn)`

Define a task exposed to gulp-cli, `gulp.series`, `gulp.parallel` and
`gulp.lastRun`; inherited from [undertaker].

```js
gulp.task(function someTask() {
  // Do stuff
});
```

Or get a task that has been registered.

```js
// someTask will be the registered task function
var someTask = gulp.task('someTask');
```

## name
Type: `String`

If the name is not provided, the task will be named after the function
`name` or `displayName` property. The name argument is required if the
`name` and `displayName` properties of `fn` are empty.

Since the task can be run from the command line, you should avoid using
spaces in task names.

## fn

The function that performs the task's operations. Generally it takes this form:

```js
function someTask() {
  return gulp.src(['some/glob/**/*.ext']).pipe(someplugin());
}
someTask.description = 'Does something';

gulp.task(someTask)
```

Gulp tasks are asynchronous and Gulp uses [async-done] to wait for the task's
completion. Tasks are called with a callback parameter to call to signal
completion. Alternatively, Task can return a stream, a promise, a child process
or a RxJS observable to signal the end of the task.

**Warning:** Sync tasks are not supported and your function will never complete
if the one of the above strategies is not used to signal completion. However,
thrown errors will be caught by Gulp.

## fn properties

### fn.name

`gulp.task` names the task after the function `name` property
if the optional `name` parameter of `gulp.task` is not provided.

**Note:** [Function.name] is not writable; it cannot be set or edited. If
you need to assign a function name or use characters that aren't allowed
in function names, use the `displayName` property.
It will be empty for anonymous functions:

```js
function foo() {};
foo.name === 'foo' // true

var bar = function() {};
bar.name === '' // true

bar.name = 'bar'
bar.name === '' // true
```

### fn.displayName

`gulp.task` names the task after the function `displayName` property
if function is anonymous and the optional `name` parameter of `gulp.task`
is not provided.

### fn.description

gulp-cli prints this description alongside the task name when listing tasks:

```js
var gulp = require('gulp');

function test(done){
  done();
}
test.description = 'I do nothing';

gulp.task(test);
```

```sh
$> gulp --tasks
[12:00:02] Tasks for ~/Documents/some-project/gulpfile.js
[12:00:02] └── test  I do nothing
```

## Async support

### Accept a callback

```js
var del = require('del');

gulp.task('clean', function(done) {
  del(['.build/'], done);
});

// use an async result in a pipe
gulp.task('somename', function(cb) {
  getFilesAsync(function(err, res) {
    if (err) return cb(err);
    var stream = gulp.src(res)
      .pipe(minify())
      .pipe(gulp.dest('build'))
      .on('end', cb);
  });
});
```

The callback accepts an optional `Error` object. If it receives an error,
the task will fail.

### Return a stream

```js
gulp.task('somename', function() {
  return gulp.src('client/**/*.js')
    .pipe(minify())
    .pipe(gulp.dest('build'));
});
```

### Return a promise

```js
var Promise = require('promise');
var del = require('del');

gulp.task('clean', function() {
  return new Promise(function (resolve, reject) {
    del(['.build/'], function(err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
});
```

or:
```js
var promisedDel = require('promised-del');

gulp.task('clean', function() {
  return promisedDel(['.build/']);
});
```

### Return a child process

```js
gulp.task('clean', function() {
  return spawn('rm', ['-rf', path.join(__dirname, 'build')]);
});

```

### Return a [RxJS] observable

```js
var Observable = require('rx').Observable;

gulp.task('sometask', function() {
  return Observable.return(42);
});
```

[Function.name]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/name
[RxJS]: https://www.npmjs.com/package/rx
[async-done]: https://www.npmjs.com/package/async-done
[undertaker]: https://github.com/gulpjs/undertaker
