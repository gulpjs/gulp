var fs = require('fs');

module.exports = function (file, cb) {
  fs.readFile(file.path, function (err, data) {
    if (err) return cb(err);
    cb(null, {
      base: file.base,
      path: file.path,
      contents: data
    });
  });
};