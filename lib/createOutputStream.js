var es = require('event-stream'),
  fs = require('fs'),
  path = require('path'),
  mkdirp = require('mkdirp');

module.exports = function(folder, opt) {
  if (!opt) opt = {};

  folder = path.resolve(folder);

  function saveFile (file, cb) {
    var writePath = path.join(folder, file.shortened);
    var writeFolder = path.dirname(writePath);

    mkdirp(writeFolder, function(err){
      if (err) return cb(err);
      fs.writeFile(writePath, file.contents, function(err){
        if (err) return cb(err);

        // re-emit the same data we got in.
        cb(null, file);
      });
    });
  }
  var stream = es.map(saveFile);
  return stream;
};
