var es = require('event-stream'),
  readFile = require('./readFile'),
  dirname = require('path').dirname;

module.exports = function(path, opt) {
  var stream = es.map(readFile);

  process.nextTick(function(){
    stream.write({
      base: dirname(path),
      path: path
    });
    stream.end();
  });
  return stream;
};
