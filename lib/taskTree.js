/* jshint node: true */

'use strict';

module.exports = function(tasks) {
  return Object.keys(tasks).reduce(function(prev, task) {
    prev.nodes.push({
      label: task,
      nodes: tasks[task].deps
    });
    return prev;
  }, {nodes: []});
};