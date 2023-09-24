'use strict';

var assert = require('assert');

var map = require('arr-map');
var flatten = require('arr-flatten');
var levenshtein = require('fast-levenshtein');

function normalizeArgs(registry, args) {
  function getFunction(task) {
    if (typeof task === 'function') {
      return task;
    }

    var fn = registry.get(task);
    if (!fn) {
      var similar = similarTasks(registry, task);
      if (similar.length > 0) {
        assert(false, 'Task never defined: ' + task + ' - did you mean? ' + similar.join(', '));
      } else {
        assert(false, 'Task never defined: ' + task);
      }
    }
    return fn;
  }

  var flattenArgs = flatten(args);
  assert(flattenArgs.length, 'One or more tasks should be combined using series or parallel');

  return map(flattenArgs, getFunction);
}

function similarTasks(registry, queryTask) {
  if (typeof queryTask !== 'string') {
    return [];
  }

  var tasks = registry.tasks();
  var similarTasks = [];
  for (var task in tasks) {
    if (tasks.hasOwnProperty(task)) {
      var distance = levenshtein.get(task, queryTask);
      var allowedDistance = Math.floor(0.4 * task.length) + 1;
      if (distance < allowedDistance) {
        similarTasks.push(task);
      }
    }
  }
  return similarTasks;
}

module.exports = normalizeArgs;
