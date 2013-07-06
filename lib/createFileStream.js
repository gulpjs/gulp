var es = require('event-stream'),
  readFile = require('./readFile'),
  dirname = require('path').dirname,
  realBase = require('./realBase');

module.exports = function(path, opt) {
  if (!opt) opt = {};

  var file = {
    base: dirname(path),
    path: path
  };
  file.shortened = realBase(file.base, file.path);

  var stream = es.map(readFile);
  process.nextTick(function(){
    stream.write(file);
    stream.end();
  });
  return stream;
};
