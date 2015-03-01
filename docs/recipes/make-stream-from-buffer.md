# Make stream from buffer (memory contents)

Sometimes you may need to start a stream with files that their contents are in a variable and not in a physical file. In other words, how to start a 'gulp' stream without using `gulp.src()`.

Let's say for example that we have a directory with js lib files and another directory with versions of some module. The target of the build would be to create one js file for each version, containing all the libs and the version of the module concatenated.

Logically we would break it down like this:

* load the lib files
* concatenate the lib file contents
* load the versions files
* for each version file, concatenate the libs' contents and the version file contents
* for each version file, output the result in a file

Imagine this file structure:

```sh
├── libs
│   ├── lib1.js
│   └── lib2.js
└── versions
    ├── version.1.js
    └── version.2.js
```

You should get:

```sh
└── output
    ├── version.1.complete.js # lib1.js + lib2.js + version.1.js
    └── version.2.complete.js # lib1.js + lib2.js + version.2.js
```

A simple and modular way to do this would be the following:

```js
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var vinylBuffer = require('vinyl-buffer');
var tap = require('gulp-tap');
var concat = require('gulp-concat');
var size = require('gulp-size');
var path = require('path');
var es = require('event-stream');

var memory = {}; // we'll keep our assets in memory

// task of loading the files' contents in memory
gulp.task('load-lib-files', function() {
  // read the lib files from the disk
  return gulp.src('src/libs/*.js')
    // concatenate all lib files into one
    .pipe(concat('libs.concat.js'))
    // tap into the stream to get each file's data
    .pipe(tap(function(file) {
      // save the file contents in memory
      memory[path.basename(file.path)] = file.contents.toString();
    }));
});

gulp.task('load-versions', function() {
  memory.versions = {};
  // read the version files from the disk
  return gulp.src('src/versions/version.*.js')
  // tap into the stream to get each file's data
  .pipe( tap(function(file) {
    // save the file contents in the assets
    memory.versions[path.basename(file.path)] = file.contents.toString();
  }));
});

gulp.task('write-versions', function() {
  // we store all the different version file names in an array
  var availableVersions = Object.keys(memory.versions);
  // we make an array to store all the stream promises
  var streams = [];

  availableVersions.forEach(function(v) {
    // make a new stream with fake file name
    var stream = source('final.' + v);
    
    var streamEnd = stream;
    
    // we load the data from the concatenated libs
    var fileContents = memory['libs.concat.js'] +
      // we add the version's data
      '\n' + memory.versions[v];

    // write the file contents to the stream
    stream.write(fileContents);

    process.nextTick(function() {
      // in the next process cycle, end the stream
      stream.end();
    });

    streamEnd = streamEnd
    // transform the raw data into the stream, into a vinyl object/file
    .pipe(vinylBuffer())
    //.pipe(tap(function(file) { /* do something with the file contents here */ }))
    .pipe(gulp.dest('output'));
    
    // add the end of the stream, otherwise the task would finish before all the processing
    // is done
    streams.push(streamEnd);
    
  });

  return es.merge.apply(this, streams);
});

//============================================ our main task
gulp.task('default', gulp.series(
    // load the files in parallel
    gulp.parallel('load-lib-files', 'load-versions'),
    // ready to write once all resources are in memory
    'write-versions'
  )
);

//============================================ our watcher task
// only watch after having run 'default' once so that all resources
// are already in memory
gulp.task('watch', gulp.series(
  'default',
  function() {
    gulp.watch('./src/libs/*.js', gulp.series(
      'load-lib-files',
      'write-versions'
    ));

    gulp.watch('./src/versions/*.js', gulp.series(
      'load-lib-files',
      'write-versions'
    ));
  }
));
```
