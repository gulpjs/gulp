var gulp = require('../');
var should = require('should');
var join = require('path').join;
require('mocha');

describe('gulp single file collection', function() {
  describe('file()', function() {
    it('should return a stream', function(done) {
      var stream;
      stream = gulp.file(join(__dirname, "./fixtures/test.coffee"));
      should.exist(stream);
      should.exist(stream.on);
      done();
    });
    it('should return a file stream from a flat path', function(done) {
      var stream;
      stream = gulp.file(join(__dirname, "./fixtures/test.coffee"));
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
  });
});
