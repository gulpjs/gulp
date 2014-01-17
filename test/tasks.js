'use strict';

var gulp = require('../');
var Q = require('q');
var should = require('should');
require('mocha');

describe('gulp tasks', function() {
  describe('task()', function() {
    it('should define a task', function(done) {
      var fn;
      fn = function() {};
      gulp.task('test', fn);
      should.exist(gulp.tasks.test);
      gulp.tasks.test.fn.should.equal(fn);
      gulp.reset();
      done();
    });
  });
  describe('run()', function() {
    it('should run multiple tasks', function(done) {
      var a, fn, fn2;
      a = 0;
      fn = function() {
        this.should.equal(gulp);
        ++a;
      };
      fn2 = function() {
        this.should.equal(gulp);
        ++a;
      };
      gulp.task('test', fn);
      gulp.task('test2', fn2);
      gulp.run('test', 'test2');
      a.should.equal(2);
      gulp.reset();
      done();
    });
    it('should run all tasks when call run() multiple times', function(done) {
      var a, fn, fn2;
      a = 0;
      fn = function() {
        this.should.equal(gulp);
        ++a;
      };
      fn2 = function() {
        this.should.equal(gulp);
        ++a;
      };
      gulp.task('test', fn);
      gulp.task('test2', fn2);
      gulp.run('test');
      gulp.run('test2');
      a.should.equal(2);
      gulp.reset();
      done();
    });
    it('should run all async promise tasks', function(done) {
      var a, fn, fn2;
      a = 0;
      fn = function() {
        var deferred = Q.defer();
        setTimeout(function () {
          ++a;
          deferred.resolve();
        },1);
        return deferred.promise;
      };
      fn2 = function() {
        var deferred = Q.defer();
        setTimeout(function () {
          ++a;
          deferred.resolve();
        },1);
        return deferred.promise;
      };
      gulp.task('test', fn);
      gulp.task('test2', fn2);
      gulp.run('test');
      gulp.run('test2', function () {
        gulp.isRunning.should.equal(false);
        a.should.equal(2);
        gulp.reset();
        done();
      });
      gulp.isRunning.should.equal(true);
    });
    it('should run all async callback tasks', function(done) {
      var a, fn, fn2;
      a = 0;
      fn = function(cb) {
        setTimeout(function () {
          ++a;
          cb(null);
        },1);
      };
      fn2 = function(cb) {
        setTimeout(function () {
          ++a;
          cb(null);
        },1);
      };
      gulp.task('test', fn);
      gulp.task('test2', fn2);
      gulp.run('test');
      gulp.run('test2', function () {
        gulp.isRunning.should.equal(false);
        a.should.equal(2);
        gulp.reset();
        done();
      });
      gulp.isRunning.should.equal(true);
    });
    it('should emit task_not_found and throw an error when task is not defined', function(done) {
      gulp.on('task_not_found', function(err){
        should.exist(err);
        should.exist(err.task);
        err.task.should.equal('test');
        gulp.reset();
        done();
      });
      try {
        gulp.run('test');
      } catch (err) {
        should.exist(err);
      }
    });
    it('should run task scoped to gulp', function(done) {
      var a, fn;
      a = 0;
      fn = function() {
        this.should.equal(gulp);
        ++a;
      };
      gulp.task('test', fn);
      gulp.run('test');
      a.should.equal(1);
      gulp.isRunning.should.equal(false);
      gulp.reset();
      done();
    });
    it('should run default task scoped to gulp', function(done) {
      var a, fn;
      a = 0;
      fn = function() {
        this.should.equal(gulp);
        ++a;
      };
      gulp.task('default', fn);
      gulp.run();
      a.should.equal(1);
      gulp.isRunning.should.equal(false);
      gulp.reset();
      done();
    });
  });
});
