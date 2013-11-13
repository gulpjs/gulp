#!/usr/bin/env node

var path = require('path');
var fs = require('fs');

var argv = require('optimist').argv;
var chalk = require('chalk');
var resolve = require('resolve');

var tasks = argv._;
var gulpFile = getGulpFile(process.cwd());
var cliPkg = require('../package.json');
var cliGulp = require('../');

if (!gulpFile) {
  cliGulp.log(chalk.red('No Gulpfile found'));
  process.exit(1);
}

// find the local gulp
var localGulp = findLocalGulp(gulpFile);
var localPkg = findLocalGulpPackage(gulpFile);

// print some versions and shit
if (argv.v || argv.version) {
  cliGulp.log('CLI version', cliPkg.version);
  if (localGulp) {
    cliGulp.log('Local version', localPkg.version);
  }
  return;
}

if (!localGulp) {
  cliGulp.log(chalk.red('No local gulp install found in'), getLocalBase(gulpFile));
  cliGulp.log(chalk.red('You need to npm install it first'));
  return;
}

// Mix CLI flags into gulp
localGulp.env = argv;

// Load their gulpfile and run it
cliGulp.log('Using file', chalk.magenta(gulpFile));
loadGulpFile(localGulp, gulpFile, tasks);

function getLocalBase(gulpFile) {
  return path.resolve(path.dirname(gulpFile));
}

function findLocalGulp(gulpFile){
  var localBase = getLocalBase(gulpFile);
  try {
    return require(resolve.sync('gulp', {basedir: localBase}));
  } catch(e) {}
  return;
}

function findLocalGulpPackage(gulpFile){
  var localBase = getLocalBase(gulpFile);
  var packageBase;
  try {
    packageBase = path.dirname(resolve.sync('gulp', {basedir: localBase}));
    return require(path.join(packageBase, 'package.json'));
  } catch(e) {}
  return;
}

function loadGulpFile(localGulp, gulpFile, tasks){
  var theGulpfile = require(gulpFile);
  // just for good measure
  process.nextTick(function(){
    localGulp.run.apply(localGulp, tasks);
  });
  return theGulpfile;
}

function getGulpFile(baseDir) {
  var extensions = Object.keys(require.extensions);
  var Gulpfiles = extensions.map(function(ext){
    return path.join(baseDir, "Gulpfile" + ext);
  });

  var gulpFiles = extensions.map(function(ext){
    return path.join(baseDir, "gulpfile" + ext);
  });

  return gulpFiles.concat(Gulpfiles)
    .filter(fs.existsSync)[0];
}
