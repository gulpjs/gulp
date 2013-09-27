/*jshint node:true */
/*exports gulp */
/*global gulp:true */
module.exports = gulp = {
  reset: function() {
    'use strict';
    gulp.tasks = {};
    gulp.taskQueue = [];
    gulp.isRunning = false;
    gulp.doneCallback = undefined;
    return this;
  },
  tasks: {},
  taskQueue: [],
  task: function(name, dep, fn) {
    'use strict';
    if (!fn) {
      fn = dep;
      dep = undefined;
    }
    if (!name || !fn) {
      throw new Error('Task requires a name and a function to execute');
    }
    // TODO: validate name is a string, dep is an array of strings, and fn is a function
    gulp.tasks[name] = {
      fn: fn,
      dep: dep || [],
      name: name
    };
    return this;
  },
  isRunning: false,
  doneCallback: undefined,
  run: function() {
    'use strict';
    var names, lastTask, seq = [];
    names = [].slice.call(arguments, 0);
    if (names.length) {
      lastTask = names[names.length-1];
      if (typeof lastTask === 'function') {
        gulp.doneCallback = lastTask;
        names.pop();
      }
    }
    if (names.length === 0) {
      names.push('default');
    }
    if (gulp.isRunning) {
      // if you call run() again while a previous run is still in play
      // append the new tasks to the existing task queue
      names = gulp.taskQueue.concat(names);
    }
    seq = [];
    gulp._runSequencer(gulp.tasks, names, seq, []);
    gulp.taskQueue = seq;
    gulp.isRunning = true;
    setTimeout(function () {
      gulp._runStep();
    },0);
    return this;
  },
  _runSequencer: function (tasks, names, results, nest) {
    'use strict';
    var i, name, node;
    for (i = 0; i < names.length; i++) {
      name = names[i];
      if (results.indexOf(name) === -1) {
        node = tasks[name];
        if (!node) {
          throw new Error(name+' is not defined');
        }
        if (nest.indexOf(name) > -1) {
          throw new Error('Recursive dependencies detected: '+nest.join(' -> ')+' -> '+name);
        }
        if (node.dep.length) {
          nest.push(name);
          gulp._runSequencer(tasks, node.dep, results, nest); // recurse
          nest.pop(name);
        }
        results.push(name);
      }
    }
  },
  _runStep: function () {
    'use strict';
    var task, i, t;
    if (!gulp.isRunning) {
      return; // They aborted it
    }
    for (i = 0; i < gulp.taskQueue.length; i++) {
      t = gulp.tasks[gulp.taskQueue[i]];
      if (!t.done) {
        task = t;
        break;
      }
    }
    if (!task) {
      // done
      gulp.isRunning = false;
      if (gulp.doneCallback) {
        gulp.doneCallback();
      }
    } else {
      // not done
      var p = task.fn.call(gulp);
      if (p && p.done) {
        // wait for promise to resolve
        // FRAGILE: ASSUME: Q promises
        p.done(function () {
          task.done = true;
          gulp._runStep();
        }); // .done() with no onRejected so failure is thrown
      } else {
        // no promise, just do the next task, setTimeout to clear call stack
        task.done = true;
        setTimeout(function () {
          gulp._runStep();
        }, 0);
      }
    }
    return this;
  },
  src: require('./lib/createInputStream'),
  dest: require('./lib/createOutputStream'),

  watch: require('./lib/watchFile'),
  createGlobStream: require('glob-stream').create,
  readFile: require('./lib/readFile')
};
