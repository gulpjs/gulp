var es = require('event-stream'),
  fs = require('fs'),
  path = require('path'),
  ensureDir = require('ensureDir');

module.exports = function(folder, opt) {
  if (!opt) opt = {};

  folder = path.resolve(folder);

  function saveFile (file) {
    var writePath = path.join(folder, file.shortened);
    var that = this;

    ensureDir(folder, function(err){
      if (err) return that.emit('error', err);
      console.log(writePath, file.contents);
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
