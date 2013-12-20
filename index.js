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
  try {
    this.start.apply(this, tasks);
  } catch(ex) {
    // check case where 'default' task is not defined
    if (ex.message === "default is not defined") {
      gutil.log(gutil.colors.red("Error"), "There is no", 
        gutil.colors.cyan("'default'"),  "task defined in your 'gulpfile.js'");
      gutil.log("Please check the documentation for proper gulpfile.js formating.");
    } else {
      throw(ex);
    }
  }
};

Gulp.prototype.src = require('./lib/createInputStream');
Gulp.prototype.dest = require('./lib/createOutputStream');
Gulp.prototype.watch = require('./lib/watch');

var gulp = new Gulp();
gulp.Gulp = Gulp;

module.exports = gulp;
