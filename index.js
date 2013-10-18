/*jshint node:true */

var Orchestrator = require('orchestrator');
var orchestrator = new Orchestrator();

var Gulp = function () {
};

Gulp.prototype = orchestrator;

Gulp.prototype.taskQueue = orchestrator.seq;
Gulp.prototype.task = orchestrator.add;
Gulp.prototype.src = require('./lib/createInputStream');
Gulp.prototype.dest = require('./lib/createOutputStream');
Gulp.prototype.watch = require('./lib/watchFile');
Gulp.prototype.createGlobStream = require('glob-stream').create;
Gulp.prototype.readFile = require('./lib/readFile');

var gulp = new Gulp();
gulp.Gulp = Gulp;

module.exports = gulp;
