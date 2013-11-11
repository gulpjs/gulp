var es = require('event-stream');
var gs = require('glob-stream');
var formatFile = require('./formatFile');

var getContents = require('./getContents');

module.exports = function(glob, opt) {
  if (!opt) opt = {};
  if (typeof opt.read !== 'boolean') opt.read = true;
  if (typeof opt.buffer !== 'boolean') opt.buffer = true;

  var globStream = gs.create(glob, opt.glob);
  var stream = globStream.pipe(es.map(formatFile));

  return stream.pipe(getContents(opt));
};
