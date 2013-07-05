var es = require('event-stream'),
  readFile = require('./readFile');

module.exports = function(path, opt) {
  var stream = es.pause();
  stream.pipe(es.map(readFile));
  process.nextTick(function(){
    stream.emit('data', path);
    process.nextTick(function(){
      stream.emit('end');
    });
  });
  return stream;
};
