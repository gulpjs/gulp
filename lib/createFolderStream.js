var es = require('event-stream'),
  fs = require('fs'),
  path = require('path'),
  mkdirp = require('mkdirp');

module.exports = function(folder, opt) {
  if (!opt) opt = {};

  folder = path.resolve(folder);

  function saveFile (file) {
    var writePath = path.join(folder, file.shortened);
    var that = this;

    mkdirp(folder, function(err){
      if (err) return that.emit('error', err);
      fs.writeFile(writePath, file.contents, function(err){
        if (err) return that.emit('error', err);
        // re-emit the same data we got in.
        that.emit('data', file);
      });
    });
  }
  var stream = es.through(saveFile);
  return stream;
};
