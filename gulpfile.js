'use strict';

var gulp = require('./');
var env = require('gulp-util').env;
var log = require('gulp-util').log;

var toc = require('gulp-toc');
var jshint = require('gulp-jshint');
var header = require('gulp-header');
var markdown = require('gulp-markdown');

var codeFiles = ['**/*.js', '!node_modules/**'];

gulp.task('lint', function(){
  log('Linting Files');
  return gulp.src(codeFiles)
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter());
});

gulp.task('docs', function(){
  log('Building Docs');
  return gulp.src('docs/**/*.md')
    .pipe(markdown())
    .pipe(header('<!-- toc -->\n'))
    .pipe(toc())
    .pipe(gulp.dest('generated-docs'));
});

gulp.task('watch', function(){
  log('Watching Files');
  gulp.watch(codeFiles, ['lint']);
});

var tasksToRun = ['lint'];

if(env.docs){
  tasksToRun.push('docs');
}

if(env.dev){
  tasksToRun.push('watch');
}

gulp.start.apply(gulp, tasksToRun);
