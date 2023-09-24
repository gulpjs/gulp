'use strict';

var expect = require('expect');

var os = require('os');
var fs = require('fs');
var path = require('path');
var vinyl = require('vinyl-fs');
var jshint = require('gulp-jshint');
var spawn = require('child_process').spawn;
var once = require('once');
var aOnce = require('async-once');
var del = require('del');
var through = require('through2');

var Undertaker = require('../');

var isWindows = (os.platform() === 'win32');

function cleanup() {
  return del([
    path.join(__dirname, './fixtures/out/'),
    path.join(__dirname, './fixtures/tmp/'),
  ]);
}

function noop() { }

describe('integrations', function() {

  var taker;

  beforeEach(function(done) {
    taker = new Undertaker();
    done();
  });

  beforeEach(cleanup);
  afterEach(cleanup);

  it('should handle vinyl streams', function(done) {
    taker.task('test', function() {
      return vinyl.src('./fixtures/test.js', { cwd: __dirname })
        .pipe(vinyl.dest('./fixtures/out', { cwd: __dirname }));
    });

    taker.parallel('test')(done);
  });

  it('should exhaust vinyl streams', function(done) {
    taker.task('test', function() {
      return vinyl.src('./fixtures/test.js', { cwd: __dirname });
    });

    taker.parallel('test')(done);
  });

  it('should lints all piped files', function(done) {
    taker.task('test', function() {
      return vinyl.src('./fixtures/test.js', { cwd: __dirname })
        .pipe(jshint());
    });

    taker.parallel('test')(done);
  });

  it('should handle a child process return', function(done) {
    taker.task('test', function() {
      if (isWindows) {
        return spawn('cmd', ['/c', 'dir']).on('error', noop);
      }

      return spawn('ls', ['-lh', __dirname]);
    });

    taker.parallel('test')(done);
  });

  it('should run dependencies once', function(done) {
    var count = 0;

    taker.task('clean', once(function() {
      count++;
      return del(['./fixtures/some-build.txt'], { cwd: __dirname });
    }));

    taker.task('build-this', taker.series('clean', function(cb) {
      cb();
    }));
    taker.task('build-that', taker.series('clean', function(cb) {
      cb();
    }));
    taker.task('build', taker.series(
      'clean',
      taker.parallel(['build-this', 'build-that'])
    ));

    taker.parallel('build')(function(err) {
      expect(count).toEqual(1);
      done(err);
    });
  });

  it('should run dependencies once', function(done) {
    var count = 0;

    taker.task('clean', aOnce(function(cb) {
      cb();
      count++;
      del(['./fixtures/some-build.txt'], { cwd: __dirname }, cb);
    }));

    taker.task('build-this', taker.series('clean', function(cb) {
      cb();
    }));
    taker.task('build-that', taker.series('clean', function(cb) {
      cb();
    }));
    taker.task('build', taker.series(
      'clean',
      taker.parallel(['build-this', 'build-that'])
    ));

    taker.parallel('build')(function(err) {
      expect(count).toEqual(1);
      done(err);
    });
  });

  it('can use lastRun with vinyl.src `since` option', function(done) {
    this.timeout(5000);

    var count = 0;

    function setup() {
      return vinyl.src('./fixtures/test*.js', { cwd: __dirname })
        .pipe(vinyl.dest('./fixtures/tmp', { cwd: __dirname }));
    }

    function delay(cb) {
      setTimeout(cb, 2000);
    }

    // Some built
    taker.task('build', function() {
      return vinyl.src('./fixtures/tmp/*.js', { cwd: __dirname })
        .pipe(vinyl.dest('./fixtures/out', { cwd: __dirname }));
    });

    function userEdit(cb) {
      fs.appendFile(path.join(__dirname, './fixtures/tmp/testMore.js'), ' ', cb);
    }

    function countEditedFiles() {
      return vinyl.src('./fixtures/tmp/*.js', { cwd: __dirname, since: taker.lastRun('build') })
        .pipe(through.obj(function(file, enc, cb) {
          count++;
          cb();
        }));
    }

    taker.series(setup, delay, 'build', delay, userEdit, countEditedFiles)(function(err) {
      expect(count).toEqual(1);
      done(err);
    });
  });
});
