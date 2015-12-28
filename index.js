'use strict'

var util = require('util')
var vfs = require('vinyl-fs')
var Tasks = require('./lib/tasks')

function Gulp () {
  Tasks.call(this)
}

util.inherits(Gulp, Tasks)

// Let people use this class from our instance
Gulp.prototype.Gulp = Gulp

Gulp.prototype.src = vfs.src
Gulp.prototype.dest = vfs.dest
Gulp.prototype.watch = function (glob, opt, fn) {
  if (typeof opt === 'function' || Array.isArray(opt)) {
    fn = opt
    opt = null
  }

  // Array of tasks given
  if (Array.isArray(fn)) {
    return vfs.watch(glob, opt, function () {
      this.start.apply(this, fn)
    }.bind(this))
  }

  return vfs.watch(glob, opt, fn)
}

var inst = new Gulp()
module.exports = inst
