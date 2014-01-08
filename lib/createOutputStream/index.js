var es = require('event-stream');
var path = require('path');
var mkdirp = require('mkdirp');
var writeFile = require('./writeFile');
var writeDir = require('./writeDir');

module.exports = function(folder, opt) {
  if (!opt) opt = {};

  folder = path.resolve(folder);

  var stream;
  var endCallback, files = [];

  function saveFile(file) {
    var writePath = path.join(folder, file.relative);
    var writeFolder = path.dirname(writePath);
    var cb = function(err, file) {
      if(err) {
        stream.emit('error', err);
        return;
      }
      if(file.isBuffer()) {
        discountFile();
      }
      stream.emit('data', file);
    };
    var discountFile = function() {
      files.splice(files.indexOf(file), 1);
      if(0 === files.length) {
        if (endCallback) endCallback();
      }
    };

    if(file.isStream()) {
      files.push(file);
      file.contents.once('realend', discountFile);
    } else if(file.isBuffer()) {
      files.push(file);
    }

    mkdirp(writeFolder, function(err) {
      if (err) return cb(err);
      // probably redundant since we are already doing an mkdirp
      if (file.stat && file.stat.isDirectory()) {
        writeDir(writePath, file, cb);
      } else {
        writeFile(writePath, file, cb);
      }
    });
  };

  function endStream() {
    endCallback = function() {
      stream.emit('end');
    };
    if(0 === files.length) {
      endCallback();
    }
  };

  stream = es.through(saveFile, endStream);

  return stream;
};
