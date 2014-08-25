'use strict';

function logTasksSimple(env, localGulp) {
  var keys = Object.keys(localGulp.registry.tasks);
  console.log(keys.join('\n').trim());
}

module.exports = logTasksSimple;
