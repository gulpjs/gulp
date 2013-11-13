#!/usr/bin/env node

var path = require('path');
var fs = require('fs');

var argv = require('optimist').argv;
var chalk = require('chalk');
var resolve = require('resolve');
var findup = require('findup-sync');

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
  process.exit(0);
}

if (!localGulp) {
  cliGulp.log(chalk.red('No local gulp install found in'), getLocalBase(gulpFile));
  cliGulp.log(chalk.red('You need to npm install it first'));
  process.exit(1);
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
  var gulpFileCwd = path.dirname(gulpFile);
  process.chdir(gulpFileCwd);
  cliGulp.log('Working directory changed to', chalk.magenta(gulpFileCwd));

  var theGulpfile = require(gulpFile);
  // just for good measure
  process.nextTick(function(){
    localGulp.run.apply(localGulp, tasks);
  });
  return theGulpfile;
}

function getGulpFile(baseDir) {
  var extensions = Object.keys(require.extensions).join(",");
  console.log("Gulpfile{"+extensions+"}", process.cwd());
  var gulpFile = findup("Gulpfile{"+extensions+"}", {nocase: true});
  return gulpFile;
}