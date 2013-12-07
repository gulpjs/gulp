var gulp = require('../');
var should = require('should');
var path = require('path');
var join = path.join;
var dirname = path.dirname;
var semver = require('semver');
require('mocha');

var bufferFile = require('../lib/createInputStream/bufferFile');
var streamFile = require('../lib/createInputStream/streamFile');

describe('gulp bufferFile', function() {
  describe('bufferFile()', function() {
    it('should return a valid file', function(done) {
      var fname = join(__dirname, "./fixtures/test.coffee");
      var base = join(__dirname, "./fixtures/");
      var file = new gulp.File({
        base: base,
        cwd: __dirname,
        path: fname
      });
      bufferFile(file, function(err, file) {
        should.not.exist(err);
        should.exist(file);
        should.exist(file.path);
        should.exist(file.contents);
        should.exist(file.base);
        should.exist(file.cwd);
        should.exist(file.contents, 'contents');
        file.cwd.should.equal(__dirname);
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
      var base = join(__dirname, "./fixtures/");
      var file = new gulp.File({
        base: base,
        cwd: __dirname,
        path: fname
      });
      streamFile(file, function(err, file) {
        should.not.exist(err);
        should.exist(file, 'root');
        should.exist(file.relative, 'relative');
        should.exist(file.path, 'path');
        should.exist(file.cwd, 'cwd');
        should.exist(file.base, 'base');
        should.exist(file.contents, 'contents');
        file.cwd.should.equal(__dirname);
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
      var base = join(__dirname, "./fixtures/");
      var file = new gulp.File({
        base: base,
        cwd: __dirname,
        path: fname
      });
      should.exist(file, 'root');
      should.exist(file.relative, 'relative');
      should.exist(file.path, 'path');
      should.exist(file.cwd, 'cwd');
      should.exist(file.base, 'base');
      file.path.should.equal(fname);
      file.cwd.should.equal(__dirname);
      file.base.should.equal(base);
      file.relative.should.equal("test.coffee");
      done();
    });

    it('should return a valid file 2', function(done) {
      var fname = join(__dirname, "./fixtures/test.coffee");
      var base = __dirname;
      var file = new gulp.File({
        base: base,
        cwd: __dirname,
        path: fname
      });
      should.exist(file, 'root');
      should.exist(file.relative, 'relative');
      should.exist(file.path, 'path');
      should.exist(file.cwd, 'cwd');
      should.exist(file.base, 'base');
      file.path.should.equal(fname);
      file.cwd.should.equal(__dirname);
      file.base.should.equal(base);
      file.relative.should.equal("fixtures/test.coffee");
      done();
    });
  });
});