var es = require('event-stream');
var gs = require('glob-stream');

var File = require('./File');
var getContents = require('./getContents');

module.exports = function(glob, opt) {
  if (!opt) opt = {};
  if (typeof opt.read !== 'boolean') opt.read = true;
  if (typeof opt.buffer !== 'boolean') opt.buffer = true;

  var globStream = gs.create(glob, opt);
  var formatStream = es.map(function(file, cb){
    cb(null, new File(file.base, file.path));
  });

  var stream = globStream.pipe(formatStream);

  return stream.pipe(getContents(opt));
};
