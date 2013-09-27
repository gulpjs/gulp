module.exports = gulp = {
  reset: function() {
    gulp.tasks = {};
    return this;
  },
  tasks: {},
  task: function(name, fn) {
    gulp.tasks[name] = fn;
    return this;
  },
  run: function() {
    var tasks = [].slice.call(arguments, 0);
    if (tasks.length === 0) {
    	tasks.push('default');
    }
    tasks.forEach(function(name) {
      var fn = gulp.tasks[name];
      if (!fn) {
        throw new Error("No task named \"" + name + "\"");
      }
      fn.call(gulp);
    });
    return this;
  },
  src: require('./lib/createInputStream'),
  dest: require('./lib/createOutputStream'),

  watch: require('./lib/watchFile'),
  createGlobStream: require('glob-stream').create,
  readFile: require('./lib/readFile')
};
