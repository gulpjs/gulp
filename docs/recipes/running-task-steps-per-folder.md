# Generating a file per folder

If you have a set of folders, and wish to perform a set of tasks on each, for instance

    /scripts
    /scripts/jquery/
    /scripts/angularjs/
   
and want to end up with

    /scripts
    /scripts/jquery.min.js
    /scripts/angularjs.min.js

and so on, you need to know a little more NodeJS and event streams. 

``` javascript
var 
  fs = require('fs')
  ,es = require('event-stream')
  ,gulp = require('gulp')
  ,uglify = require('gulp-uglify');

var scriptsPath = './src/scripts/';

function getFolders(dir){
    return fs.readdirSync(dir)
      .filter(function(file){
        return fs.statSync(dir + '/' + file).isDirectory();
      });
}
 
gulp.task('scripts', function() { 
   var folders = getFolders(scriptsPath);
   
   return es.concat.apply(null,(folders.map(function(folder) {
      return gulp.src(scriptsPath + folder + '/*.js')
        .pipe(uglify())
        .pipe(rename( folder + '.min.js'))
        .pipe(gulp.dest(scriptsPath));
   })));
});
```

A few notes with this:

- folders.map - executes the function once per folder, and returns the async stream
- es.concat - combines the streams and ends only when all streams emitted end
- the call to .apply(null, args) is needed as es.concat expects arguments not an array
