var fs = require('graceful-fs');
var semver = require('semver');

module.exports = function (file, cb) {
  file.contents = fs.createReadStream(file.path);

  // >0.10 needs this stream fix
  if (semver.lt(process.versions.node, '0.10.0')) {
    file.contents.pause();
  }
  cb(null, file);
};