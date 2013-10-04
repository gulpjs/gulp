/*jshint node:true */
/*global describe:false, it:false, beforeEach:false, afterEach:false, before:false, after:false */

"use strict";

var gulp = require('../');
var Q = require('q');
var should = require('should');
require('mocha');

describe('gulp tasks execute as expected', function() {
  // Don't bleed previous test into subsequent test
  var real_runStep;
  var hasRunStep = false;
  before(function () {
    real_runStep = gulp._runStep;
    gulp._runStep = function () {
      hasRunStep = true;
    };
  });
  after(function () {
    gulp._runStep = real_runStep;
  });
  beforeEach(function () {
    hasRunStep = false;
    gulp.reset();
  });
  afterEach(gulp.reset);
  describe('_runTask()', function() {
    it('calls task function', function(done) {
      var a, task;
      a = 0;
      task = {
        name: 'test',
        fn: function() {
          ++a;
        }
      };
      gulp._runTask(task);
      a.should.equal(1);
      done();
    });
    it('sets .running correctly', function(done) {
      var task;
      task = {
        name: 'test',
        fn: function() {
          should.exist(task.running);
          task.running.should.equal(true);
        }
      };
      gulp._runTask(task);
      should.exist(task.running);
      task.running.should.equal(false);
      done();
    });
    it('sync task sets done after calling function', function(done) {
      var task;
      task = {
        name: 'test',
        fn: function() {
          should.not.exist(task.done);
        }
      };
      gulp._runTask(task);
      should.exist(task.done);
      task.done.should.equal(true);
      hasRunStep.should.equal(false);
      done();
    });
    it('async task sets done after task resolves', function(done) {
      var task, timeout = 5;
      task = {
        name: 'test',
        fn: function() {
          var deferred = Q.defer();
          setTimeout(function () {
            should.not.exist(task.done);
            deferred.resolve();
          }, timeout);
          return deferred.promise;
        }
      };
      gulp._runTask(task);
      should.not.exist(task.done);
      setTimeout(function () {
        should.exist(task.done);
        task.done.should.equal(true);
        hasRunStep.should.equal(true);
        done();
      }, timeout*2);
    });
  });
});
