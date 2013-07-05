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
      gulp.tasks.test.should.equal(fn);
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
      gulp.reset();
      done();
    });
  });
});
