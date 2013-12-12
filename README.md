# gulp [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][depstat-image]][depstat-url]
> The streaming build system

## Usage

### 1. Install gulp globally:

```
npm install -g gulp
```

### 2. Install gulp in your project devDependencies:

```
npm install --save-dev gulp
```

### 3. Create a `gulpfile.js` at the root of your project:

```javascript
/*
  This is an EXAMPLE gulpfile.js
  You'll want to change it to match your project.
  Find plugins at https://npmjs.org/browse/keyword/gulpplugin
*/
var gulp = require('gulp');
var uglify = require('gulp-uglify');

gulp.task('scripts', function() {
  // Minify and copy all JavaScript (except vendor scripts)
  gulp.src(['client/js/**/*.js', '!client/js/vendor/**'])
    .pipe(uglify())
    .pipe(gulp.dest('build/js'));

  // Copy vendor files
  gulp.src('client/js/vendor/**')
    .pipe(gulp.dest('build/js/vendor'));
});

// Copy all static assets
gulp.task('copy', function() {
  gulp.src('client/img/**')
    .pipe(gulp.dest('build/img'));

  gulp.src('client/css/**')
    .pipe(gulp.dest('build/css'));

  gulp.src('client/*.html')
    .pipe(gulp.dest('build'));
});

// The default task (called when you run `gulp`)
gulp.task('default', function() {
  gulp.run('scripts', 'copy');

  // Watch files and run tasks if they change
  gulp.watch('client/js/**', function(event) {
    gulp.run('scripts');
  });

  gulp.watch([
    'client/img/**',
    'client/css/**',
    'client/*.html'
  ], function(event) {
    gulp.run('copy');
  });
});
```

### 4. Run gulp

```
gulp
```

The default tasks will run and gulp will watch for changes.

To run individual tasks, use `gulp <task> <othertask>`


## Available Plugins

The gulp community is growing, with new plugins being added daily. See the [npm search results][plugin search] for a complete list.


## gulp API

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

### gulp.watch(glob, cb)

#### glob
Type: `String` or `Array`

A single glob or array of globs that indicate which files to watch for changes.

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
  if (!gulp.env.production) {
    stream = stream.pipe(uglify());
  }

  stream.pipe(gulp.dest('build/js'));
});
```

**Note:** Plugins should not perform differently based on `gulp.env`.


## gulp CLI

### Tasks

Tasks can be executed by running `gulp <task> <othertask>`. Just running `gulp` will execute the task you registered called `default`. If there is no `default` task gulp will error.

### Compilers

You can use any language you want for your gulpfile. You will have to specify the language module name so the CLI can load it (and its associated extensions) before attempting to find your gulpfile. Make sure you have this module installed accessible by the folder you are running the CLI in.

Example:

```
gulp dosomething --require coffee-script
```


## Write your own gulp plugins

See the [Writing a gulp plugin] wiki page for guidelines and an example to get you started.


## More information

See [the wiki][wiki] for more information and [the FAQ][FAQ] for more answers to common questions.


## LICENSE

(MIT License)

Copyright (c) 2013 Fractal <contact@wearefractal.com>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/wearefractal/gulp/trend.png)](https://bitdeli.com/free "Bitdeli Badge")


[node-optimist]: https://github.com/substack/node-optimist
[node-glob documentation]: https://github.com/isaacs/node-glob#options
[node-glob]: https://github.com/isaacs/node-glob
[glob-stream]: https://github.com/wearefractal/glob-stream
[Orchestrator]: https://github.com/robrich/orchestrator
[plugin search]: https://npmjs.org/browse/keyword/gulpplugin
[wiki]: https://github.com/wearefractal/gulp/wiki
[FAQ]: https://github.com/wearefractal/gulp/wiki/FAQ
[Writing a gulp plugin]: https://github.com/wearefractal/gulp/wiki/Writing-a-gulp-plugin

[npm-url]: https://npmjs.org/package/gulp
[npm-image]: https://badge.fury.io/js/gulp.png
[travis-url]: https://travis-ci.org/wearefractal/gulp
[travis-image]: https://travis-ci.org/wearefractal/gulp.png?branch=master
[depstat-url]: https://david-dm.org/wearefractal/gulp
[depstat-image]: https://david-dm.org/wearefractal/gulp.png
