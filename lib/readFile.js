var fs = require('fs'),
  realBase = require('gulp-util').realBase;

module.exports = function (file, opts, cb) {
  if (!cb) {
    cb = opts;
    opts = {
      buffer:false,
      read:true
    };
  }

  var doCb = function (err, data, isDirectory) {
    if (err) {
      return cb(err);
    }
    var newFile = {
      shortened: realBase(file.base, file.path),
      base: file.base,
      path: file.path,
      contents: data
    };
    if (isDirectory) {
      newFile.isDirectory = true;
    }
    cb(null, newFile);
  };

  fs.stat(file.path, function (err, stat) {
    if (err) {
      return cb(err);
    }

    if (stat.isDirectory()) {
      // No content for directory, avoid 'Error: EISDIR, read'
      doCb(null, null, true);
    } else if (opts.buffer) {
      // buffer = true, readFileSync
      var data = fs.readFileSync(file.path);
      doCb(null, data);
    } else if (opts.read) {
      // buffer = false, read = true, readFile (async)
      fs.readFile(file.path, function (err, data) {
        doCb(err, data);
      });
    } else {
      // buffer = false, read = false, no content
      doCb(null, null);
    }
  });
};
