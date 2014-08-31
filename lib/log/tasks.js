'use strict';

var archy = require('archy');
var gutil = require('gulp-util');

function logTasks(tree) {
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
