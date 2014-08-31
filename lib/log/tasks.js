'use strict';

var chalk = require('chalk');
var archy = require('archy');
var gutil = require('gulp-util');
var tildify = require('tildify');

function logTasks(tree, env) {
  tree.label = 'Tasks for ' + chalk.magenta(tildify(env.configPath));
  archy(tree)
    .split('\n')
    .forEach(function (v) {
      if (v.trim().length === 0) {
        return;
      }
      gutil.log(v);
    });
}

module.exports = logTasks;
