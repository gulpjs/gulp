/*jshint node:true */
/*global describe:false, it:false, beforeEach:false, afterEach:false */

"use strict";

var gulp = require('../');
require('should');
require('mocha');

describe('gulp task is ready when dependencies are resolved', function() {
  // Don't bleed previous test into subsequent test
  beforeEach(gulp.reset);
  afterEach(gulp.reset);
  describe('_readyToRunTask()', function() {
    it('should be ready if no dependencies', function(done) {
      var task, expected, actual;
      expected = true;
      task = {
        name: 'a',
        dep: []
      };
      gulp.tasks = { a: task };

      actual = gulp._readyToRunTask(task);

      actual.should.equal(expected);
      done();
    });
    it('should be ready if dependency is done', function(done) {
      var task, dep, expected, actual;
      expected = true;
      task = {
        name: 'a',
        dep: ['b']
      };
      dep = {
        name: 'b',
        dep: [],
        done: true
      };
      gulp.tasks = { a: task, b: dep };

      actual = gulp._readyToRunTask(task);

      actual.should.equal(expected);
      done();
    });
    it('should not be ready if dependency is not done', function(done) {
      var task, dep, expected, actual;
      expected = false;
      task = {
        name: 'a',
        dep: ['b']
      };
      dep = {
        name: 'b',
        dep: []
        //done: lack of var is falsey
      };
      gulp.tasks = { a: task, b: dep };

      actual = gulp._readyToRunTask(task);

      actual.should.equal(expected);
      done();
    });
  });
});
