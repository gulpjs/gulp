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
    tasks.forEach(function(name) {
      var fn = gulp.tasks[name];
      if (fn == null) {
        throw new Error("No task named \"" + name + "\"");
      }
      return fn.call(gulp);
    });
    return this;
  },
  files: require('./createFilesStream'),
  file: require('./createFileStream'),
  createGlobStream: require('glob-stream').create,
  readFile: require('./readFile')
};
