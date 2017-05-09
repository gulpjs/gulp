# Don't repeat yourself (DRY) gulpfiles

When writing gulpfiles, I often find myself copying entire blocks of code between files. I make mistakes and forget things. I improve one gulpfile and have a hard time upgrading old gulpfiles in other projects. 

In other words, _gulpfiles are not DRY between projects_. 

One way to solve this issue is by moving common task functionality into a set of external tasks that can be re-used across projects. The '[Split tasks across multiple files](split-tasks-across-multiple-files.md)' recipe breaks up your gulpfile into little files. The problem is that it doesn't solve the larger DRY issues that I've run into.

## Example less task

I might have a task to process my [less](http://lesscss.org/) CSS files. It is many lines tall and does a whole bunch of stuff. I've forgotten half of what it does (wtf is [plumber()](https://github.com/floatdrop/gulp-plumber))? It also necessitates adding `devDependencies` to my projects `package.json` and all the `require` lines at the top of the gulpfile. _What a mess_.

```
var gulp = require('gulp');
var plumber = require('gulp-plumber');
var less = require('gulp-less');
var cache = require('gulp-cached');
var changed = require('gulp-changed');
var sourcemaps = require('gulp-sourcemaps');
var lessPluginCleanCSS = require('less-plugin-clean-css');
var cleancss = new lessPluginCleanCSS({advanced: true});
var browserSync = require('browser-sync');

gulp.task('less', function () {
  return gulp.src(path.less)
    .pipe(cache('less'))
    .pipe(plumber())
    .pipe(changed(path.output, {extension: '.css'}))
    .pipe(sourcemaps.init())
    .pipe(less({
      plugins: [ cleancss ]
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(path.output))
    .pipe(browserSync.reload({ stream: true }));
});
```

## gulp-helpers to the rescue

[gulp-helpers](https://github.com/lookfirst/gulp-helpers/) reduces [the less CSS task](https://github.com/lookfirst/gulp-helpers/blob/master/src/tasks/less.js) down to a single line in your gulpfile.

```
npm install gulp-helpers --save-dev
```

```
var gulp = require('gulp');
var gulpHelpers = require('gulp-helpers');
var taskMaker = gulpHelpers.taskMaker(gulp);

taskMaker.defineTask('less', { src: 'src/**/*.less', dest: 'dist' });
```

A more complete example that uses [babel](http://babeljs.io/) to transpile our code on save looks like this:

```
var gulp = require('gulp');
var gulpHelpers = require('gulp-helpers');
var taskMaker = gulpHelpers.taskMaker(gulp);

var path = {
	source: 'src/**/*.js',
	output: 'dist',
	watch: 'src/**'
};

taskMaker.defineTask('clean', {taskName: 'clean', src: path.output});
taskMaker.defineTask('babel', {taskName: 'babel', src: path.source, dest: path.output, compilerOptions: {externalHelpers: false, optional: ['runtime']}});
taskMaker.defineTask('watch', {taskName: 'watch', src: path.watch, tasks: ['babel'], taskDeps: ['babel']});

gulp.task('default', ['clean', 'watch']);
```

* There is little code and a lot of configuration. It makes setting up new gulpfiles trivial because now I don't have to re-learn gulp and all of its plugins every time I want to start a new project. 

* The `package.json` `devDependencies` section is so clean! Just a dependency on gulp and gulp-helpers.

* Take advantage of bug fixes and improvements in gulp-helpers automatically and more importantly, across projects.

* When the next version of gulp is available, this gulpfile will work without changes.

## Summary

The primary intention for this recipe is to highlight the need for thinking about the pattern of reuse a bit more heavily.

[gulp-helpers](https://github.com/lookfirst/gulp-helpers/) isn't the end all solution, it is just one daisy in a field of flowers. I'm sure you can come up with something better, although pull requests are welcome!
