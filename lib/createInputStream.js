var es = require('event-stream'),
  gs = require('glob-stream'),
  readFile = require('./readFile');

module.exports = function(glob, opt) {
  if (!opt) opt = {};

  var readFileOpt = {
    buffer: false,
    read: true
  };
  if (opt.hasOwnProperty('buffer')) {
    readFileOpt.buffer = !!opt.buffer;
    delete opt.buffer;
  }
  if (opt.hasOwnProperty('read')) {
    readFileOpt.read = !!opt.read;
    delete opt.read;
  }

  var globStream = gs.create(glob, opt);
  var stream = globStream.pipe(es.map(function (file, cb) {
    readFile(file, readFileOpt, cb);
  }));
  return stream;
};
