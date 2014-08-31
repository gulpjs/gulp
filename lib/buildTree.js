'use strict';

function buildTree(nodes, task) {
  if (typeof task === 'function' && task.__gulp) {
    return nodes.concat({
      label: task.__gulp.label,
      nodes: task.__gulp.nodes.reduce(buildTree, [])
    });
  }

  if (typeof task === 'string') {
    return nodes.concat(task);
  }

  return nodes;
}

module.exports = buildTree;
