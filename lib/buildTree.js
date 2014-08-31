'use strict';

function buildTree(nodes, task) {
  if (typeof task === 'function' && task.__gulp) {
    return nodes.concat({
      label: task.__gulp.label,
      nodes: task.__gulp.nodes.reduce(buildTree, [])
    });
  }

  // tree already built
  if (typeof task === 'object' && task.label) {
    return nodes.concat(task);
  }

  if (typeof task === 'string') {
    return nodes.concat(task);
  }

  return nodes;
}

module.exports = buildTree;
