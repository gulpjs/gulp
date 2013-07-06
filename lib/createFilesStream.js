var es = require('event-stream'),
  gs = require('glob-stream'),
  readFile = require('./readFile');

module.exports = function(glob, opt) {
  if (!opt) opt = {};

  var globStream = gs.create(glob, opt);
  var stream = globStream.pipe(es.map(readFile));
  return stream;
};
