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
  gulp.src(['client/js/**/*.js'])
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

Takes a glob and represents a file structure. Can be piped to plugins. You can specify a single glob or an array of globs (see docs). All options are passed directly through to [glob-stream]. See the [glob-stream documentation] for more information.

```javascript
gulp.src('./client/templates/*.jade')
    .pipe(jade())
    .pipe(minify())
    .pipe(gulp.dest('./build/minified_templates'));
```

#### options.buffer
Type: `Boolean`
Default: `true`

Setting this to `false` will return `file.contents` as a stream and not buffer files. This may not be supported by many plugins.

#### options.read
Type: `Boolean`
Default: `true`

Setting this to `false` will return `file.contents` as null and not read the file at all.

### gulp.dest(path[, options])

Can be piped to and it will write files. Re-emits all data passed to it so you can pipe to multiple folders.

```javascript
gulp.src('./client/templates/*.jade')
  .pipe(jade())
  .pipe(gulp.dest('./build/templates'))
  .pipe(minify())
  .pipe(gulp.dest('./build/minified_templates'));
```

### gulp.task(name[, deps], fn)

Tasks that you want to run from the command line should not have spaces in them.

The task system is [Orchestrator] so check there for more detailed information.

```javascript
gulp.task('somename', function() {
  // Do stuff
});
```

#### Task dependencies

This lets you specify tasks to be executed and completed before your task will run.

```javascript
gulp.task('somename', ['array', 'of', 'task', 'names'], function() {
  // Do stuff
});
```

If the dependencies are asynchronous it is not guaranteed that they will finish before `'somename'` is executed. To ensure they are completely finished, you need to make sure the dependency tasks have asynchronous support through one of the methods outlined below. The most simple method is to return the stream. By returning the stream, Orchestrator is able to listen for the end event and only run `'somename'` once each dependencies' stream end event has been emitted. You can also use callbacks or promises to do your own cool stuff.

#### Async tasks

With callbacks:

```javascript
gulp.task('somename', function(cb) {
  // Do stuff
  cb(err);
});
```

Wait for stream to end:

```javascript
gulp.task('somename', function() {
  var stream = gulp.src('./client/**/*.js')
    .pipe(minify())
    .pipe(gulp.dest('/build');
  return stream;
});
```

With promises:

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

Triggers tasks to be executed. *Does not run in order*.

```javascript
gulp.run('scripts', 'copyfiles', 'builddocs');
```

```javascript
gulp.run('scripts', 'copyfiles', 'builddocs', function(err) {
  // All done or aborted due to err
});
```

Use gulp.run to run tasks from other tasks. You will probably use this in your default task and to group small tasks into larger tasks.

### gulp.watch(glob, cb)

glob can be a standard glob or an array of globs. cb is called on each fs change with an object describing the change.

```javascript
gulp.watch('js/**/*.js', function(event) {
  gulp.run('scripts', 'copyfiles');
});
```

### gulp.env

gulp.env is an optimist arguments object. Running `gulp test dostuff --production` will yield `{_:["test","dostuff"],production:true}`. Plugins don't use this.


## gulp CLI

### Tasks

Tasks can be executed by running `gulp <task> <othertask>`. Just running `gulp` will execute the task you registered called `default`. If there is no `default` task gulp will error.

### Compilers

You can use any language you want for your gulpfile. You will have to specify the language module name so the CLI can load it (and its assosciated extensions) before attempting to find your gulpfile. Make sure you have this module installed accessible by the folder you are running the CLI in.

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


[glob-stream documentation]: https://github.com/wearefractal/glob-stream
[glob-stream]: https://github.com/wearefractal/glob-stream
[Orchestrator]: https://github.com/robrich/orchestrator
[plugin search]: https://npmjs.org/browse/keyword/gulpplugin
[wiki]: /wearefractal/gulp/wiki
[FAQ]: /wearefractal/gulp/wiki/FAQ
[Writing a gulp plugin]: /wearefractal/gulp/wiki/Writing-a-gulp-plugin

[npm-url]: https://npmjs.org/package/gulp
[npm-image]: https://badge.fury.io/js/gulp.png
[travis-url]: https://travis-ci.org/wearefractal/gulp
[travis-image]: https://travis-ci.org/wearefractal/gulp.png?branch=master
[depstat-url]: https://david-dm.org/wearefractal/gulp
[depstat-image]: https://david-dm.org/wearefractal/gulp.png
