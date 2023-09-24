'use strict';

function task(name, fn) {
  if (typeof name === 'function') {
    fn = name;
    name = fn.displayName || fn.name;
  }

  if (!fn) {
    return this._getTask(name);
  }

  this._setTask(name, fn);
}

module.exports = task;
