/*jshint node:true */
/*global describe:false, it:false, beforeEach:false */
"use strict";

var gulp = require('../');
var should = require('should');
require('mocha');

describe('gulp tasks', function() {
  beforeEach(function () {
    gulp.reset(); // Don't bleed previous test into subsequent test
  });
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
