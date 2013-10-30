/*jshint node:true */

"use strict";

var util = require('util');
var Orchestrator = require('orchestrator');
var chalk = require('chalk');

function Gulp(){
  Orchestrator.call(this);
  this.env = {};
  this.on('task_start', function(e){
    gulp.log('Running', "'"+chalk.cyan(e.task)+"'...");
  });
}
util.inherits(Gulp, Orchestrator);

Gulp.prototype.log = function(){
  if (this.env.silent) return;
  var sig = '['+chalk.green('gulp')+']';
  var args = [].slice.call(arguments);
  args.unshift(sig);
  console.log.apply(console, args);
  return this;
};

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
