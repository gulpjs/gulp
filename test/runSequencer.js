/*jshint node:true */
/*global describe:false, it:false */

"use strict";

var gulp = require('../');
var should = require('should');
require('mocha');

describe('gulp task sequencing', function() {
  describe('_runSequencer()', function() {

    var dependencyTree = {
      a: [],
      b: ['a'],
      c: ['a'],
      d: ['b','c'],
      e: ['f'],
      f: ['e'],
      g: ['g']
    };

    var makeTasks = function (tree) {
      var noop = function () {};
      var tasks = {}, p;
      for (p in tree) {
        if (tree.hasOwnProperty(p)) {
          tasks[p] = {
            name: p,
            dep: tree[p],
            fn: noop
          };
        }
      }
      return tasks;
    };

    var theTest = function (source,expected) {
      var tasks = makeTasks(dependencyTree);
      var actual = [];
      gulp._runSequencer(tasks, source.split(','), actual, []);
      actual.join(',').should.equal(expected);
    };

    it('a -> a', function() {
      theTest('a', 'a');
    });
    it('a,a -> a', function() {
      theTest('a,a', 'a');
    });
    it('c -> a,c', function() {
      theTest('c', 'a,c');
    });
    it('b -> a,b', function() {
      theTest('b', 'a,b');
    });
    it('c,b -> a,c,b', function() {
      theTest('c,b', 'a,c,b');
    });
    it('b,c -> a,b,c', function() {
      theTest('b,c', 'a,b,c');
    });
    it('b,a -> a,b', function() {
      theTest('b,a', 'a,b');
    });
    it('d -> a,b,c,d', function() {
      theTest('d', 'a,b,c,d');
    });
    it('c,d -> a,c,b,d', function() {
      theTest('c,d', 'a,c,b,d');
    });
    it('b,d -> a,b,c,d', function() {
      theTest('b,d', 'a,b,c,d');
    });
    it('e -> throw', function() {
      var failed = false;
      try {
        theTest('e', 'throw');
        failed = true;
      } catch (err) {
        should.exist(err);
        err.message.should.match(/recursive/i, err.message+' should include recursive');
      }
      failed.should.equal(false);
    });
    it('g -> throw', function() {
      var failed = false;
      try {
        theTest('g', 'throw');
        failed = true;
      } catch (err) {
        should.exist(err);
        err.message.should.match(/recursive/i, err.message+' should include recursive');
      }
      failed.should.equal(false);
    });

  });
});
