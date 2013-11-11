var mkdirp = require('mkdirp');
var isStream = require('./isStream');

module.exports = function (writePath, file, cb) {
  // create directory
  mkdirp(writePath, function (err) {
    if (err) {
      cb(err);
    }
    cb(null, file);
  });
};