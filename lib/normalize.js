var relative = require('path').relative;

module.exports = function(dir) {
  return relative(process.cwd(), dir);
};