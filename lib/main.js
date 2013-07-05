module.exports = gulp = {
  reset: function() {
    gulp.tasks = {};
    return gulp;
  },
  tasks: {},
  task: function(name, fn) {
    gulp.tasks[name] = fn;
    return gulp;
  },
  run: function() {
    var tasks = [].slice.call(arguments, 0);
    tasks.forEach(function(name) {
      var fn = gulp.tasks[name];
      if (fn == null) {
        throw new Error("No task named \"" + name + "\"");
      }
      fn.call(gulp);
    });
    return gulp;
  },
  files: require('./createFilesStream'),
  file: require('./createFileStream'),
  createGlobStream: require('glob-stream').create,
  readFile: require('./readFile')
};
