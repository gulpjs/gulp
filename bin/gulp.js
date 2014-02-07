#!/usr/bin/env node

'use strict';
var gutil = require('gulp-util');
var prettyTime = require('pretty-hrtime');
var semver = require('semver');
var archy = require('archy');
var Liftoff = require('liftoff');
var taskTree = require('../lib/taskTree');

var cli = new Liftoff({
  name: 'gulp',
  completions: require('../lib/completion')
});

cli.on('require', function (name) {
  gutil.log('Requiring external module', gutil.colors.magenta(name));
});

cli.on('requireFail', function (name) {
  gutil.log(gutil.colors.red('Failed to load external module'), gutil.colors.magenta(name));
});

cli.launch(function () {
  handleArguments(this);
});

function handleArguments(args) {
  var argv = args.argv;
  var cliPackage = require('../package');
  var versionFlag = argv.v || argv.V || argv.version;
  var tasksFlag = argv.T || argv.tasks;
  var tasks = argv._;
  var toRun = tasks.length ? tasks : ['default'];

  if (versionFlag) {
    gutil.log('CLI version', cliPackage.version);
    if (args.localPackage) {
      gutil.log('Local version', args.modulePackage.version);
    }
    process.exit(0);
  }

  if (!args.modulePath) {
    gutil.log(gutil.colors.red('No local gulp install found in'), gutil.colors.magenta(args.cwd));
    gutil.log(gutil.colors.red('Try running: npm install gulp'));
    process.exit(1);
  }

  if (!args.configPath) {
    gutil.log(gutil.colors.red('No gulpfile found'));
    process.exit(1);
  }

  // check for semver difference between cli and local installation
  if (semver.gt(cliPackage.version, args.modulePackage.version)) {
    gutil.log(gutil.colors.red('Warning: gulp version mismatch:'));
    gutil.log(gutil.colors.red('Running gulp is', cliPackage.version));
    gutil.log(gutil.colors.red('Local gulp (installed in gulpfile dir) is', args.modulePackage.version));
  }

  var gulpFile = require(args.configPath);
  gutil.log('Using gulpfile', gutil.colors.magenta(args.configPath));

  var gulpInst = require(args.modulePath);
  logEvents(gulpInst);
  process.chdir(args.cwd);
  gutil.log('Working directory changed to', gutil.colors.magenta(args.cwd));

  process.nextTick(function () {
    if (tasksFlag) {
      return logTasks(gulpFile, gulpInst);
    }
    gulpInst.start.apply(gulpInst, toRun);
  });
}

function logTasks(gulpFile, localGulp) {
  var tree = taskTree(localGulp.tasks);
  tree.label = 'Tasks for ' + gutil.colors.magenta(gulpFile);
  archy(tree).split('\n').forEach(function (v) {
    if (v.trim().length === 0) return;
    gutil.log(v);
  });
}

// format orchestrator errors
function formatError(e) {
  if (!e.err) return e.message;
  if (e.err.message) return e.err.message;
  return JSON.stringify(e.err);
}

// wire up logging events
function logEvents(gulpInst) {
  gulpInst.on('task_start', function (e) {
    gutil.log('Running', "'" + gutil.colors.cyan(e.task) + "'...");
  });

  gulpInst.on('task_stop', function (e) {
    var time = prettyTime(e.hrDuration);
    gutil.log('Finished', "'" + gutil.colors.cyan(e.task) + "'", 'in', gutil.colors.magenta(time));
  });

  gulpInst.on('task_err', function (e) {
    var msg = formatError(e);
    var time = prettyTime(e.hrDuration);
    gutil.log('Errored', "'" + gutil.colors.cyan(e.task) + "'", 'in', gutil.colors.magenta(time), gutil.colors.red(msg));
  });

  gulpInst.on('task_not_found', function (err) {
    gutil.log(gutil.colors.red("Task '" + err.task + "' was not defined in your gulpfile but you tried to run it."));
    gutil.log('Please check the documentation for proper gulpfile formatting.');
    process.exit(1);
  });
}