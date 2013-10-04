/*jshint node:true */
/*global describe:false, it:false, beforeEach:false, afterEach:false */

"use strict";

var gulp = require('../');
var Q = require('q');
require('should');
require('mocha');

describe('gulp task dependencies', function() {
  // Don't bleed previous test into subsequent test
  beforeEach(gulp.reset);
  afterEach(gulp.reset);
  describe('run()', function() {
    // Technically these are duplicated from test/runSequencer.js,
    // but those are unit tests and these are integration tests
    it('should run tasks in specified order if no dependencies', function(done) {
      var a, fn, fn2;
      a = 0;
      fn = function() {
        a.should.equal(0);
        ++a;
      };
      fn2 = function() {
        a.should.equal(1);
        ++a;
      };
      gulp.task('test1', fn);
      gulp.task('test2', fn2);
      gulp.run('test1', 'test2', function () {
        a.should.equal(2);
        done();
      });
    });
    it('should run dependency then specified task', function(done) {
      var a, fn, fn2;
        gulp.reset();
      a = 0;
      fn = function() {
        a.should.equal(0);
        ++a;
      };
      fn2 = function() {
        a.should.equal(1);
        ++a;
      };
      gulp.task('dep', fn);
      gulp.task('test', ['dep'], fn2);
      gulp.run('test');
      a.should.equal(2);
      done();
    });
    it('should run asynchronous dependency then specified task', function(done) {
      var a, fn, fn2;
      a = 0;
      fn = function() {
        var deferred = Q.defer();
        setTimeout(function () {
          a.should.equal(0);
          ++a;
          deferred.resolve();
        },1);
        return deferred.promise;
      };
      fn2 = function() {
        var deferred = Q.defer();
        setTimeout(function () {
          a.should.equal(1);
          ++a;
          deferred.resolve();
        },1);
        return deferred.promise;
      };
      gulp.task('dep', fn);
      gulp.task('test', ['dep'], fn2);
      gulp.run('test', function () {
        gulp.isRunning.should.equal(false);
        a.should.equal(2);
        done();
      });
      gulp.isRunning.should.equal(true);
    });
    it('should run all tasks of complex dependency chain', function(done) {
      var a, fn1, fn2, fn3, fn4, timeout = 2;
      a = 0;
      // fn1 is a long-running task, fn2 and 3 run quickly, fn4 is synchronous
      // If shorter tasks mark it done before the longer task finishes that's wrong
      fn1 = function() {
        var deferred = Q.defer();
        setTimeout(function () {
          ++a;
          deferred.resolve();
        }, timeout*5);
        return deferred.promise;
      };
      fn2 = function() {
        var deferred = Q.defer();
        setTimeout(function () {
          ++a;
          deferred.resolve();
        }, timeout);
        return deferred.promise;
      };
      fn3 = function() {
        var deferred = Q.defer();
        setTimeout(function () {
          ++a;
          deferred.resolve();
        }, timeout);
        return deferred.promise;
      };
      fn4 = function() {
        ++a;
      };
      gulp.task('fn1', fn1);
      gulp.task('fn2', fn2);
      gulp.task('fn3', ['fn1', 'fn2'], fn3);
      gulp.task('fn4', ['fn3'], fn4);
      gulp.run('fn4', function () {
        gulp.isRunning.should.equal(false);
        a.should.equal(4);
        done();
      });
      gulp.isRunning.should.equal(true);
    });
  });
});
