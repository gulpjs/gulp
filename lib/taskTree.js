'use strict';

module.exports = function(tasks) {
  return Object.keys(tasks)
    .reduce((prev, task) => {
      prev.nodes.push({
        label: task,
        nodes: tasks[task].dep,
      });
      return prev;
    }, {
      nodes: [],
    });
};
