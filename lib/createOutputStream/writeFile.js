var fs = require('graceful-fs');
var semver = require('semver');
var gutil = require('gulp-util');

module.exports = function (writePath, file, cb) {
  // if no contents then do nothing
  if (file.isNull()) return cb(null, file);

  // stream it to disk yo
  if (file.isStream()) {
    var outStream = fs.createWriteStream(writePath);
    file.contents.once('end', function(){
      cb(null, file);
    });
    file.contents.pipe(outStream);

    // >0.10 needs this stream fix
    if (semver.lt(process.versions.node, '0.10.0')) {
      file.contents.resume();
    }
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