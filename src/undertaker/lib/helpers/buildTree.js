'use strict';

var map = require('collection-map');

var metadata = require('./metadata');

function buildTree(tasks) {
  return map(tasks, function(task) {
    var meta = metadata.get(task);
    if (meta) {
      return meta.tree;
    }

    var name = task.displayName || task.name || '<anonymous>';
    meta = {
      name: name,
      tree: {
        label: name,
        type: 'function',
        nodes: [],
      },
    };

    metadata.set(task, meta);
    return meta.tree;
  });
}

module.exports = buildTree;
