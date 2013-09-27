var gulp = require('../');
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
      gulp.run('test', 'test2', function () {
        a.should.equal(2);
        gulp.isRunning.should.equal(false);
        gulp.reset();
        done();
      });
      gulp.isRunning.should.equal(true);
    });
    it('should run task scoped to gulp', function(done) {
      var a, fn;
      a = 0;
      fn = function() {
        this.should.equal(gulp);
        ++a;
      };
      gulp.task('test', fn);
      gulp.run('test', function () {
        a.should.equal(1);
        gulp.isRunning.should.equal(false);
        gulp.reset();
        done();
      });
      gulp.isRunning.should.equal(true);
    });
    it('should run default task scoped to gulp', function(done) {
      var a, fn;
      a = 0;
      fn = function() {
        this.should.equal(gulp);
        ++a;
      };
      gulp.task('default', fn);
      gulp.run(function () {
        a.should.equal(1);
        gulp.isRunning.should.equal(false);
        gulp.reset();
        done();
      });
      gulp.isRunning.should.equal(true);
    });
  });
});
