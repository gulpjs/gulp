var mkdirp = require('mkdirp');

module.exports = function (writePath, file, cb) {
  // create directory
  mkdirp(writePath, function (err) {
    if (err) return cb(err);
    cb(null, file);
  });
};