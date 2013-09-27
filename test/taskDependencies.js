/*jshint node:true */
/*global describe:false, it:false */

"use strict";

var gulp = require('../');
var should = require('should');
require('mocha');

describe('gulp task dependencies', function() {
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
        gulp.reset();
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
      gulp.run('test', function () {
        a.should.equal(2);
        gulp.reset();
        done();
      });
    });
  });
});
