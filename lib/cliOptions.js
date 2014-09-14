'use strict';

module.exports = {
  version: {
    abbr: 'v',
    flag: true,
    help: 'Print the global and local gulp versions.'
  },
  require: {
    list: true,
    metavar: '<module path>',
    help:
      'Will require a module before running the gulpfile. ' +
      'This is useful for transpilers but also has other applications.'
  },
  gulpfile: {
    metavar: '<gulpfile path>',
    help:
      'Manually set path of gulpfile. Useful if you have multiple gulpfiles. ' +
      'This will set the CWD to the gulpfile directory as well.'
  },
  cwd: {
    metavar: '<dir path>',
    help:
      'Manually set the CWD. The search for the gulpfile, ' +
      'as well as the relativity of all requires will be from here.'
  },
  verify: {
    metavar: '<package.json path>',
    flag: true,
    help:
      'Will verify plugins referenced in project\'s package.json against ' +
      'the plugins blacklist.'
  },
  tasks: {
    full: 'tasks',
    abbr: 'T',
    flag: true,
    help: 'Print the task dependency tree for the loaded gulpfile.'
  },
  tasksSimple: {
    full: 'tasks-simple',
    flag: true,
    help: 'Print a plaintext list of tasks for the loaded gulpfile.'
  },
  tasksJson: {
    full: 'tasks-json',
    flag: true,
    help:
      'Print the task dependency tree, ' +
      'in JSON format, for the loaded gulpfile.'
  },
  color: {
    flag: true,
    help:
      'Will force gulp and gulp plugins to display colors, ' +
      'even when no color support is detected.'
  },
  noColor: {
    full: 'no-color',
    flag: true,
    help:
      'Will force gulp and gulp plugins to not display colors, ' +
      'even when color support is detected.'
  },
  silent: {
    flag: true,
    help: 'Suppress all gulp logging.'
  }
};
