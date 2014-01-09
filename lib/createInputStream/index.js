var map = require('map-stream');
var gs = require('glob-stream');

var File = require('gulp-util').File;
var getContents = require('./getContents');
var getStats = require('./getStats');

module.exports = function(glob, opt) {
  if (!opt) opt = {};
  if (typeof opt.read !== 'boolean') opt.read = true;
  if (typeof opt.buffer !== 'boolean') opt.buffer = true;

  var globStream = gs.create(glob, opt);
  var formatStream = map(function(file, cb){
    cb(null, new File(file));
  });

  var stream = globStream.pipe(formatStream);

  return stream
    .pipe(getStats(opt))
    .pipe(getContents(opt));
};
