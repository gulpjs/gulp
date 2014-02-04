#!/usr/bin/env node

'use strict';

var path = require('path');

var resolve = require('resolve');
var findup = require('findup-sync');
var gutil = require('gulp-util');
var prettyTime = require('pretty-hrtime');
var minimist = require('minimist');
var semver = require('semver');
var archy = require('archy');

var completion = require('../lib/completion');
var taskTree = require('../lib/taskTree');
var cliPkg = require('../package.json');

// parse what we want off the CLI
var argv = minimist(process.argv.slice(2));

if (argv.completion) {
  return completion(argv.completion);
}

var tasks = argv._;
var tasksFlag = argv.T || argv.tasks;

// TODO: drop argv.v in the next breaking release
var versionFlag = argv.v || argv.V || argv.version;
var cwdFlag = argv.cwd;
var fileFlag = argv.gulpfile;

var cwd;

if (cwdFlag) {
  cwd = path.resolve(cwdFlag);
} else {
  cwd = process.cwd();
}

loadRequires(argv.require, cwd);

var gulpFile;

if (fileFlag) {
  gulpFile = path.join(cwd, fileFlag);
} else {
  gulpFile = getGulpFile(cwd);
}

// find the local gulp
var localGulp = findLocalGulp(gulpFile);
var localPkg = findLocalGulpPackage(gulpFile);

// print some versions and shit
if (versionFlag) {
  gutil.log('CLI version', cliPkg.version);
  if (localGulp) {
    gutil.log('Local version', localPkg.version);
  }
  process.exit(0);
}

if (!localGulp) {
  gutil.log(gutil.colors.red('No local gulp install found in'), gutil.colors.magenta(getLocalBase(gulpFile)));
  gutil.log(gutil.colors.red('Try running: npm install gulp'));
  process.exit(1);
}

// check for semver difference in running gulp vs locally installed and warn if running gulp > locally installed
if (semver.gt(cliPkg.version, localPkg.version)) {
  gutil.log(gutil.colors.red('gulp version mismatch:'));
  gutil.log(gutil.colors.red('Running gulp is', cliPkg.version));
  gutil.log(gutil.colors.red('Local gulp (installed in gulpfile dir) is', localPkg.version));
}

if (!gulpFile) {
  gutil.log(gutil.colors.red('No gulpfile found'));
  process.exit(1);
}

// Wire up logging for tasks
// on local gulp singleton
logEvents(localGulp);

// Load their gulpfile and run it
gutil.log('Using file', gutil.colors.magenta(gulpFile));
loadGulpFile(localGulp, gulpFile, tasks);

function loadRequires(requires, baseDir) {
  if (typeof requires === 'undefined') requires = [];
  if (!Array.isArray(requires)) requires = [requires];
  return requires.map(function(modName){
    gutil.log('Requiring external module', gutil.colors.magenta(modName));
    var mod = findLocalModule(modName, baseDir);
    if (typeof mod === 'undefined') {
      gutil.log('Failed to load external module', gutil.colors.magenta(modName));
    }
  });
}

function getLocalBase(gulpFile) {
  return path.resolve(path.dirname(gulpFile));
}

function findLocalGulp(gulpFile){
  var baseDir = getLocalBase(gulpFile);
  return findLocalModule('gulp', baseDir);
}

function findLocalModule(modName, baseDir){
  try {
    return require(resolve.sync(modName, {basedir: baseDir}));
  } catch(e) {}
  return;
}

function findLocalGulpPackage(gulpFile){
  var baseDir = getLocalBase(gulpFile);
  var packageBase;
  try {
    packageBase = path.dirname(resolve.sync('gulp', {basedir: baseDir}));
    return require(path.join(packageBase, 'package.json'));
  } catch(e) {}
  return;
}

function loadGulpFile(localGulp, gulpFile, tasks){
  var gulpFileCwd = path.dirname(gulpFile);
  process.chdir(gulpFileCwd);
  gutil.log('Working directory changed to', gutil.colors.magenta(gulpFileCwd));

  var theGulpfile = require(gulpFile);

  // just for good measure
  process.nextTick(function(){
    if (tasksFlag) {
      return logTasks(gulpFile, localGulp);
    }

    startGulp(localGulp, tasks);
  });
  return theGulpfile;
}

function startGulp(localGulp, tasks) {
  // impose our opinion of "default" tasks onto orchestrator
  var toRun = tasks.length ? tasks : ['default'];
  return localGulp.start.apply(localGulp, toRun);
}

function logTasks(gulpFile, localGulp) {
  var tree = taskTree(localGulp.tasks);
  tree.label = 'Tasks for '+gutil.colors.magenta(gulpFile);
  archy(tree).split('\n').forEach(function(v){
    if (v.trim().length === 0) return;
    gutil.log(v);
  });
}

function getGulpFile() {
  var extensions;
  if (require.extensions) {
    extensions = Object.keys(require.extensions).join(',');
  } else {
    extensions = ['.js'];
  }
  var gulpFile = findup('gulpfile{'+extensions+'}', {cwd: cwd, nocase: true});
  return gulpFile;
}

// format orchestrator errors
function formatError (e) {
  if (!e.err) return e.message;
  if (e.err.message) return e.err.message;
  return JSON.stringify(e.err);
}

// wire up logging events
function logEvents(gulp) {
  gulp.on('task_start', function(e){
    gutil.log('Running', "'"+gutil.colors.cyan(e.task)+"'...");
  });

  gulp.on('task_stop', function(e){
    var time = prettyTime(e.hrDuration);
    gutil.log('Finished', "'"+gutil.colors.cyan(e.task)+"'", 'in', gutil.colors.magenta(time));
  });

  gulp.on('task_err', function(e){
    var msg = formatError(e);
    var time = prettyTime(e.hrDuration);
    gutil.log('Errored', "'"+gutil.colors.cyan(e.task)+"'", 'in', gutil.colors.magenta(time), gutil.colors.red(msg));
  });

  gulp.on('task_not_found', function(err){
    gutil.log(gutil.colors.red("Task '"+err.task+"' was not defined in your gulpfile but you tried to run it."));
    gutil.log('Please check the documentation for proper gulpfile formatting.');
    process.exit(1);
  });
}
