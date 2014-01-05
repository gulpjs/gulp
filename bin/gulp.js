#!/usr/bin/env node

var path = require('path');

var argv = require('optimist').argv;
var completion = require('../lib/completion');

if (argv.completion) {
  return completion(argv.completion);
}

var resolve = require('resolve');
var findup = require('findup-sync');
var gutil = require('gulp-util');
var prettyTime = require('pretty-hrtime');

var tasks = argv._;
var cliPkg = require('../package.json');

var localBaseDir = process.cwd();

loadRequires(argv.require, localBaseDir);

var gulpFile = getGulpFile(localBaseDir);

// find the local gulp
var localGulp = findLocalGulp(gulpFile);
var localPkg = findLocalGulpPackage(gulpFile);

// print some versions and shit
if (argv.v || argv.version) {
  gutil.log('CLI version', cliPkg.version);
  if (localGulp) {
    gutil.log('Local version', localPkg.version);
  }
  process.exit(0);
}

if (!localGulp) {
  gutil.log(gutil.colors.red('No local gulp install found in'), getLocalBase(gulpFile));
  gutil.log(gutil.colors.red('Perhaps do: npm install gulp'));
  process.exit(1);
}

if (!gulpFile) {
  gutil.log(gutil.colors.red('No Gulpfile found'));
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
    localGulp.run.apply(localGulp, tasks);
  });
  return theGulpfile;
}

function getGulpFile(baseDir) {
  var extensions;
  if (require.extensions) {
    extensions = Object.keys(require.extensions).join(',');
  } else {
    extensions = ['.js','.coffee'];
  }
  var gulpFile = findup('Gulpfile{'+extensions+'}', {nocase: true});
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
