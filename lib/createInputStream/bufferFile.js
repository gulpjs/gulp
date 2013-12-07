var fs = require('fs');

module.exports = function (file, cb) {
  fs.readFile(file.path, function (err, data) {
    if (err) return cb(err);
    file.contents = data;
    cb(null, file);
  });
};