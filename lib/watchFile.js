var gaze = require('gaze');
var EventEmitter = require('events').EventEmitter;

module.exports = function(glob, cb) {
  var out = new EventEmitter();

  var watcher = gaze(glob, function(err, rwatcher){
    rwatcher.on('all', function(evt, path, old){
      var outEvt = {type: evt, path: path};
      if(old) outEvt.old = old;
      out.emit('change', outEvt);
      if(cb) cb(outEvt);
    });
  });

  watcher.on('end', out.emit.bind(out, 'end'));
  watcher.on('error', out.emit.bind(out, 'error'));
  watcher.on('ready', out.emit.bind(out, 'ready'));

  out.end = function(){
    return watcher.close();
  };
  out.files = function(){
    return watcher.watched();
  };
  out.add = function(){
    return watcher.add();
  };
  out.remove = function(){
    return watcher.remove();
  };
  out._watcher = watcher;

  return out;
};