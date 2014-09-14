'use strict';

var chalk = require('chalk');
var gutil = require('gulp-util');

var formatError = require('../formatError');

function logBlacklistError(err) {
  gutil.log(chalk.red('Error: failed to retrieve plugins black-list'));
  gutil.log(formatError(err));
  process.exit(1);
}

module.exports = logBlacklistError;
