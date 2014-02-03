## gulp API docs

### gulp.src(globs[, options])

Takes a glob and represents a file structure. Can be piped to plugins.

```javascript
gulp.src('./client/templates/*.jade')
    .pipe(jade())
    .pipe(minify())
    .pipe(gulp.dest('./build/minified_templates'));
```

#### globs
Type: `String` or `Array`

Glob or globs to read.

#### options
Type: `Object`

Options to pass to [node-glob] through [glob-stream].

gulp adds two additional options in addition to the [options supported by node-glob][node-glob documentation]:

#### options.buffer
Type: `Boolean`
Default: `true`

Setting this to `false` will return `file.contents` as a stream and not buffer files. This is useful when working with large files. **Note:** Plugins may not implement support for streams.

#### options.read
Type: `Boolean`
Default: `true`

Setting this to `false` will return `file.contents` as null and not read the file at all.


### gulp.dest(path)

Can be piped to and it will write files. Re-emits all data passed to it so you can pipe to multiple folders.

```javascript
gulp.src('./client/templates/*.jade')
  .pipe(jade())
  .pipe(gulp.dest('./build/templates'))
  .pipe(minify())
  .pipe(gulp.dest('./build/minified_templates'));
```

#### path
Type: `String`

The path (folder) to write files to.


### gulp.task(name[, deps], fn)

Define a task using [Orchestrator].

```javascript
gulp.task('somename', function() {
  // Do stuff
});
```

#### name

The name of the task. Tasks that you want to run from the command line should not have spaces in them.

#### deps
Type: `Array`

An array of tasks to be executed and completed before your task will run.

```javascript
gulp.task('mytask', ['array', 'of', 'task', 'names'], function() {
  // Do stuff
});
```

**Note:** Are your tasks running before the dependencies are complete?  Make sure your dependency tasks
are correctly using the async run hints: take in a callback or return a promise or event stream.

#### fn

The function that performs the task's operations. Generally this takes the form of `gulp.src().pipe(someplugin())`.

#### Async task support

Tasks can be made asynchronous if its `fn` does one of the following:

##### Accept a callback

```javascript
gulp.task('somename', function(cb) {
  // Do stuff
  cb(err);
});
```

##### Return a stream

```javascript
gulp.task('somename', function() {
  var stream = gulp.src('./client/**/*.js')
    .pipe(minify())
    .pipe(gulp.dest('/build'));
  return stream;
});
```

##### Return a promise

```javascript
var Q = require('q');

gulp.task('somename', function() {
  var deferred = Q.defer();

  // Do async stuff
  setTimeout(function() {
    deferred.resolve();
  }, 1);

  return deferred.promise;
});
```

**Note:** By default, tasks run with maximum concurrency -- e.g. it launches all the tasks at once and waits for nothing.
If you want to create a series where tasks run in a particular order, you need to do two things:

- give it a hint to tell it when the task is done,
- and give it a hint that a task depends on completion of another.

For these examples, let's presume you have two tasks, "one" and "two" that you specifically want to run in this order:

1. In task "one" you add a hint to tell it when the task is done.  Either take in a callback and call it when you're
done or return a promise or stream that the engine should wait to resolve or end respectively.

2. In task "two" you add a hint telling the engine that it depends on completion of the first task.

So this example would look like this:

```javascript
var gulp = require('gulp');

// takes in a callback so the engine knows when it'll be done
gulp.task('one', function (cb) {
    // do stuff -- async or otherwise
    cb(err); // if err is not null and not undefined, the run will stop, and note that it failed
});

// identifies a dependent task must be complete before this one begins
gulp.task('two', ['one'], function () {
    // task 'one' is done now
});

gulp.task('default', ['one', 'two']);
```


### gulp.watch(glob [, opts], tasks) or gulp.watch(glob [, opts, cb])

Watch files and do something when a file changes. This always returns an EventEmitter that emits `changed` events.

### gulp.watch(glob[, opts], tasks)

#### glob
Type: `String` or `Array`

A single glob or array of globs that indicate which files to watch for changes.

#### opts
Type: `Object`

Options, that are passed to [`gaze`](https://github.com/shama/gaze).

#### tasks
Type: `Array`

Names of task(s) to run when a file changes, added with `gulp.task()`

```javascript
var watcher = gulp.watch('js/**/*.js', ['uglify','reload']);
watcher.on('changed', function(event){
  console.log('File '+event.path+' was '+event.type+', running tasks...');
});
```

### gulp.watch(glob[, opts, cb])

#### glob
Type: `String` or `Array`

A single glob or array of globs that indicate which files to watch for changes.

#### opts
Type: `Object`

Options, that are passed to [`gaze`](https://github.com/shama/gaze).

#### cb(event)
Type: `Function`

Callback to be called on each change.

```javascript
gulp.watch('js/**/*.js', function(event) {
  console.log('File '+event.path+' was '+event.type+', running tasks...');
});
```

The callback will be passed an object, `event`, that describes the change:

##### event.type
Type: `String`

The type of change that occurred, either `added`, `changed` or `deleted`.

##### event.path
Type: `String`

The path to the file that triggered the event.


[node-optimist]: https://github.com/substack/node-optimist
[node-glob documentation]: https://github.com/isaacs/node-glob#options
[node-glob]: https://github.com/isaacs/node-glob
[glob-stream]: https://github.com/wearefractal/glob-stream
[gulp-if]: https://github.com/robrich/gulp-if
[Orchestrator]: https://github.com/robrich/orchestrator
