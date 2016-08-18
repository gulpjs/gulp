'use strict';

// Initialize vinyl-fs-wrap in Node.js 6+ compatibility mode
var vfsWrap = require('./vinyl-fs-wrap');
vfsWrap.initCompat();

// Export the origial Gulp
module.exports = require('./index');
