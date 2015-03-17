## gulp API docs

Jump to:
  [gulp.src](#gulpsrcglobs-options) |
  [gulp.dest](#gulpdestpath-options) |
  [gulp.task](#gulptaskname--deps--fn) |
  [gulp.watch](#gulpwatchglob--opts-tasks-or-gulpwatchglob--opts-cb)

### gulp.src(globs[, options])

Emits files matching provided glob or array of globs.
Returns a [stream] of [Vinyl files] that can be [piped] to plugins.

```javascript
gulp.src('client/templates/*.pug')
  .pipe(pug())
  .pipe(minify())
  .pipe(gulp.dest('build/minified_templates'));
```

`glob` refers to [node-glob syntax][node-glob] or it can be a direct file path.

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


Note that globs are evaluated in order, which means this is possible:
```
// exclude every JS file that starts with a b except bad.js
gulp.src(['*.js', '!b*.js', 'bad.js'])
```

#### options
Type: `Object`

Options to pass to [node-glob] through [glob-stream].

gulp adds some additional options in addition to the
[options supported by node-glob][node-glob documentation] and [glob-stream]:

##### options.buffer
Type: `Boolean`

Default: `true`

Setting this to `false` will return `file.contents` as a stream and not
buffer files. This is useful when working with large files.

**Note:** Plugins might not implement support for streams.

##### options.read
Type: `Boolean`

Default: `true`

Setting this to `false` will return `file.contents` as null and not read
the file at all.

##### options.base
Type: `String`

Default: everything before a glob starts (see [glob-parent])

E.g., consider `somefile.js` in `client/js/somedir`:

```js
// Matches 'client/js/somedir/somefile.js' and resolves `base` to `client/js/`
gulp.src('client/js/**/*.js')
  .pipe(minify())
  .pipe(gulp.dest('build'));  // Writes 'build/somedir/somefile.js'

gulp.src('client/js/**/*.js', { base: 'client' })
  .pipe(minify())
  .pipe(gulp.dest('build'));  // Writes 'build/js/somedir/somefile.js'
```

##### options.since
Type: `Date` or `Number`

Setting this to a Date or a time stamp will discard any file that have not been
modified since the time specified.

##### options.passthrough
Type: `Boolean`

Default: `false`

If true, it will create a duplex stream which passes items through and
emits globbed files.

### options.allowEmpty
Type: `Boolean`
Default: `false`

When true, will allow singular globs to fail to match. Otherwise, globs which are only supposed to match one file (such as `./foo/bar.js`) will cause an error to be thrown if they don't match.

```js
// Emits an error if app/scripts.js doesn't exist
gulp.src('app/scripts.js')
  .pipe(...);

// Won't emit an error
gulp.src('app/scripts.js', { allowEmpty: true })
  .pipe(...);
```

### gulp.dest(path[, options])

Can be piped to and it will write files. Re-emits all data passed to it so you
can pipe to multiple folders. Folders that don't exist will be created.

```javascript
gulp.src('./client/templates/*.pug')
  .pipe(pug())
  .pipe(gulp.dest('./build/templates'))
  .pipe(minify())
  .pipe(gulp.dest('./build/minified_templates'));
```

The write path is calculated by appending the file relative path to the given
destination directory. In turn, relative paths are calculated against
the file base. See `gulp.src` above for more info.

#### path
Type: `String` or `Function`

The path (output folder) to write files to. Or a function that returns it,
the function will be provided a [vinyl File instance].

#### options
Type: `Object`

##### options.cwd
Type: `String`

Default: `process.cwd()`

`cwd` for the output folder, only has an effect if provided output folder is
relative.

##### options.mode
Type: `String` or `Number`

Default: the mode of the input file (file.stat.mode) or the process mode
if the input file has no mode property.

Octal permission specifying the mode the files should be created with: e.g.
`"0744"`, `0744` or `484` (`0744` in base 10).

##### options.dirMode
Type: `String` or `Number`

Default: Default is the process mode.

Octal permission specifying the mode the directory should be created with: e.g.
`"0755"`, `0755` or `493` (`0755` in base 10).

##### options.overwrite
Type: `Boolean`

Default: `true`

Specify if existing files with the same path should be overwritten or not.


### gulp.symlink(folder[, options])

Functions exactly like `gulp.dest`, but will create symlinks instead of copying
a directory.

#### folder
Type: `String` or `Function`

A folder path or a function that receives in a file and returns a folder path.

#### options
Type: `Object`

##### options.cwd
Type: `String`

Default: `process.cwd()`

`cwd` for the output folder, only has an effect if provided output folder is
relative.

##### options.dirMode
Type: `String` or `Number`

Default: Default is the process mode.

Octal permission specifying the mode the directory should be created with: e.g.
`"0755"`, `0755` or `493` (`0755` in base 10).

### gulp.task([name,] fn)

Define a task using [Undertaker].

```js
gulp.task('somename', function() {
  // Do stuff
});
```

#### name
Type: `String`

Optional, The name of the task. Tasks that you want to run from the command line
should not have spaces in them.

If the name is not provided, the task will be named after the function
`name` attribute, set on any named function.

[Function.name] is not writable; it cannot be set or edited.
It will be empty for anonymous functions:

```js
function foo() {};
foo.name === 'foo' // true

var bar = function() {};
bar.name === '' // true

bar.name = 'bar'
bar.name === '' // true
```

You should either provide the task name or avoid anonymous functions.

You can also omit the function if you only want to run a bundle of dependency tasks:

```js
gulp.task('build', ['array', 'of', 'task', 'names']);
```

**Note:** The tasks will run in parallel (all at once), so don't assume that the tasks will start/finish in order.

#### fn
Type: `Function`

The function that performs the task's operations. Generally it takes this form:
```
gulp.task('somename', function() {
  return gulp.src(['some/glob/**/*.ext']).pipe(someplugin());
})
```

Gulp tasks are asynchronous and Gulp uses [async-done] to wait for the tasks'
completion. Tasks are called with a callback parameter to call to signal
completion. Alternatively, Task can return a stream, a promise, a child process
or a RxJS observable to signal the end of the task.

**Warning:** Sync tasks are not supported and your function will never complete
if the one of the above strategies is not used to signal completion. However,
thrown errors will be caught by Gulp.

#### Async support

##### Accept a callback

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

##### Return a stream

```js
gulp.task('somename', function() {
  return gulp.src('client/**/*.js')
    .pipe(minify())
    .pipe(gulp.dest('build'));
});
```

##### Return a promise

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

##### Return a child process

```js
gulp.task('clean', function() {
  return spawn('rm', ['-rf', path.join(__dirname, 'build')]);
});

```

##### Return a [RxJS] observable

```js
var Observable = require('rx').Observable;

gulp.task('sometask', function() {
  return Observable.return(42);
});
```


### gulp.parallel(...tasks)

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

#### tasks
Type: `Array`, `String` or `Function`

A task name, a function or an array of either.


### gulp.series(...tasks)

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

#### tasks
Type: `Array`, `String` or `Function`

A task name, a function or an array of either.


### gulp.watch(glob[, opts], tasks)

Watch files and do something when a file changes.

```js
gulp.watch('js/**/*.js', gulp.parallel('uglify', 'reload'));
```

#### glob
Type: `String` or `Array`

A single glob or array of globs that indicate which files to watch for changes.

#### opts
Type: `Object`

Options, that are passed to [`gaze`][gaze].

#### tasks
Type: `Array`, `Function` or `String`

A task name, a function or an array of either to run when a file changes.

When `tasks` is an array, the tasks will be run in parallel:
```
gulp.watch('*.js', [one, two]);
// is equivalent to
gulp.watch('*.js', gulp.parallel(one, two));
```

`gulp.watch` returns an `EventEmitter` object which emits `change` events with
the [gaze] `event`:
```js
var watcher = gulp.watch('js/**/*.js', gulp.parallel('uglify', 'reload'));
watcher.on('change', function(event) {
  console.log('File ' + event.path + ' was ' + event.type);
});
```

##### event.type
Type: String

The type of change that occurred, either "added", "changed" or "deleted".

##### event.path
Type: String

The path to the file that triggered the event.

[Function.name]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/name
[gaze]: https://github.com/shama/gaze
[glob-stream]: https://github.com/gulpjs/glob-stream
[glob-parent]: https://github.com/es128/glob-parent
[gulp-if]: https://github.com/robrich/gulp-if
[node-glob documentation]: https://github.com/isaacs/node-glob#options
[node-glob]: https://github.com/isaacs/node-glob
[piped]: http://nodejs.org/api/stream.html#stream_readable_pipe_destination_options
[RxJS]: https://www.npmjs.com/package/rx
[stream]: http://nodejs.org/api/stream.html
[async-done]: https://www.npmjs.com/package/async-done
[Undertaker]: https://github.com/phated/undertaker
[vinyl File instance]: https://github.com/gulpjs/vinyl
[Vinyl files]: https://github.com/gulpjs/vinyl-fs
