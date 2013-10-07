[![Build Status](https://travis-ci.org/wearefractal/gulp.png?branch=master)](https://travis-ci.org/wearefractal/gulp)

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

This project is in it's early stages. If something is not working or you would like a new feature please use the issues page.

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
  gulp.src("./client/js/*.js", {ignore: ["vendor"]})
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

Takes a glob and represents a file structure. Can be piped to plugins.

```javascript
gulp.src("./client/templates/*.jade")
    .pipe(jade())
    .pipe(minify())
    .pipe(gulp.dest("./public/minified_templates"));
```

### gulp.dest(path[, opt])

Can be piped to and it will write files. Re-emits all data passed to it so you can pipe to multiple folders.

```javascript
gulp.src("./client/templates/*.jade")
    .pipe(jade())
    .pipe(gulp.dest("./public/templates"))
    .pipe(minify())
    .pipe(gulp.dest("./public/minified_templates"));
```

### gulp.task(name, [dep], fn)

All steps code must be defined within a task. Tasks that you want to run from the command line should not have spaces in them.

```javascript
gulp.task('somename', function(){
  // do stuff
});
```

A task that runs another task:
```javascript
gulp.task('default', function(){
  gulp.run('somename');
});
```

A task that requires a dependent task to complete first:
```javascript
gulp.task('somename', ['deptask'], function(){
  // do stuff
});
```

An async task using the callback pattern:
```javascript
gulp.task('somename', function(callback){
  // do stuff
  callback(err, result);
});
```

An async task using promises:
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

Tasks can be executed by running `gulp <taskname> <othertask> <somethingelse>`

Just running `gulp` will execute the task you registered called `default`.


### gulp.run(tasks...)

Triggers tasks to be executed. Does not run in order.

```javascript
gulp.run('scripts', 'copyfiles', 'builddocs');
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

gulp.env is an optimist arguments object. Running `gulp test dostuff --production` will yield `{_:["test","dostuff"],production:true}`

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

1. file.contents should always be a Buffer.
2. Do not pass the file object downstream until you are done with it.
3. Make use of the gulp-util library. Do you need to change a file's extension or do some tedious path crap? Try looking there first and add it if it doesn't exist.
4. Remember: Your plugin should only do one thing! It should not compile AND compress. It should not have a complex config object that makes it do multiple things. It should not concat and add headers/footers. This is not grunt. Keep it simple.
5. Add "gulpplugin" as a keyword in your package.json so you show up on our search

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
