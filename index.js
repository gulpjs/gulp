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
      if (!fn) {
        throw new Error("No task named \"" + name + "\"");
      }
      fn.call(gulp);
    });
    return this;
  },
  files: require('./lib/createFilesStream'),
  file: require('./lib/createFileStream'),
  folder: require('./lib/createFolderStream'),
  createGlobStream: require('glob-stream').create,
  readFile: require('./lib/readFile'),
  realBase: require('./lib/realBase')
};
