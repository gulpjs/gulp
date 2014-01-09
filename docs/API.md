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

**Note:** If the dependencies are asynchronous it is not guaranteed that they will finish before `mytask` is executed. To ensure they are completely finished, you need to make sure the dependency tasks have asynchronous support through one of the methods outlined below.

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
    .pipe(gulp.dest('/build');
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

### gulp.run(tasks...[, cb])

#### tasks
Type: `String`

Tasks to be executed. You may pass any number of tasks as individual arguments. **Note:** Tasks are run concurrently and therefore do not run in order, see [Orchestrator] for more information.

```javascript
gulp.run('scripts', 'copyfiles', 'builddocs');
```

```javascript
gulp.run('scripts', 'copyfiles', 'builddocs', function(err) {
  // All done or aborted due to err
});
```

Use `gulp.run` to run tasks from other tasks. You will probably use this in your default task and to group small tasks into larger tasks.

### gulp.watch(glob [, opts], cb)

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
  gulp.run('scripts', 'copyfiles');
});
```

The callback will be passed an object, `event`, that describes the change:

##### event.type
Type: `String`

The type of change that occurred, either `added`, `changed` or `deleted`.

##### event.path
Type: `String`

The path to the file that triggered the event.


### gulp.env

`gulp.env` is a [node-optimist] arguments object. For instance, if you run:

```
gulp test dostuff --production
```

Which results in the following `gulp.env`:

```
{
  _: ['test', 'dostuff'],
  production: true
}
```

You can use this to conditionally enable certain plugins:

```
gulp.task('scripts', function() {
  var stream = gulp.src(['client/js/**/*.js', '!client/js/vendor/**']);

  // Only uglify in production
  if (gulp.env.production) {
    stream = stream.pipe(uglify());
  }

  stream.pipe(gulp.dest('build/js'));
});
```

There is also [gulp-if] to make this a lot prettier.



[node-optimist]: https://github.com/substack/node-optimist
[node-glob documentation]: https://github.com/isaacs/node-glob#options
[node-glob]: https://github.com/isaacs/node-glob
[glob-stream]: https://github.com/wearefractal/glob-stream
[gulp-if]: https://github.com/robrich/gulp-if
[Orchestrator]: https://github.com/robrich/orchestrator
