'use strict';

var chalk = require('chalk');
var gutil = require('gulp-util');
var prettyTime = require('pretty-hrtime');
var formatError = require('../formatError');
var batchThese = require('../batchThese');

// wire up logging events
function logEvents(gulpInst) {

  gulpInst.on('start', function (e) {
    var batched = '\'' +chalk.cyan(e.name)+ '\'';
    // logs once when tasks `start` at the same time
    batchThese('start', batched, function(batch){
      gutil.log('Starting', batch.join(', '));
    });
  });

  gulpInst.on('stop', function (e) {
    var time = prettyTime(e.duration);
    var batched = '\'' +chalk.cyan(e.name)+ '\' after ' +chalk.magenta(time);
    // logs once tasks `stop` at the same time
    batchThese('stop', batched, function(batch){
      // `stop` events have longer logs
      if( batch.length < 3 ){
        gutil.log('Finished', batch.join(', '));
        return ;
      }
      gutil.log('Finished', batch.slice(0, 2).join(', ') + ', ');
      gutil.log( batch.slice(2).join(', ') );
    });
  });

  gulpInst.on('error', function (e) {
    var msg = formatError(e);
    var time = prettyTime(e.duration);
    gutil.log(
      '\'' + chalk.cyan(e.name) + '\'',
      chalk.red('errored after'),
      chalk.magenta(time)
    );
    gutil.log(msg);
    process.exit(1);
  });
}

module.exports = logEvents;
