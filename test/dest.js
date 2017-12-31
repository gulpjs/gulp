'use strict';

var fs = require('fs');
var path = require('path');

var expect = require('expect');
var rimraf = require('rimraf');

var gulp = require('../');

var outpath = path.join(__dirname, './out-fixtures');

describe('gulp.dest()', function() {
  beforeEach(rimraf.bind(null, outpath));
  afterEach(rimraf.bind(null, outpath));

  it('should return a stream', function(done) {
    var stream = gulp.dest(path.join(__dirname, './fixtures/'));
    expect(stream).toExist();
    expect(stream.on).toExist();
    done();
  });

  it('should return a output stream that writes files', function(done) {
    var instream = gulp.src('./fixtures/**/*.txt', { cwd: __dirname });
    var outstream = gulp.dest(outpath);
    instream.pipe(outstream);

    outstream.on('error', done);
    outstream.on('data', function(file) {
      // Data should be re-emitted right
      expect(file).toExist();
      expect(file.path).toExist();
      expect(file.contents).toExist();
      expect(file.path).toEqual(path.join(outpath, './copy/example.txt'));
      expect(file.contents).toEqual('this is a test');
    });
    outstream.on('end', function() {
      fs.readFile(path.join(outpath, 'copy', 'example.txt'), function(err, contents) {
        expect(err).toNotExist();
        expect(contents).toExist();
        expect(contents).toEqual('this is a test');
        done();
      });
    });
  });

  it('should return a output stream that does not write non-read files', function(done) {
    var instream = gulp.src('./fixtures/**/*.txt', { read: false, cwd: __dirname });
    var outstream = gulp.dest(outpath);
    instream.pipe(outstream);

    outstream.on('error', done);
    outstream.on('data', function(file) {
      // Data should be re-emitted right
      expect(file).toExist();
      expect(file.path).toExist();
      expect(file.contents).toNotExist();
      expect(file.path).toEqual(path.join(outpath, './copy/example.txt'));
    });
    outstream.on('end', function() {
      fs.readFile(path.join(outpath, 'copy', 'example.txt'), function(err, contents) {
        expect(err).toExist();
        expect(contents).toNotExist();
        done();
      });
    });
  });

  it('should return a output stream that writes streaming files', function(done) {
    var instream = gulp.src('./fixtures/**/*.txt', { buffer: false, cwd: __dirname });
    var outstream = instream.pipe(gulp.dest(outpath));

    outstream.on('error', done);
    outstream.on('data', function(file) {
      // Data should be re-emitted right
      expect(file).toExist();
      expect(file.path).toExist();
      expect(file.contents).toExist();
      expect(file.path).toEqual(path.join(outpath, './copy/example.txt'));
    });
    outstream.on('end', function() {
      fs.readFile(path.join(outpath, 'copy', 'example.txt'), function(err, contents) {
        expect(err).toNotExist();
        expect(contents).toExist();
        expect(contents).toEqual('this is a test');
        done();
      });
    });
  });

  it('should return a output stream that writes streaming files into new directories', function(done) {
    testWriteDir({ cwd: __dirname }, done);
  });

  it('should return a output stream that writes streaming files into new directories (buffer: false)', function(done) {
    testWriteDir({ buffer: false, cwd: __dirname }, done);
  });

  it('should return a output stream that writes streaming files into new directories (read: false)', function(done) {
    testWriteDir({ read: false, cwd: __dirname }, done);
  });

  it('should return a output stream that writes streaming files into new directories (read: false, buffer: false)', function(done) {
    testWriteDir({ buffer: false, read: false, cwd: __dirname }, done);
  });

  function testWriteDir(srcOptions, done) {
    var instream = gulp.src('./fixtures/stuff', srcOptions);
    var outstream = instream.pipe(gulp.dest(outpath));

    outstream.on('error', done);
    outstream.on('data', function(file) {
      // Data should be re-emitted right
      expect(file).toExist();
      expect(file.path).toExist();
      expect(file.path).toEqual(path.join(outpath, './stuff'));
    });
    outstream.on('end', function() {
      fs.exists(path.join(outpath, 'stuff'), function(exists) {
        expect(exists).toExist();
        done();
      });
    });
  }

});
