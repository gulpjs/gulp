# Deploy to GitHub Pages

> GitHub Pages is a free hosting service for static sites. 
> For more information, please visit: https://pages.github.com

Assuming you're using a [static site generator](http://staticsitegenerators.net/),
which compiles the site into the temporary `./build` folder of your project
using `gulp.task('build', ...)` task, and you want the contents of this folder
to be pushed to the master branch of your `https://github.com/{name}/{name}.github.io.git`
repository to make it published on `https://{name}.github.io`.

```javascript
var gulp = require('gulp');
var gutil = require('gulp-util');
var path = require('path');

// Settings
var deployUrl = 'https://github.com/{name}/{name}.github.io.git';
var buildPath = './build';
 
// Build website into the `./build` folder
gulp.task('build', function() {
  // Your custom build steps go here
});
 
// Deploy from the `./build` folder to GitHub Pages.
// For more information, please visit: https://pages.github.com
gulp.task('deploy', ['build'], function(cb) {
  var exec = require('child_process').exec;
  var cwd = path.join(__dirname, buildPath);
  var cmd = 'git init && ' +
            'git remote add origin ' + deployUrl + ' && ' +
            'git add . && git commit -m Release && ' +
            'git push -f origin master';

  exec(cmd, { 'cwd': cwd }, function(err, stdout, stderr) {
    if (err !== null) {
      cb(err);
    } else {
      gutil.log(stdout, stderr);
      cb();
    }
  });
});
```

Replace `{name}` in the above code snippet with your actual GitHub user or organization account.

To deploy, simply run `gulp deploy` or `gulp deploy --production`.