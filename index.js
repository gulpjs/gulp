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
Gulp.prototype.watch = vfs.watch;

// let people use this class from our instance
Gulp.prototype.Gulp = Gulp;

var inst = new Gulp();
module.exports = inst;
