var gaze = require('gaze'),
  EventEmitter = require('events').EventEmitter;

module.exports = function(glob, cb) {
  var out = new EventEmitter();

  var watcher = new gaze.Gaze(glob);
  watcher.on('error', out.emit.bind(out, 'error'));
  watcher.on('all', function(evt, path, old){
    var outEvt = {type: evt, path: path, old: old};
    out.emit('change', outEvt);
    if(cb) cb(outEvt);
  });

  out.stop = watcher.close;
  out.files = watcher.watched;
  out.add = watcher.add;
  out.remove = watcher.remove;
  out._watcher = watcher;

  return out;
};