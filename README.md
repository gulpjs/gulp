[![Build Status](https://travis-ci.org/wearefractal/gulp.png?branch=master)](https://travis-ci.org/wearefractal/gulp)

## Information

<table>
<tr> 
<td>Package</td><td>gulp</td>
</tr>
<tr>
<td>Description</td>
<td>The streaming build system</td>
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

### gulp.task(name, fn)

All steps code must be defined within a task. Tasks that you want to run from the command line should not have spaces in them.

```javascript
gulp.task('somename', function(){
  // do stuff
});

gulp.task('default', function(){
  gulp.run('somename');
});
```

Tasks can be executed by running `gulp <taskname> <othertask> <somethingelse>`

Just running `gulp` will execute the task you registered called default.


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

This is a simple plugin that mutates the contents of a file. I recommend event-stream as a simple stream utility. This example plugin takes an options object with a license attribute and prepends it to all files passed through it.

Tips:

1. file.contents should always be a Buffer before passing it off
2. Use the `clone` module to clone the file object. Do not mutate the file object before cloning it! The piece that passed it to you may still be using it for something.
3. Make use of the gulp-util library. Do you need to change a file's extension or do some tedious path crap? Try looking there first and add it if it doesn't exist.
4. Remember: Your plugin should only do one thing! It should not compile AND compress. It should not have a complex config object that makes it do multiple things. This is not grunt.
5. Add "gulpplugin" as a keyword in your package.json so you show up on our search

```javascript
var es = require('event-stream'),
  clone = require('clone');

module.exports = function(opt){
  if (!opt) opt = {};
  if (!opt.license) opt.license = "This is copyrighted";

  function modifyContents(file, cb){
    // clone the file so we arent mutating stuff
    var newFile = clone(file);
    
    // remember that contents is ALWAYS a buffer
    var newContents = opt.license + String(newFile.contents);
    newFile.contents = new Buffer(newContents);
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
