/*jshint node:true */

"use strict";

var util = require('util');
var Orchestrator = require('orchestrator');
var gutil = require('gulp-util');
var prettyTime = require('pretty-hrtime');

// format orchestrator errors
var formatError = function(e) {
  if (!e.err) return e.message;
  if (e.err.message) return e.err.message;
  return JSON.stringify(e.err);
};

function Gulp(){
  Orchestrator.call(this);
  this.env = {};

  // Logging
  this.on('task_start', function(e){
    gutil.log('Running', "'"+gutil.colors.cyan(e.task)+"'...");
  });
  this.on('task_stop', function(e){
    var time = prettyTime(e.hrDuration);
    gutil.log('Finished', "'"+gutil.colors.cyan(e.task)+"'", "in", gutil.colors.magenta(time));
  });

  this.on('task_err', function(e){
    var msg = formatError(e);
    var time = prettyTime(e.hrDuration);
    gutil.log('Errored', "'"+gutil.colors.cyan(e.task)+"'", "in", gutil.colors.magenta(time), gutil.colors.red(msg));
  });
}
util.inherits(Gulp, Orchestrator);

Gulp.prototype.taskQueue = Gulp.prototype.seq;
Gulp.prototype.task = Gulp.prototype.add;
Gulp.prototype.run = function(){
  var tasks = Array.prototype.slice.call(arguments);
  
  // impose our opinion of "default" tasks onto orchestrator
  if (!tasks.length) {
    tasks = ['default'];
  }
  this.start.apply(this, tasks);
};

Gulp.prototype.src = require('./lib/createInputStream');
Gulp.prototype.dest = require('./lib/createOutputStream');
Gulp.prototype.watch = require('./lib/watch');

var gulp = new Gulp();
gulp.Gulp = Gulp;

module.exports = gulp;
