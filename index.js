/*jshint node:true */

"use strict";

var util = require('util');
var Orchestrator = require('orchestrator');

function Gulp(){
  Orchestrator.call(this);
}
util.inherits(Gulp, Orchestrator);

Gulp.prototype.taskQueue = Gulp.prototype.seq;
Gulp.prototype.task = Gulp.prototype.add;
Gulp.prototype.run = Gulp.prototype.start;
Gulp.prototype.src = require('./lib/createInputStream');
Gulp.prototype.dest = require('./lib/createOutputStream');
Gulp.prototype.watch = require('./lib/watchFile');
Gulp.prototype.createGlobStream = require('glob-stream').create;

Gulp.prototype.formatFile = require('./lib/formatFile');
Gulp.prototype.bufferFile = require('./lib/bufferFile');
Gulp.prototype.streamFile = require('./lib/streamFile');

var gulp = new Gulp();
gulp.Gulp = Gulp;

module.exports = gulp;
