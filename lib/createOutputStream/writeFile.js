var fs = require('graceful-fs');
var gutil = require('gulp-util');

// TODO: convert this to through and only end stream when all file descriptors are closed
module.exports = function (writePath, file, cb) {
  // if no contents then do nothing
  if (file.isNull()) return cb(null, file);

  // stream it to disk yo
  if (file.isStream()) {
    var outStream = fs.createWriteStream(writePath);
    file.contents.pipe(outStream);
    cb(null, file);
    return;
  }

  if (file.isBuffer()) {
    // write it like normal
    fs.writeFile(writePath, file.contents, function(err){
      if (err) return cb(err);

      // re-emit the same data we got in.
      cb(null, file);
    });
    return;
  }
};