module.exports = function (file, cb) {
  file.isDirectory = true;
  cb(null, file);
};