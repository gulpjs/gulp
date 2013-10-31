var es = require('event-stream');
var path = require('path');
var mkdirp = require('mkdirp');
var writeFile = require('./writeFile');

module.exports = function(folder, opt) {
  if (!opt) opt = {};

  folder = path.resolve(folder);

  function saveFile (file, cb) {
    var writePath = path.join(folder, file.shortened);
    var writeFolder = path.dirname(writePath);

    mkdirp(writeFolder, function(err){
      if (err) return cb(err);
      writeFile(writePath, file, cb);
    });
  }
  var stream = es.map(saveFile);
  return stream;
};
