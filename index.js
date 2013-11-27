/*jshint node:true */

"use strict";

var util = require('util');
var Orchestrator = require('orchestrator');
var chalk = require('chalk');

// format orchestrator errors
var formatError = function(e) {
  if (!e.err) return e.message;
  if (e.err.message) return e.err.message;
  return JSON.stringify(e.err);
};

function Gulp(){
  Orchestrator.call(this);
  this.env = {};

  // Logging
  this.on('task_start', function(e){
    gulp.log('Running', "'"+chalk.cyan(e.task)+"'...");
  });
  this.on('task_stop', function(e){
    gulp.log('Finished', "'"+chalk.cyan(e.task)+"' in "+chalk.magenta(e.duration)+" seconds");
  });

  this.on('task_err', function(e){
    var msg = formatError(e);
    gulp.log('Errored', "'"+chalk.cyan(e.task)+"' in "+chalk.magenta(e.duration)+" seconds "+chalk.red(msg));
  });
}
util.inherits(Gulp, Orchestrator);

Gulp.prototype.log = function(){
  if (this.env.silent) return;
  var sig = '['+chalk.green('gulp')+']';
  var args = Array.prototype.slice.call(arguments);
  args.unshift(sig);
  console.log.apply(console, args);
  return this;
};

Gulp.prototype.taskQueue = Gulp.prototype.seq;
Gulp.prototype.task = Gulp.prototype.add;
Gulp.prototype.run = function(){
  var tasks = Array.prototype.slice.call(arguments);
  
  if (!tasks.length) {
    tasks = ['default'];
  }
  this.start.apply(this, tasks);
};

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
