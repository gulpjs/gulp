'use strict';

var assert = require('assert');

var metadata = require('./helpers/metadata');

function set(name, fn) {
  assert(name, 'Task name must be specified');
  assert(typeof name === 'string', 'Task name must be a string');
  assert(typeof fn === 'function', 'Task function must be specified');

  function taskWrapper() {
    return fn.apply(this, arguments);
  }

  function unwrap() {
    return fn;
  }

  taskWrapper.unwrap = unwrap;
  taskWrapper.displayName = name;

  var meta = metadata.get(fn) || {};
  var nodes = [];
  if (meta.branch) {
    nodes.push(meta.tree);
  }

  var task = this._registry.set(name, taskWrapper) || taskWrapper;

  metadata.set(task, {
    name: name,
    orig: fn,
    tree: {
      label: name,
      type: 'task',
      nodes: nodes,
    },
  });
}

module.exports = set;
