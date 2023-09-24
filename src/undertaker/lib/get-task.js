'use strict';

function get(name) {
  return this._registry.get(name);
}

module.exports = get;
