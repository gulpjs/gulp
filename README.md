[![Build Status](https://travis-ci.org/wearefractal/gulp.png?branch=master)](https://travis-ci.org/wearefractal/gulp)
[![Dependency Status](https://david-dm.org/wearefractal/gulp.png)](https://david-dm.org/wearefractal/gulp)

## Information

<table>
<tr> 
<td>Package</td><td>gulp</td>
</tr>
<tr>
<td>Description</td>
<td>Simple stream-y build helper</td>
</tr>
<tr>
<td>Node Version</td>
<td>>= 0.8</td>
</tr>
</table>

This project is in its early stages. If something is not working or you would like a new feature please use the issues page.

## Links

[Slideshow](http://slid.es/contra/gulp)

[Twitter for updates](http://twitter.com/eschoff)

[Company twitter](http://twitter.com/wearefractal)

## Plugin List

You can view a list of plugins by going to [this npm search](https://npmjs.org/search?q=gulpplugin).

## Usage

```javascript
var gulp = require('gulp');
var jade = require('gulp-jade');
var coffee = require('gulp-coffee');
var minify = require('gulp-minify');

// compile, minify, and copy templates
gulp.task('templates', function(){
  gulp.src("./client/templates/*.jade")
    .pipe(jade())
    .pipe(minify())
    .pipe(gulp.dest("./public/templates"));
});

gulp.task('scripts', function(){
  
  // compile, minify, and copy coffeescript
  gulp.src("./client/js/*.coffee", {ignore: ["vendor"]})
    .pipe(coffee())
    .pipe(minify())
    .pipe(gulp.dest("./public/js"));

  // copy vendor files
  gulp.src("./client/js/vendor/**")
    .pipe(minify())
    .pipe(gulp.dest("./public/js/vendor"));

});

// copy all static assets
gulp.task('copy', function(){
  gulp.src("./client/img/**")
    .pipe(gulp.dest("./public/img"));

  gulp.src("./client/css/**")
    .pipe(gulp.dest("./public/css"));

  gulp.src("./client/*.html")
    .pipe(gulp.dest("./public"));

  gulp.src("./client/*.ico")
    .pipe(gulp.dest("./public"));

});

// default task gets called when you run the `gulp` command
gulp.task('default', function(){
  gulp.run('templates', 'scripts', 'copy');

  // watch files and run scripts if they change
  gulp.watch("./client/js/**", function(event){
    gulp.run('scripts');
  });

  gulp.watch("./client/templates/**", function(event){
    gulp.run('templates');
  });

});
```

### gulp.src(glob[, opt])

Takes a glob and represents a file structure. Can be piped to plugins. You can specify a single glob or an array of globs (see docs)56. All options are passed directly through to [glob-stream](https://github.com/wearefractal/glob-stream). See the [glob-stream documentation](https://github.com/wearefractal/glob-stream) for more information.

```javascript
gulp.src("./client/templates/*.jade")
    .pipe(jade())
    .pipe(minify())
    .pipe(gulp.dest("./public/minified_templates"));
```

##### Options

`buffer: false` will return file.content as a stream and not buffer files.

`read: false` will return file.content as null and not read the file at all.

### gulp.dest(path[, opt])

Can be piped to and it will write files. Re-emits all data passed to it so you can pipe to multiple folders.

```javascript
gulp.src("./client/templates/*.jade")
    .pipe(jade())
    .pipe(gulp.dest("./public/templates"))
    .pipe(minify())
    .pipe(gulp.dest("./public/minified_templates"));
```

### gulp.task(name[, deps], fn)

Tasks that you want to run from the command line should not have spaces in them.

The task system is [Orchestrator](https://github.com/robrich/orchestrator) so check there for more detailed information.

```javascript
gulp.task('somename', function(){
  // do stuff
});
```

##### Task dependencies

This lets you specify tasks to be executed and completed before your task will run.

```javascript
gulp.task('somename', ['array','of','task','names'], function(){
  // do stuff
});
```

If the dependencies are asynchronous it is not guaranteed that they will finish before `'somename'` is executed. To ensure they are completely finished, you need to make sure the dependency tasks have asynchronous support through one of the methods outlined below. The most simple method is to return the stream. By returning the stream, Orchestrator is able to listen for the end event and only run `'somename'` once each dependencies' stream end event has been emitted. You can also use callbacks or promises to do your own cool stuff.

##### Async tasks

With callbacks:

```javascript
gulp.task('somename', function(cb){
  // do stuff
  cb(err);
});
```

Wait for stream to end:

```javascript
gulp.task('somename', function () {
  var stream = gulp.src('./client/**/*.js')
    .pipe(minify())
    .pipe(gulp.dest('/public');
  return stream;
});
```

With promises:

```javascript
var Q = require('q');

gulp.task('somename', function(){
  var deferred = Q.defer();

  // do async stuff
  setTimeout(function () {
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
gulp.run('scripts', 'copyfiles', 'builddocs', function (err) {
  // All done or aborted due to err
});
```

Use gulp.run to run tasks from other tasks. You will probably use this in your default task and to group small tasks into larger tasks.

### gulp.watch(glob, cb)

glob can be a standard glob or an array of globs. cb is called on each fs change with an object describing the change.

```javascript
gulp.watch("js/**/*.js", function(event){
  gulp.run('scripts', 'copyfiles');
});
```

### gulp.env

gulp.env is an optimist arguments object. Running `gulp test dostuff --production` will yield `{_:["test","dostuff"],production:true}`. Plugins don't use this.

## gulp cli

### Tasks

Tasks can be executed by running `gulp <taskname> <othertask> <somethingelse>`. Just running `gulp` will execute the task you registered called `default`. If there is no `default` task gulp will error.

### Compilers

You can use any language you want for your gulpfile. You will have to specify the language module name so the CLI can load it (and its assosciated extensions) before attempting to find your gulpfile. Make sure you have this module installed accessible by the folder you are running the CLI in.

Example:

```
gulp dosomething --require coffee-script
```


## Writing a plugin

This is a simple plugin that adds a header to the beginning of each file. It takes one argument (a string). Let's call it `gulp-header`. I recommend event-stream as a utility for creating these plugins.

#### Code

```javascript
var es = require('event-stream');

module.exports = function(header){
  // check our options
  if (!header) throw new Error("header option missing");

  // our map function
  function modifyContents(file, cb){
    // remember that contents is ALWAYS a buffer
    file.contents = new Buffer(header + String(file.contents));

    // first argument is an error if one exists
    // second argument is the modified file object
    cb(null, file);
  }

  // return a stream
  return es.map(modifyContents);
}
```

#### Usage

```javascript
var gulp = require('gulp');
var header = require('gulp-header');

// Add a copyright header to each file
gulp.src('./client/scripts/*.js')
  .pipe(header('// This file is copyrighted'))
  .pipe(gulp.dest("./public/scripts/"))
```

## Plugin Guidelines

1. file.contents should always go out the same way it came in
  - Respect buffered, streaming, and non-read files as well as folders!
1. Do not pass the file object downstream until you are done with it
1. Make use of the gulp-util library. Templating, CLI colors, logging. Do you need to change a file's extension or do some tedious fs crap? Try looking there first and add it if it doesn't exist
1. Remember: Your plugin should only do one thing! It should not have a complex config object that makes it do multiple things. It should not concat and add headers/footers. This is not grunt. Keep it simple.
1. Do not throw errors. Emit them from the stream (or pass them to the callback if using event-stream's .map).
1. Add "gulpplugin" as a keyword in your package.json so you show up on our search

If you don't follow these guidelines and somebody notices your plugin will be shitlisted from the ecosystem.

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

