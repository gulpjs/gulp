var fs = require('fs');
var isStream = require('./isStream');

module.exports = function (writePath, file, cb) {
  // create directory
  fs.mkdir(writePath, function (err) {
    if (err && err.code === 'EEXIST') {
      err = null; // Ignore 'directory already exists' error
    }
    if (err) {
      cb(err);
    }
    cb(null, file);
  });
};