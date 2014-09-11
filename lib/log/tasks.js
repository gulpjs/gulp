'use strict';

var archy = require('archy');
var gutil = require('gulp-util');

function logTasks(tree) {
  archy(tree)
    .split('\n')
    .filter(function (v) {
      return v.trim().length > 0;
    })
    .forEach(function (v) {
      gutil.log(v);
    });
}

module.exports = logTasks;
