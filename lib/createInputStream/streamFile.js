var fs = require('graceful-fs');

module.exports = function (file, cb) {
  file.contents = fs.createReadStream(file.path);
  cb(null, file);
};