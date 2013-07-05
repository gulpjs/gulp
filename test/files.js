var gulp = require('../');
var should = require('should');
var join = require('path').join;
require('mocha');

describe('gulp file collection', function() {
  describe('files()', function() {
    it('should return a stream', function(done) {
      var stream;
      stream = gulp.files(join(__dirname, "./fixtures/*.coffee"));
      should.exist(stream);
      should.exist(stream.on);
      done();
    });
    it('should return a files stream from a flat glob', function(done) {
      var stream;
      stream = gulp.files(join(__dirname, "./fixtures/*.coffee"));
      stream.on('error', done);
      stream.on('data', function(file) {
        should.exist(file);
        should.exist(file.path);
        should.exist(file.contents);
        file.path.should.equal(join(__dirname, "./fixtures/test.coffee"));
        String(file.contents).should.equal("this is a test");
      });
      stream.on('end', function() {
        done();
      });
    });
    it('should return a files stream from a deep glob', function(done) {
      var stream;
      stream = gulp.files(join(__dirname, "./fixtures/**/*.jade"));
      stream.on('error', done);
      stream.on('data', function(file) {
        should.exist(file);
        should.exist(file.path);
        should.exist(file.contents);
        file.path.should.equal(join(__dirname, "./fixtures/test/run.jade"));
        String(file.contents).should.equal("test template");
      });
      stream.on('end', function() {
        done();
      });
    });
    it('should return a files stream from a deeper glob', function(done) {
      var a, stream;
      stream = gulp.files(join(__dirname, "./fixtures/**/*.dmc"));
      a = 0;
      stream.on('error', done);
      stream.on('data', function(file) {
        ++a;
      });
      stream.on('end', function() {
        a.should.equal(2);
        done();
      });
    });
  });
});
