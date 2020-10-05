# Only pass through changed files

Files are passed through the whole pipe chain on every run by default. By using [gulp-changed](https://github.com/sindresorhus/gulp-changed) only changed files will be passed through. This can speed up consecutive runs considerably.


```js
// npm install --save-dev gulp gulp-changed gulp-jscs gulp-uglify

var gulp = require('gulp');
var changed = require('gulp-changed');
var jscs = require('gulp-jscs');
var uglify = require('gulp-uglify');

// we define some constants here so they can be reused
var SRC = 'src/*.js';
var DEST = 'dist';

gulp.task('default', function() {
	return gulp.src(SRC)
		// the `changed` task needs to know the destination directory
		// upfront to be able to figure out which files changed
		.pipe(changed(DEST))
		// only files that has changed will pass through here
		.pipe(jscs())
		.pipe(uglify())
		.pipe(gulp.dest(DEST));
});
```
