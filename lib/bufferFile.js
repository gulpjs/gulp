var fs = require('fs');

module.exports = function (file, cb) {
  fs.stat(file.path, function (err, stat) {
    if (stat.isDirectory()) {
      file.isDirectory = true;
      return cb(null, file);
    }
    fs.readFile(file.path, function (err, data) {
      if (err) return cb(err);
      file.contents = data;
      cb(null, file);
    });
  });
};