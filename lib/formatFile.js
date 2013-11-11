var realBase = require('gulp-util').realBase;

module.exports = function (file, cb) {
  cb(null, {
    shortened: realBase(file.base, file.path),
    base: file.base,
    path: file.path,
    isDirectory: false
  });
};