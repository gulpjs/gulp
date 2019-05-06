'use strict';

var expect = require('expect');

var gulp = require('../');

describe('gulp', function() {

  describe('hasOwnProperty', function() {
    it('src', function(done) {
      expect(gulp.hasOwnProperty('src')).toEqual(true);
      done();
    });

    it('dest', function(done) {
      expect(gulp.hasOwnProperty('dest')).toEqual(true);
      done();
    });

    it('symlink', function(done) {
      expect(gulp.hasOwnProperty('symlink')).toEqual(true);
      done();
    });

    it('watch', function(done) {
      expect(gulp.hasOwnProperty('watch')).toEqual(true);
      done();
    });

    it('task', function(done) {
      expect(gulp.hasOwnProperty('task')).toEqual(true);
      done();
    });

    it('series', function(done) {
      expect(gulp.hasOwnProperty('series')).toEqual(true);
      done();
    });

    it('parallel', function(done) {
      expect(gulp.hasOwnProperty('parallel')).toEqual(true);
      done();
    });

    it('tree', function(done) {
      expect(gulp.hasOwnProperty('tree')).toEqual(true);
      done();
    });

    it('lastRun', function(done) {
      expect(gulp.hasOwnProperty('lastRun')).toEqual(true);
      done();
    });

    it('registry', function(done) {
      expect(gulp.hasOwnProperty('registry')).toEqual(true);
      done();
    });
  });
});
