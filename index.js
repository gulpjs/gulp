'use strict';

var util = require('util');
var Undertaker = require('undertaker');
var vfs = require('vinyl-fs');
var watch = require('glob-watcher');
var fs = require('fs');

function Gulp() {
  Undertaker.call(this);

  // Bind the functions for destructuring
  this.watch = this.watch.bind(this);
  this.task = this.task.bind(this);
  this.series = this.series.bind(this);
  this.parallel = this.parallel.bind(this);
  this.registry = this.registry.bind(this);
  this.tree = this.tree.bind(this);
  this.lastRun = this.lastRun.bind(this);
  this.src = this.src.bind(this);
  this.dest = this.dest.bind(this);
  this.symlink = this.symlink.bind(this);
}
util.inherits(Gulp, Undertaker);

Gulp.prototype.src = vfs.src;
Gulp.prototype.dest = vfs.dest;
Gulp.prototype.symlink = vfs.symlink;
Gulp.prototype.watch = function(glob, opt, task) {
  if (typeof opt === 'string' || typeof task === 'string' ||
    Array.isArray(opt) || Array.isArray(task)) {
    throw new Error('watching ' + glob + ': watch task has to be ' +
      'a function (optionally generated by using gulp.parallel ' +
      'or gulp.series)');
  }

  if (typeof opt === 'function') {
    task = opt;
    opt = {};
  }

  opt = opt || {};

  var fn;
  if (typeof task === 'function') {
    fn = this.parallel(task);
  }

  return watch(glob, opt, fn);
};

Gulp.prototype.copy = function(pathOrArray, dest) {

    function make(item) {
        if(fs.lstatSync(item).isDirectory()) {
            this.src(`${item}/**`).pipe(this.dest(`${dest}/${item}`))
        } else {
            this.src(item).pipe(this.dest(dest))
        }
    }

    if(Array.isArray(pathOrArray)) {
        while(pathOrArray.length != 0) {
            make(pathOrArray.shift())
        }
    } else {
        make(pathOrArray)
    }
}

// Let people use this class from our instance
Gulp.prototype.Gulp = Gulp;

var inst = new Gulp();
module.exports = inst;
