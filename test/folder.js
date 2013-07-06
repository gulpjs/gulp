var gulp = require('../');
var should = require('should');
var join = require('path').join;
require('mocha');

describe('gulp file collection', function() {
  describe('files()', function() {
    it('should return a stream', function(done) {
      var stream = gulp.folder(join(__dirname, "./fixtures/"));
      should.exist(stream);
      should.exist(stream.on);
      done();
    });
    it('should return a folder stream that writes files', function(done) {
      var instream = gulp.files(join(__dirname, "./fixtures/*.coffee"));
      var outstream = gulp.folder(join(__dirname, "./out-fixtures"));
      instream.pipe(outstream);

      outstream.on('error', done);
      outstream.on('data', function(file) {
        // data should be re-emitted right
        should.exist(file);
        should.exist(file.path);
        should.exist(file.contents);
        file.path.should.equal(join(__dirname, "./fixtures/test.coffee"));
        String(file.contents).should.equal("this is a test");
      });
      outstream.on('end', function() {
        done();
      });
    });
  });
});
