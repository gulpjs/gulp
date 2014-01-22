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

Gulp.prototype.task = Gulp.prototype.add;
Gulp.prototype.run = function(){
  // run() is deprecated as of 3.5 and will be removed in 4.0
  // use task dependencies instead

  // impose our opinion of "default" tasks onto orchestrator
  var tasks = arguments.length ? arguments : ['default'];

  this.start.apply(this, tasks);
};

Gulp.prototype.src = vfs.src;
Gulp.prototype.dest = vfs.dest;
Gulp.prototype.watch = function (glob, opt, fn) {
  if (!fn) {
    fn = opt;
    opt = null;
  }

  if (typeof fn === 'function') {
    return vfs.watch(glob, opt, fn);
  }

  // array of tasks given
  if (Array.isArray(fn)) {
    return vfs.watch(glob, opt, function(){
      this.start.apply(this, fn);
    }.bind(this));
  }

  if (typeof fn === 'object') {

  }
  return vfs.watch(glob, opt, fn);
};

// let people use this class from our instance
Gulp.prototype.Gulp = Gulp;

var inst = new Gulp();

module.exports = inst;
