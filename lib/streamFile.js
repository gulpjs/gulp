var fs = require('fs');

module.exports = function (file, cb) {
  fs.stat(file.path, function (err, stat) {
    if (stat.isDirectory()) {
      file.isDirectory = true;
      return cb(null, file);
    }
    file.contents = fs.createReadStream(file.path);
    cb(null, file);
  });
};