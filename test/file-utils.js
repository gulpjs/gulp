var gulp = require('../');
var should = require('should');
var path = require('path');
var join = path.join;
var dirname = path.dirname;
var semver = require('semver');
require('mocha');

describe('gulp bufferFile', function() {
  describe('bufferFile()', function() {
    it('should return a valid file', function(done) {
      var fname = join(__dirname, "./fixtures/test.coffee");
      var base = dirname(fname);
      gulp.bufferFile({path:fname,base:base}, function(err, file) {
        should.not.exist(err);
        should.exist(file);
        should.exist(file.path);
        should.exist(file.contents);
        should.exist(file.base);
        file.path.should.equal(fname);
        file.base.should.equal(base);
        String(file.contents).should.equal("this is a test");
        done();
      });
    });
  });
});

describe('gulp streamFile', function() {
  describe('streamFile()', function() {
    it('should return a valid file', function(done) {
      var fname = join(__dirname, "./fixtures/test.coffee");
      var base = dirname(fname);
      gulp.streamFile({path:fname,base:base}, function(err, file) {
        should.not.exist(err);
        should.exist(file);
        should.exist(file.path);
        should.exist(file.contents);
        should.exist(file.base);
        file.path.should.equal(fname);
        file.base.should.equal(base);

        var buf = "";
        file.contents.on('data', function(d){
          buf += d;
        });
        file.contents.on('end', function(){
          buf.should.equal("this is a test");
          done();
        });
        // >0.10 needs this stream fix
        if (semver.lt(process.versions.node, '0.10.0')) {
          file.contents.resume();
        }
      });
    });
  });
});

describe('gulp File class', function() {
  describe('File()', function() {
    it('should return a valid file', function(done) {
      var fname = join(__dirname, "./fixtures/test.coffee");
      var base = dirname(fname);
      var file = new gulp.File(base, fname);
      should.exist(file);
      should.exist(file.shortened);
      should.exist(file.path);
      should.exist(file.base);
      file.path.should.equal(fname);
      file.base.should.equal(base);
      file.shortened.should.equal("test.coffee");
      done();
    });
  });
});