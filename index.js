/*jshint node:true */

"use strict";

var util = require('util');
var Orchestrator = require('orchestrator');
var gutil = require('gulp-util');

function Gulp(){
  Orchestrator.call(this);
  this.env = gutil.env;
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
Gulp.prototype.watch = require('glob-watcher');

var gulp = new Gulp();
gulp.Gulp = Gulp;

module.exports = gulp;
