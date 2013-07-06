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

## Usage

```javascript
var gulp = require('gulp');
var jade = require('gulp-jade');
var coffee = require('gulp-coffee');
var minify = require('gulp-minify');

// compile, minify, and copy templates
gulp.task('templates', function(){
  gulp.files("./client/templates/*.jade")
    .pipe(jade())
    .pipe(minify())
    .pipe(gulp.folder("./public/templates"));
});

gulp.task('scripts', function(){
  
  // compile, minify, and copy coffeescript
  gulp.files("./client/js/*.js", {ignore: ["vendor"]})
    .pipe(coffee())
    .pipe(minify())
    .pipe(gulp.folder("./public/js"));

  // copy vendor files
  gulp.files("./client/js/vendor/**")
    .pipe(minify())
    .pipe(gulp.folder("./public/js/vendor"));

});

// copy all static assets
gulp.task('copy', function(){
  gulp.files("./client/img/**")
    .pipe(gulp.folder("./public/img"));

  gulp.files("./client/css/**")
    .pipe(gulp.folder("./public/css"));

  gulp.files("./client/*.html")
    .pipe(gulp.folder("./public"));

  gulp.files("./client/*.ico")
    .pipe(gulp.folder("./public"));

});

// default task gets called when you run the `gulp` command
gulp.task('default', function(){
  gulp.run('templates', 'scripts', 'copy');
});
```

### gulp.files(glob[, opt])

Takes a glob and represents an array of files with no structure. Can be piped to a folder.

### gulp.folder(path[, opt])

Takes a folder path and represents it's structure. Can be piped to and it will write files. Re-emits all data passed to it so you can pipe to multiple folders.

### gulp.task(name, fn)

All steps code must be defined within a task. Tasks that you want to run from the command line should not have spaces in them.

Tasks can be executed by running `gulp <taskname> <othertask> <somethingelse>`

Just running `gulp` will execute the task you registered called default.


### gulp.run(tasks...)

Executes tasks in order.

```javascript
gulp.run('scripts', 'copyfiles', 'builddocs');
```

Use gulp.run to run tasks from other tasks. You will probably use this in your default task and to group small tasks into larger tasks.

## Writing a plugin

This is a simple plugin that mutates the contents of a file. I recommend event-stream as a simple stream utility. This example plugin takes an options object with a license attribute and prepends it to all files passed through it.

Tips:

1. file.contents should always be a Buffer
2. Use the `clone` module to clone options and copy the file object. Do not mutate the file object then pass it! Clone it then mutate it.

```javascript
var es = require('event-stream'),
  clone = require('clone');

module.exports = function(opt){
  // clone options
  opt = opt ? clone(opt) : {};
  function modifyContents(file, cb){
    // clone the file so we arent mutating stuff
    var newFile = clone(file);
    newFile.contents = new Buffer(opt.license+newFile.contents);
    cb(null, file);
  }
  return es.map(modifyContents);
}
```

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
