var Stream = require('stream');
var path = require('path');
var mkdirp = require('mkdirp');
var writeFile = require('./writeFile');
var writeDir = require('./writeDir');

module.exports = function(folder, opt) {
  if (!opt) opt = {};

  folder = path.resolve(folder);

  var stream = new Stream.Transform({objectMode: true});
  var endCallback, files = [];

  stream._transform = function (file, unused, cb) {
    var writePath = path.join(folder, file.relative);
    var writeFolder = path.dirname(writePath);
    
    if(file.isStream()) {
      files.push(file);
      
      file.contents.once('realend', function() {
        files.splice(files.indexOf(file), 1);
        if(0 === files.length) {
          if (endCallback) endCallback();
        }
      });
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

  stream._flush = function (cb) {
    if(files.length) {
      endCallback = cb;
    } else {
      cb();
    }
  };

  return stream;
};
