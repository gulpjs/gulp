/*jshint node:true */
/*exports gulp */
/*global gulp:true, console:false */
// TODO: refactor to use async.auto()
module.exports = gulp = {
  verbose: false,
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
    if (gulp.verbose) {
      console.log('[gulp tasks: '+gulp.taskQueue.join(',')+']');
    }
    if (!gulp.isRunning) {
      gulp.isRunning = true;
      gulp._runStep();
    }
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
    var i, task, allDone = true;
    if (!gulp.isRunning) {
      return; // They aborted it
    }
    for (i = 0; i < gulp.taskQueue.length; i++) {
      task = gulp.tasks[gulp.taskQueue[i]];
      if (!task.done && !task.running) {
        if (gulp._readyToRunTask(task)) {
          gulp._runTask(task);
        }
      }
      if (!task.done) {
        allDone = false;
      }
    }
    if (allDone) {
      if (gulp.verbose) {
        console.log('build succeeded');
      }
      gulp.isRunning = false;
      if (gulp.doneCallback) {
        gulp.doneCallback();
      }
    }
  },
  _readyToRunTask: function (task) {
    "use strict";
    var ready = true, // No one disproved it yet
      i, name, t;
    if (task.dep.length) {
      for (i = 0; i < task.dep.length; i++) {
        name = task.dep[i];
        t = gulp.tasks[name];
        if (!t.done) {
          ready = false;
          break;
        }
      }
    }
    return ready;
  },
  _runTask: function (task) {
    "use strict";
    if (gulp.verbose) {
      console.log('['+task.name+' started]');
    }
    task.running = true;
    var cb = function (err) {
      if (err) {
        throw new Error(err);
      }
      task.running = false;
      task.done = true;
      if (gulp.verbose) {
        console.log('['+task.name+' calledback]');
      }
      gulp._runStep.call(gulp);
    };
    var p = task.fn.call(gulp, cb);
    if (p && p.done) {
      // wait for promise to resolve
      // FRAGILE: ASSUME: Q promises
      p.done(function () {
        task.running = false;
        task.done = true;
        if (gulp.verbose) {
          console.log('['+task.name+' resolved]');
        }
        gulp._runStep.call(gulp);
      }); // .done() with no onRejected so failure is thrown
    } else if (!task.fn.length) {
      // no promise, no callback, we're done
      if (gulp.verbose) {
        console.log('['+task.name+' finished]');
      }
      task.running = false;
      task.done = true;
    //} else {
      // FRAGILE: ASSUME: callback
    }
  },
  src: require('./lib/createInputStream'),
  dest: require('./lib/createOutputStream'),

  watch: require('./lib/watchFile'),
  createGlobStream: require('glob-stream').create,
  readFile: require('./lib/readFile')
};
