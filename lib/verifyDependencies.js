'use strict';

var chalk = require('chalk');
var gutil = require('gulp-util');
var blackList = require('./blackList');
var formatError = require('./formatError');

module.exports = function verifyDependencies(depNames) {

  blackList(Object.keys(depNames), function(err, blackListed) {
    if (err) {
      gutil.log(chalk.red('Error: failed to retrieve plugins black-list'));
      gutil.log(formatError(err));
      process.exit(1);
    }

    if (blackListed) {
      gutil.log(chalk.red('Black-listed plugins found in this project:'));
      for (var blDependency in blackListed) {
        gutil.log(blDependency + ': ' + blackListed[blDependency]);
      }
      process.exit(1);
    } else {
      gutil.log(
        chalk.green('There are no black-listed plugins in this project')
      );
      process.exit(0);
    }
  });
};
