var fs = require('fs'),
  realBase = require('./realBase');

module.exports = function (file, cb) {
  fs.readFile(file.path, function (err, data) {
    if (err) return cb(err);
    cb(null, {
      shortened: realBase(file.base, file.path),
      base: file.base,
      path: file.path,
      contents: data
    });
  });
};