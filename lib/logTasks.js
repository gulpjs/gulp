'use strict';

var shimmer = require('shimmer');
var chalk = require('chalk');
var archy = require('archy');
var gutil = require('gulp-util');
var tildify = require('tildify');
var buildTree = require('./buildTree');

function logTasks(env) {
  function normalizeTaskName(arg){
    if(typeof arg === 'string'){
      return localGulp.get(arg);
    }

    if(typeof arg === 'function' && !arg.__label){
      arg.__label = arg.name || '<anonymous>';
      arg.__nodes = [];
      return arg;
    }

    return arg;
  }

  var localGulp = require(env.modulePath);
  var tree = {
    label: 'Tasks for ' + chalk.magenta(tildify(env.configPath)),
    nodes: []
  };
  shimmer.wrap(localGulp, 'series', function(original){
    return function(){
      var args = Array.prototype.slice.call(arguments);
      var nodes = args.map(normalizeTaskName);
      var fn = original.apply(this, arguments);
      fn.__label = 'series';
      fn.__nodes = nodes;
      return fn;
    };
  });
  shimmer.wrap(localGulp, 'parallel', function(original){
    return function(){
      var args = Array.prototype.slice.call(arguments);
      var nodes = args.map(normalizeTaskName);
      var fn = original.apply(this, arguments);
      fn.__label = 'parallel';
      fn.__nodes = nodes;
      return fn;
    };
  });
  shimmer.wrap(localGulp, 'set', function(original){
    return function(name, fn){
      var nodes = [];
      if(fn.__nodes){
        nodes = buildTree([], fn);
      }
      fn.__label = name;
      fn.__nodes = nodes;
      tree.nodes.push({
        label: name,
        nodes: nodes
      });
      return original.apply(this, arguments);
    };
  });
  require(env.configPath);
  archy(tree)
    .split('\n')
    .forEach(function (v) {
      if (v.trim().length === 0) {
        return;
      }
      gutil.log(v);
    });
}

module.exports = logTasks;
