'use strict';

var util = require('util');
var Undertaker = require('undertaker');
var vfs = require('vinyl-fs');

function Gulp() {
  Undertaker.call(this);
}
util.inherits(Gulp, Undertaker);

Gulp.prototype.src = vfs.src;
Gulp.prototype.dest = vfs.dest;
Gulp.prototype.symlink = vfs.symlink;
Gulp.prototype.watch = function (glob, opt, task) {
  if (typeof opt === 'function') {
    task = opt;
    opt = null;
  }

  var fn;
  if (typeof task === 'function') {
    fn = this.parallel(task);
  }

  return vfs.watch(glob, opt, fn);
};

// let people use this class from our instance
Gulp.prototype.Gulp = Gulp;

var inst = new Gulp();
module.exports = inst;
