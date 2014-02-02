'use strict';

var gulp = require('./');
var env = require('gulp-util').env;
var log = require('gulp-util').log;

var jshint = require('gulp-jshint');

var codeFiles = ['**/*.js', '!node_modules/**'];

gulp.task('lint', function(){
  log('Linting Files');
  return gulp.src(codeFiles)
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter());
});

gulp.task('watch', function(){
  log('Watching Files');
  gulp.watch(codeFiles, ['lint']);
});

gulp.task('default', ['lint', 'watch']);

var taskToRun = env.dev ? 'default' : 'lint';

gulp.start(taskToRun);
