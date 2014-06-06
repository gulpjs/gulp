#!/usr/bin/env node

'use strict';
var gutil = require('gulp-util');
var prettyTime = require('pretty-hrtime');
var chalk = require('chalk');
var semver = require('semver');
var archy = require('archy');
var Liftoff = require('liftoff');
var tildify = require('tildify');
var interpret = require('interpret');
var completion = require('../lib/completion');
var argv = gutil.env;
var taskTree = require('../lib/taskTree');

var cli = new Liftoff({
  name: 'gulp',
  completions: completion,
  extensions: interpret.jsVariants
});

// parse those args m8
var cliPackage = require('../package');
var versionFlag = argv.v || argv.version;
var tasksFlag = argv.T || argv.tasks;
var tasks = argv._;
var toRun = tasks.length ? tasks : ['default'];

// this is a hold-over until we have a better logging system
// with log levels
var simpleTasksFlag = argv['tasks-simple'];
var shouldLog = !argv.silent && !simpleTasksFlag;

// wire up a few err listeners to liftoff
cli.on('require', function (name) {
  if (!shouldLog) {
    return;
  }
  gutil.log('Requiring external module', chalk.magenta(name));
});

cli.on('requireFail', function (name) {
  gutil.log(chalk.red('Failed to load external module'), chalk.magenta(name));
});

cli.launch({
  cwd: argv.cwd,
  configPath: argv.gulpfile,
  require: argv.require,
  completion: argv.completion
}, handleArguments);

// the actual logic
function handleArguments(env) {
  if (versionFlag) {
    gutil.log('CLI version', cliPackage.version);
    if (env.modulePackage) {
      gutil.log('Local version', env.modulePackage.version);
    }
    process.exit(0);
  }

  if (!env.modulePath) {
    gutil.log(
      chalk.red('Local gulp not found in'),
      chalk.magenta(tildify(env.cwd))
    );
    gutil.log(chalk.red('Try running: npm install gulp'));
    process.exit(1);
  }

  if (!env.configPath) {
    gutil.log(chalk.red('No gulpfile found'));
    process.exit(1);
  }

  // check for semver difference between cli and local installation
  if (semver.gt(cliPackage.version, env.modulePackage.version) && shouldLog) {
    gutil.log(chalk.red('Warning: gulp version mismatch:'));
    gutil.log(chalk.red('Global gulp is', cliPackage.version));
    gutil.log(chalk.red('Local gulp is', env.modulePackage.version));
  }

  // chdir before requiring gulpfile to make sure
  // we let them chdir as needed
  if (process.cwd() !== env.cwd) {
    process.chdir(env.cwd);
    if (shouldLog) {
      gutil.log(
        'Working directory changed to',
        chalk.magenta(tildify(env.cwd))
      );
    }
  }

  // this is what actually loads up the gulpfile
  require(env.configPath);

  if (shouldLog) {
    gutil.log('Using gulpfile', chalk.magenta(tildify(env.configPath)));
  }

  var gulpInst = require(env.modulePath);
  logEvents(gulpInst);

  process.nextTick(function () {
    if (simpleTasksFlag) {
      return logTasksSimple(env, gulpInst);
    }
    if (tasksFlag) {
      return logTasks(env, gulpInst);
    }
    gulpInst.start.apply(gulpInst, toRun);
  });
}

function logTasks(env, localGulp) {
  var tree = taskTree(localGulp.tasks);
  tree.label = 'Tasks for ' + chalk.magenta(tildify(env.configPath));
  archy(tree)
    .split('\n')
    .forEach(function (v) {
      if (v.trim().length === 0) {
        return;
      }
      gutil.log(v);
    });
}

function logTasksSimple(env, localGulp) {
  console.log(Object.keys(localGulp.tasks)
    .join('\n')
    .trim());
}

// format orchestrator errors
function formatError(e) {
  if (!e.err) {
    return e.message;
  }
  if (e.err.message) {
    return e.err.message;
  }
  return JSON.stringify(e.err);
}

// wire up logging events
function logEvents(gulpInst) {

  // total hack due to fucked up error management in orchestrator
  gulpInst.on('err', function () {});

  gulpInst.on('task_start', function (e) {
    // TODO: batch these
    // so when 5 tasks start at once it only logs one time with all 5
    gutil.log('Starting', '\'' + chalk.cyan(e.task) + '\'...');
  });

  gulpInst.on('task_stop', function (e) {
    var time = prettyTime(e.hrDuration);
    gutil.log(
      'Finished', '\'' + chalk.cyan(e.task) + '\'',
      'after', chalk.magenta(time)
    );
  });

  gulpInst.on('task_err', function (e) {
    var msg = formatError(e);
    var time = prettyTime(e.hrDuration);
    gutil.log(
      '\'' + chalk.cyan(e.task) + '\'',
      'errored after',
      chalk.magenta(time),
      chalk.red(msg)
    );
  });

  gulpInst.on('task_not_found', function (err) {
    gutil.log(
      chalk.red('Task \'' + err.task + '\' is not in your gulpfile')
    );
    gutil.log('Please check the documentation for proper gulpfile formatting');
    process.exit(1);
  });
}
