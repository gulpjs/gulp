var map = require('map-stream');
var path = require('path');
var mkdirp = require('mkdirp');
var writeFile = require('./writeFile');
var writeDir = require('./writeDir');

module.exports = function(folder, opt) {
  if (!opt) opt = {};

  folder = path.resolve(folder);

  function saveFile (file, cb) {
    var writePath = path.join(folder, file.relative);
    var writeFolder = path.dirname(writePath);

    mkdirp(writeFolder, function(err){
      if (err) return cb(err);
      // probably redundant since we are already doing an mkdirp
      if (file.stat && file.stat.isDirectory()) {
        writeDir(writePath, file, cb);
      } else {
        writeFile(writePath, file, cb);
      }
    });
  }
  var stream = map(saveFile);
  return stream;
};
