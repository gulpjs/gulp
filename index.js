/*jshint node:true */

'use strict';

var util = require('util');
var Orchestrator = require('orchestrator');
var gutil = require('gulp-util');
var vfs = require('vinyl-fs');

function Gulp(){
  Orchestrator.call(this);
  this.env = gutil.env;
}
util.inherits(Gulp, Orchestrator);

Gulp.prototype.taskQueue = Gulp.prototype.seq;
Gulp.prototype.task = Gulp.prototype.add;
Gulp.prototype.run = function(){
  // impose our opinion of "default" tasks onto orchestrator
  var tasks = arguments.length ? arguments : ['default'];

  this.start.apply(this, tasks);
};
Gulp.prototype.alias = function (alias, names) {
  var tasks = typeof names === 'string' ? names.split(' ') : names;
  this.task(alias, function () {
    this.run.apply(this, tasks);
  });
};

Gulp.prototype.src = vfs.src;
Gulp.prototype.dest = vfs.dest;
Gulp.prototype.watch = vfs.watch;

// let people use this class from our instance
Gulp.prototype.Gulp = Gulp;

var inst = new Gulp();

module.exports = inst;
