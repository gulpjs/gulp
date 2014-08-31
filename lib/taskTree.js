'use strict';

var shimmer = require('shimmer');
var buildTree = require('./buildTree');

function toArray(args) {
  return Array.prototype.slice.call(args);
}

function metadata(label, nodes){
  return {
    label: label,
    nodes: nodes
  };
}

function taskTree(env) {
  var localGulp = require(env.modulePath);
  var tree = {
    nodes: []
  };

  function normalizeTaskName(arg) {
    if(typeof arg === 'string'){
      return localGulp.get(arg);
    }

    if(typeof arg === 'function' && !arg.__gulp){
      arg.__gulp = metadata(arg.name || '<anonymous>', []);
      return arg;
    }

    return arg;
  }

  function shimSeries(original) {
    return function () {
      var nodes = toArray(arguments).map(normalizeTaskName);
      var fn = original.apply(this, arguments);
      fn.__gulp = metadata('series', nodes);
      return fn;
    };
  }

  function shimParallel(original) {
    return function () {
      var nodes = toArray(arguments).map(normalizeTaskName);
      var fn = original.apply(this, arguments);
      fn.__gulp = metadata('parallel', nodes);
      return fn;
    };
  }

  function shimSet(original) {
    return function (name, fn) {
      var nodes = [];
      if(fn.__gulp){
        nodes = buildTree([], fn);
      }
      fn.__gulp = metadata(name, nodes);
      tree.nodes.push(fn.__gulp);
      return original.apply(this, arguments);
    };
  }

  shimmer.wrap(localGulp, 'series', shimSeries);
  shimmer.wrap(localGulp, 'parallel', shimParallel);
  shimmer.wrap(localGulp, 'set', shimSet);
  require(env.configPath);

  return tree;
}

module.exports = taskTree;
