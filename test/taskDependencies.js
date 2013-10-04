/*jshint node:true */
/*global describe:false, it:false, beforeEach:false */

"use strict";

var gulp = require('../');
var Q = require('q');
require('should');
require('mocha');

describe('gulp task dependencies', function() {
  beforeEach(function () {
    gulp.reset(); // Don't bleed previous test into subsequent test
  });
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
  });
});
