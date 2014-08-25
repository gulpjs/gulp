'use strict';

var chalk = require('chalk');
var gutil = require('gulp-util');
var prettyTime = require('pretty-hrtime');
var formatError = require('./formatError');

// wire up logging events
function logEvents(gulpInst) {

  gulpInst.on('start', function (e) {
    // TODO: batch these
    // so when 5 tasks start at once it only logs one time with all 5
    gutil.log('Starting', '\'' + chalk.cyan(e.name) + '\'...');
  });

  gulpInst.on('stop', function (e) {
    var time = prettyTime(e.duration);
    gutil.log(
      'Finished', '\'' + chalk.cyan(e.name) + '\'',
      'after', chalk.magenta(time)
    );
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
