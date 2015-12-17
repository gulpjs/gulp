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

Define a task using [Orchestrator].

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

**Note:** Are your tasks running before the dependencies are complete?  Make sure your dependency tasks are correctly using the async run hints: take in a callback or return a promise or event stream.

You can also omit the function if you only want to run a bundle of dependency tasks:

```js
gulp.task('build', ['array', 'of', 'task', 'names']);
```

**Note:** The tasks will run in parallel (all at once), so don't assume that the tasks will start/finish in order.

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

#### Async task support

Tasks can be made asynchronous if its `fn` does one of the following:

##### Accept a callback

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

```javascript
var Q = require('q');

gulp.task('somename', function() {
  var deferred = Q.defer();

  // do async stuff
  setTimeout(function() {
    deferred.resolve();
  }, 1);

  return deferred.promise;
});
```

**Note:** By default, tasks run with maximum concurrency -- e.g. it launches all the tasks at once and waits for nothing. If you want to create a series where tasks run in a particular order, you need to do two things:

- give it a hint to tell it when the task is done,
- and give it a hint that a task depends on completion of another.

For these examples, let's presume you have two tasks, "one" and "two" that you specifically want to run in this order:

1. In task "one" you add a hint to tell it when the task is done.  Either take in a callback and call it when you're
done or return a promise or stream that the engine should wait to resolve or end respectively.

2. In task "two" you add a hint telling the engine that it depends on completion of the first task.

So this example would look like this:

```js
var gulp = require('gulp');

// takes in a callback so the engine knows when it'll be done
gulp.task('one', function(cb) {
    // do stuff -- async or otherwise
    cb(err); // if err is not null and not undefined, the run will stop, and note that it failed
});

// identifies a dependent task must be complete before this one begins
gulp.task('two', ['one'], function() {
    // task 'one' is done now
});

gulp.task('default', ['one', 'two']);
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
