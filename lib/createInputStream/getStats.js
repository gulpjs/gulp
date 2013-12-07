var es = require('event-stream');
var fs = require('fs');

module.exports = function(opt) {
  return es.map(function (file, cb) {
    fs.stat(file.path, function (err, stat) {
      if (err) return cb(err);
      file.stat = stat;
      cb(null, file);
    });
  });
};