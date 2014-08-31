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

function makeWrapper(fn, label, nodes) {
  var wrapper = function () {
    return fn.apply(this, arguments);
  };
  wrapper.__gulp = metadata(label, nodes);
  return wrapper;
}

function taskTree(localGulp) {
  var tree = {
    nodes: []
  };

  function normalizeTaskName(arg) {
    if(typeof arg === 'string'){
      return localGulp.get(arg);
    }

    if(typeof arg === 'function' && !arg.__gulp){
      return makeWrapper(arg, arg.name || '<anonymous>', []);
    }

    return arg;
  }

  function shimSeries(original) {
    return function () {
      var nodes = toArray(arguments).map(normalizeTaskName);
      var fn = original.apply(this, arguments);
      return makeWrapper(fn, 'series', nodes);
    };
  }

  function shimParallel(original) {
    return function () {
      var nodes = toArray(arguments).map(normalizeTaskName);
      var fn = original.apply(this, arguments);
      return makeWrapper(fn, 'parallel', nodes);
    };
  }

  function shimSet(original) {
    return function (name, fn) {
      var nodes = [];
      if(fn.__gulp){
        nodes = buildTree([], fn);
      }
      var wrapper = makeWrapper(fn, name, nodes);
      tree.nodes.push(wrapper.__gulp);
      return original.call(this, name, wrapper);
    };
  }

  shimmer.wrap(localGulp, 'series', shimSeries);
  shimmer.wrap(localGulp, 'parallel', shimParallel);
  shimmer.wrap(localGulp, 'set', shimSet);

  function getTree(){
    return tree;
  }

  return getTree;
}

module.exports = taskTree;
