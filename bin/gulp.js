#!/usr/bin/env node

var path = require('path');
var fs = require('fs');

var argv = require('optimist').argv;
var resolve = require('resolve');
var findup = require('findup-sync');
var gutil = require('gulp-util');

var tasks = argv._;
var cliPkg = require('../package.json');

var localBaseDir = process.cwd();

loadRequires(argv.require, localBaseDir);

var gulpFile = getGulpFile(localBaseDir);

if (!gulpFile) {
  gutil.log(gutil.colors.red('No Gulpfile found'));
  process.exit(1);
}

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
  gutil.log(gutil.colors.red('You need to npm install it first'));
  process.exit(1);
}

// Mix CLI flags into gulp
localGulp.env = gutil.env;

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
    extensions = Object.keys(require.extensions).join(",");
  } else {
    extensions = ['.js','.coffee'];
  }
  var gulpFile = findup("Gulpfile{"+extensions+"}", {nocase: true});
  return gulpFile;
}
