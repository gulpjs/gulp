'use strict';

function buildTree(nodes, task) {
  if (typeof task === 'function' && task.__label) {
    return nodes.concat({
      label: task.__label,
      nodes: task.__nodes.reduce(buildTree, [])
    });
  }

  if (typeof task === 'string') {
    return nodes.concat(task);
  }

  return nodes;
}

module.exports = buildTree;
