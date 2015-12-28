## gulp API docs

Jump to:
  [gulp.src](#gulpsrcglobs-options) |
  [gulp.dest](#gulpdestpath-options) |
  [gulp.task](#gulptaskname--deps-fn) |
  [gulp.watch](#gulpwatchglob--opts-tasks-or-gulpwatchglob--opts-cb)

### gulp.src(globs[, options])

Emits files matching provided glob or an array of globs.
Returns a [stream](http://nodejs.org/api/stream.html) of [Vinyl files](https://github.com/wearefractal/vinyl-fs)
that can be [piped](http://nodejs.org/api/stream.html#stream_readable_pipe_destination_options)
to plugins.

```javascript
gulp.src('client/templates/*.jade')
  .pipe(jade())
  .pipe(minify())
  .pipe(gulp.dest('build/minified_templates'));
```

#### globs
Type: `String` or `Array`

Glob or array of globs to read. Globs use [node-glob syntax] except that negation is fully supported.

A glob that begins with `!` excludes matching files from the glob results up to that point. For example, consider this directory structure:

    client/
      a.js
      bob.js
      bad.js

The following expression matches `a.js` and `bad.js`:

    gulp.src(['client/*.js', '!client/b*.js', 'client/bad.js'])


#### options
Type: `Object`

Options to pass to [node-glob] through [glob-stream].

gulp supports all [options supported by node-glob][node-glob documentation] and [glob-stream] except `ignore` and adds the following options.

##### options.buffer
Type: `Boolean`
Default: `true`

Setting this to `false` will return `file.contents` as a stream and not buffer files. This is useful when working with large files. **Note:** Plugins might not implement support for streams.

##### options.read
Type: `Boolean`
Default: `true`

Setting this to `false` will return `file.contents` as null and not read the file at all.

##### options.base
Type: `String`
Default: everything before a glob starts (see [glob2base])

E.g., consider `somefile.js` in `client/js/somedir`:

```js
gulp.src('client/js/**/*.js') // Matches 'client/js/somedir/somefile.js' and resolves `base` to `client/js/`
  .pipe(minify())
  .pipe(gulp.dest('build'));  // Writes 'build/somedir/somefile.js'

gulp.src('client/js/**/*.js', { base: 'client' })
  .pipe(minify())
  .pipe(gulp.dest('build'));  // Writes 'build/js/somedir/somefile.js'
```

### gulp.dest(path[, options])

Can be piped to and it will write files. Re-emits all data passed to it so you can pipe to multiple folders.  Folders that don't exist will be created.

```javascript
gulp.src('./client/templates/*.jade')
  .pipe(jade())
  .pipe(gulp.dest('./build/templates'))
  .pipe(minify())
  .pipe(gulp.dest('./build/minified_templates'));
```

The write path is calculated by appending the file relative path to the given
destination directory. In turn, relative paths are calculated against the file base.
See `gulp.src` above for more info.

#### path
Type: `String` or `Function`

The path (output folder) to write files to. Or a function that returns it, the function will be provided a [vinyl File instance](https://github.com/wearefractal/vinyl).

#### options
Type: `Object`

##### options.cwd
Type: `String`
Default: `process.cwd()`

`cwd` for the output folder, only has an effect if provided output folder is relative.

##### options.mode
Type: `String`
Default: `0777`

Octal permission string specifying mode for any folders that need to be created for output folder.

### gulp.task(name [, deps, fn])

Define a task.

```js
gulp.task('somename', function() {
  // Do stuff
});
```

#### name
Type: `String`

The name of the task. Tasks that you want to run from the command line should not have spaces in them.

#### deps
Type: `Array`

An array of tasks to be executed and completed before your task will run.

```js
gulp.task('mytask', ['array', 'of', 'task', 'names'], function() {
  // Do stuff
});
```

But we don't recommend using it. You can use `gulp.seq`, `gulp.all` and `gulp.co` to compose your tasks.

```js
// The tasks will run in sequence
gulp.task('build', gulp.seq('array', 'of', 'task', 'names'));
// The tasks will run in parallel
gulp.task('build', gulp.all('array', 'of', 'task', 'names'));
```

#### fn
Type: `Function`

The function performs the task's main operations. Generally this takes the form of:

```js
gulp.task('buildStuff', function() {
  // Do something that "builds stuff"
  var stream = gulp.src(/*some source path*/)
  .pipe(somePlugin())
  .pipe(someOtherPlugin())
  .pipe(gulp.dest(/*some destination*/));

  return stream;
});
```


#### Define sync or async task

##### Sync task

```js
gulp.task('sync_task', function() {
  // Do something that "builds sync stuff"
});
```

##### Accept a thunk function(aka `callback`)

```javascript
// run a command in a shell
var exec = require('child_process').exec;
gulp.task('jekyll', function(cb) {
  // build Jekyll
  exec('jekyll build', function(err) {
    if (err) return cb(err); // return error
    cb(); // finished task
  });
});
```

##### Return a thunk function

```javascript
var exec = require('child_process').exec;
gulp.task('thunk_task', function() {
  return function(done) {
    exec('jekyll build', function(err) {
      if (err) return done(err); // return error
      done(); // finished task
    });
  };
});
```

##### Return a stream

```js
gulp.task('somename', function() {
  var stream = gulp.src('client/**/*.js')
    .pipe(minify())
    .pipe(gulp.dest('build'));
  return stream;
});
```

##### Return a promise

```js
var Q = require('q');
gulp.task('promise_task', function() {
  var deferred = Q.defer();

  setTimeout(function() {
    deferred.resolve();
  }, 1);
  return deferred.promise;
})
```

##### generator task

You can do magical async tasks as [thunks](https://github.com/thunks/thunks) do.

```js
gulp.task('generator_task', function *() {
  yield somePromise;
  yield someThunk;
  yield gulp.all('a', 'b', 'c');
  yield gulp.seq('e', 'f', 'g');
  yield gulp.co('h', 'i', ['g', 'k'], 'l');
  // ...
});
```

### gulp.start('task1', 'task2', ...[, cb])
Run tasks in order. Return thunk function.

```js
// Run 'default' task
gulp.start();
// Run 'default' task with callback
gulp.start(cb);
gulp.start()(cb);

// Run tasks 'a', 'b', 'c' in sequence
gulp.start('a', 'b', 'c');
// with callback
gulp.start('a', 'b', 'c', cb);
gulp.start('a', 'b', 'c')(cb);

// Run tasks 'a', 'b', 'c' in parallel
gulp.start(['a', 'b', 'c']);
// with callback
gulp.start(['a', 'b', 'c'], cb);
gulp.start(['a', 'b', 'c'])(cb);

// Run tasks 'a', then run 'b', 'c' in parallel, then run 'd'
gulp.start('a', ['b', 'c'], 'd');
// with callback
gulp.start('a', ['b', 'c'], 'd', cb);
gulp.start('a', ['b', 'c'], 'd')(cb);
```

### gulp.co('task1', 'task2', ...)
Compose tasks in order. It return thunk function that contain the tasks. The tasks will not run until you call the thunk function.

```js
// Compose tasks 'a', 'b', 'c', tasks will run in sequence
gulp.co('a', 'b', 'c');
// Compose tasks 'a', 'b', 'c', tasks will run in parallel
gulp.co(['a', 'b', 'c']);
// Compose tasks 'a', 'b', 'c', task 'a' will run first, then 'b', 'c' in parallel, then 'd'.
gulp.co('a', ['b', 'c'], 'd');
```

Define a task with `gulp.co`
```js
gulp.task('build', gulp.co('a', ['b', 'c'], 'd'));
// run it
gulp.start('build');
```

### gulp.all('task1', 'task2', ...)
Compose tasks in parallel. It return thunk function that contain the tasks. The tasks will not run until you call the thunk function.

```js
// Compose tasks 'a', 'b', 'c', tasks will run in parallel
gulp.all('a', 'b', 'c');
gulp.all(['a', 'b', 'c']);
```

Define a task with `gulp.all`
```js
gulp.task('build', gulp.all('a', 'b', 'c'));
// run it
gulp.start('build');
```

### gulp.seq('task1', 'task2', ...)
Compose tasks in sequence. It return thunk function that contain the tasks. The tasks will not run until you call the thunk function.

```js
// Compose tasks 'a', 'b', 'c', tasks will run in sequence
gulp.seq('a', 'b', 'c');
gulp.seq(['a', 'b', 'c']);
```


Define a task with `gulp.seq`
```js
gulp.task('build', gulp.seq('a', 'b', 'c'));
// run it
gulp.start('build');
```

### gulp.watch(glob [, opts], tasks) or gulp.watch(glob [, opts, cb])

Watch files and do something when a file changes. This always returns an EventEmitter that emits `change` events.

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

```js
var watcher = gulp.watch('js/**/*.js', ['uglify','reload']);
watcher.on('change', function(event) {
  console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
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

```js
gulp.watch('js/**/*.js', function(event) {
  console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
});
```

The callback will be passed an object, `event`, that describes the change:

##### event.type
Type: `String`

The type of change that occurred, either `added`, `changed` or `deleted`.

##### event.path
Type: `String`

The path to the file that triggered the event.


[node-glob]: https://github.com/isaacs/node-glob
[node-glob documentation]: https://github.com/isaacs/node-glob#options
[node-glob syntax]: https://github.com/isaacs/node-glob
[glob-stream]: https://github.com/wearefractal/glob-stream
[gulp-if]: https://github.com/robrich/gulp-if
[Orchestrator]: https://github.com/robrich/orchestrator
[glob2base]: https://github.com/wearefractal/glob2base
