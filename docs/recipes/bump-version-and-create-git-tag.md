# Bump version number and create new Git tag

If your project follows a semantic versioning, it may be a good idea to automatize the steps needed to do a release.
Below you have a simple recipe that bumps the project version, commits the changes to git and creates a 
new tag.

``` javascript

var gulp = require('gulp');
var runSequence = require('run-sequence');
var bump = require('gulp-bump');
var gutil = require('gulp-util');
var git = require('gulp-git');
var fs = require('fs');

gulp.task('bump-version', function () {
//Note: I have hardcoded the version change type to 'patch' but it may be a good idea to use 
//      minimist (https://www.npmjs.com/package/minimist) to determine with a command argument whether you are doing 
//      a 'major', 'minor' or a 'patch' change.
  return gulp.src(['./bower.json', './package.json'])
    .pipe(bump({type: "patch"}).on('error', gutil.log))
    .pipe(gulp.dest('./'));
});

gulp.task('commit-changes', function () {
  return gulp.src('.')
    .pipe(git.commit('[Prerelease] Bumped version number', {args: '-a'}));
});

gulp.task('push-changes', function (cb) {
  git.push('origin', 'master', cb);
});

gulp.task('create-new-tag', function (cb) {
  var version = getPackageJsonVersion();
  git.tag(version, 'Created Tag for version: ' + version, function (error) {
    if (error) {
      return cb(error);
    }
    git.push('origin', 'master', {args: '--tags'}, cb);
  });
  
  function getPackageJsonVersion () {
    //We parse the json file instead of using require because require caches multiple calls so the version number won't be updated
    return JSON.parse(fs.readFileSync('./package.json', 'utf8')).version;
  };
});

gulp.task('release', function (callback) {
  runSequence(
    'bump-version',
    'commit-changes',
    'push-changes',
    'create-new-tag',
    function (error) {
      if (error) {
        console.log(error.message);
      } else {
        console.log('RELEASE FINISHED SUCCESSFULLY');
      }
      callback(error);
    });
});

```
