'use strict';

var cp = require('child_process');
var path = require('path');

var expect = require('expect');

var gulp = require('../');

describe('gulp', function() {

  describe('hasOwnProperty', function() {
    it('src', function(done) {
      expect(Object.prototype.hasOwnProperty.call(gulp, 'src')).toEqual(true);
      done();
    });

    it('dest', function(done) {
      expect(Object.prototype.hasOwnProperty.call(gulp, 'dest')).toEqual(true);
      done();
    });

    it('symlink', function(done) {
      expect(Object.prototype.hasOwnProperty.call(gulp, 'symlink')).toEqual(true);
      done();
    });

    it('watch', function(done) {
      expect(Object.prototype.hasOwnProperty.call(gulp, 'watch')).toEqual(true);
      done();
    });

    it('task', function(done) {
      expect(Object.prototype.hasOwnProperty.call(gulp, 'task')).toEqual(true);
      done();
    });

    it('series', function(done) {
      expect(Object.prototype.hasOwnProperty.call(gulp, 'series')).toEqual(true);
      done();
    });

    it('parallel', function(done) {
      expect(Object.prototype.hasOwnProperty.call(gulp, 'parallel')).toEqual(true);
      done();
    });

    it('tree', function(done) {
      expect(Object.prototype.hasOwnProperty.call(gulp, 'tree')).toEqual(true);
      done();
    });

    it('lastRun', function(done) {
      expect(Object.prototype.hasOwnProperty.call(gulp, 'lastRun')).toEqual(true);
      done();
    });

    it('registry', function(done) {
      expect(Object.prototype.hasOwnProperty.call(gulp, 'registry')).toEqual(true);
      done();
    });
  });

  it('can run against gulpfile.cjs', function (done) {
    this.timeout(5000);

    var cli = path.join(__dirname, '../bin/gulp.js');
    var opts = { cwd: path.join(__dirname, 'fixtures/gulpfiles/cjs' ) };
    cp.exec('node ' + cli, opts, function (err, stdout, stderr) {
      expect(err).toBeNull();
      expect(stdout).toMatch('gulpfile.cjs');
      expect(stderr).toEqual('');
      done();
    });
  });
});
