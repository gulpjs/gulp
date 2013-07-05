var es = require('event-stream'),
  readFile = require('./readFile');

module.exports = function(path, opt) {
  var stream = es.map(readFile);

  process.nextTick(function(){
    stream.write(path);
    process.nextTick(function(){
      stream.emit('end');
    });
  });
  return stream;
};
