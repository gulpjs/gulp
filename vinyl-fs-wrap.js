'use strict';

var compat = false;

function init() {
  if (exports.vfs) {
    return;
  }
  exports.vfs = require('vinyl-fs');
}

function initCompat() {
  if (exports.vfs) {
    if (!compat) {
      throw new Error(
        'Gulp was already initialized without Node.js 6+ compatibility mode!\n' +
        'Make sure that you require gulp/compat before other gulp plugins.\n' +
        '\n' +
        'Note that dependencies should not force this mode.\n' +
        'The compatibility mode is intended only for the top-most gulpfile.js.\n'
      );
    }
    return;
  }
  compat = true;
  exports.vfs = require('vinyl-fs-03-compat');
}

exports.init = init;
exports.initCompat = initCompat;
