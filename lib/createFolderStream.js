var es = require('event-stream'),
  gs = require('glob-stream'),
  readFile = require('./readFile'),
  join = require('path').join;

module.exports = function(folder, opt) {
  function saveFile (file) {
    
    // re-emit the same data we got in.
    this.emit('data', file);
  }
  var stream = es.through(saveFile);
  return stream;
};
