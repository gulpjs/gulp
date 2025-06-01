'use strict';

var path = require('path');

var expect = require('expect');

var gulp = require('../');

describe('gulp.src()', function() {
  before(function () {
    if (process.versions.node.startsWith("10.")) {
      this.skip();
      return;
    }
  });

  it('should return a stream', function(done) {
    var stream = gulp.src('./fixtures/*.coffee', { cwd: __dirname });
    expect(stream).toBeDefined();
    expect(stream.on).toBeDefined();
    done();
  });

  it('should return a input stream from a flat glob', function(done) {
    var stream = gulp.src('./fixtures/*.coffee', { cwd: __dirname });
    stream.on('error', done);
    stream.on('data', function(file) {
      expect(file).toBeDefined();
      expect(file.path).toBeDefined();
      expect(file.contents).toBeDefined();
      expect(file.path).toEqual(path.join(__dirname, './fixtures/test.coffee'));
      expect(file.contents).toEqual(Buffer.from('this is a test'));
    });
    stream.on('end', function() {
      done();
    });
  });

  it('should return a input stream for multiple globs', function(done) {
    var globArray = [
      './fixtures/stuff/run.dmc',
      './fixtures/stuff/test.dmc',
    ];
    var stream = gulp.src(globArray, { cwd: __dirname });

    var files = [];
    stream.on('error', done);
    stream.on('data', function(file) {
      expect(file).toBeDefined();
      expect(file.path).toBeDefined();
      files.push(file);
    });
    stream.on('end', function() {
      expect(files.length).toEqual(2);
      expect(files[0].path).toEqual(path.join(__dirname, globArray[0]));
      expect(files[1].path).toEqual(path.join(__dirname, globArray[1]));
      done();
    });
  });

  it('should return a input stream for multiple globs, with negation', function(done) {
    var expectedPath = path.join(__dirname, './fixtures/stuff/run.dmc');
    var globArray = [
      './fixtures/stuff/*.dmc',
      '!fixtures/stuff/test.dmc',
    ];
    var stream = gulp.src(globArray, { cwd: __dirname });

    var files = [];
    stream.on('error', done);
    stream.on('data', function(file) {
      expect(file).toBeDefined();
      expect(file.path).toBeDefined();
      files.push(file);
    });
    stream.on('end', function() {
      expect(files.length).toEqual(1);
      expect(files[0].path).toEqual(expectedPath);
      done();
    });
  });

  it('should return a input stream with no contents when read is false', function(done) {
    var stream = gulp.src('./fixtures/*.coffee', { read: false, cwd: __dirname });
    stream.on('error', done);
    stream.on('data', function(file) {
      expect(file).toBeDefined();
      expect(file.path).toBeDefined();
      expect(file.contents).toBeNull();
      expect(file.path).toEqual(path.join(__dirname, './fixtures/test.coffee'));
    });
    stream.on('end', function() {
      done();
    });
  });

  it('should return a input stream with contents as stream when buffer is false', function(done) {
    var stream = gulp.src('./fixtures/*.coffee', { buffer: false, cwd: __dirname });
    stream.on('error', done);
    stream.on('data', function(file) {
      expect(file).toBeDefined();
      expect(file.path).toBeDefined();
      expect(file.contents).toBeDefined();
      var buf = '';
      file.contents.on('data', function(d) {
        buf += d;
      });
      file.contents.on('end', function() {
        expect(buf).toEqual('this is a test');
        done();
      });
      expect(file.path).toEqual(path.join(__dirname, './fixtures/test.coffee'));
    });
  });

  it('should return a input stream from a deep glob', function(done) {
    var stream = gulp.src('./fixtures/**/*.jade', { cwd: __dirname });
    stream.on('error', done);
    stream.on('data', function(file) {
      expect(file).toBeDefined();
      expect(file.path).toBeDefined();
      expect(file.contents).toBeDefined();
      expect(file.path).toEqual(path.join(__dirname, './fixtures/test/run.jade'));
      expect(file.contents).toEqual(Buffer.from('test template'));
    });
    stream.on('end', function() {
      done();
    });
  });

  it('should return a input stream from a deeper glob', function(done) {
    var stream = gulp.src('./fixtures/**/*.dmc', { cwd: __dirname });
    var a = 0;
    stream.on('error', done);
    stream.on('data', function() {
      ++a;
    });
    stream.on('end', function() {
      expect(a).toEqual(2);
      done();
    });
  });

  it('should return a file stream from a flat path', function(done) {
    var a = 0;
    var stream = gulp.src(path.join(__dirname, './fixtures/test.coffee'));
    stream.on('error', done);
    stream.on('data', function(file) {
      ++a;
      expect(file).toBeDefined();
      expect(file.path).toBeDefined();
      expect(file.contents).toBeDefined();
      expect(file.path).toEqual(path.join(__dirname, './fixtures/test.coffee'));
      expect(file.contents).toEqual(Buffer.from('this is a test'));
    });
    stream.on('end', function() {
      expect(a).toEqual(1);
      done();
    });
  });
});
