var es = require('event-stream');
var gs = require('glob-stream');
var formatFile = require('./formatFile');

var bufferFile = require('./bufferFile');
var streamFile = require('./streamFile');

module.exports = function(glob, opt) {
  if (!opt) opt = {};
  if (typeof opt.read !== 'boolean') opt.read = true;
  if (typeof opt.buffer !== 'boolean') opt.buffer = true;

  var globStream = gs.create(glob, opt.glob);
  var stream = globStream.pipe(es.map(formatFile));

  // dont read anything - just pass names
  if (!opt.read) {
    return stream;
  }

  // read and pass full contents
  if (opt.buffer) {
    return stream.pipe(es.map(bufferFile));
  }

  // dont buffer anything - just pass streams
  if (!opt.buffer) {
    return stream.pipe(es.map(streamFile));
  }

  return stream;
};
