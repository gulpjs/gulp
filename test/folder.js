var gulp = require('../');
var should = require('should');
var join = require('path').join;
var rimraf = require('rimraf');
var fs = require('fs');

require('mocha');

describe('gulp file collection', function() {
  describe('folder()', function() {
    it('should return a stream', function(done) {
      var stream = gulp.folder(join(__dirname, "./fixtures/"));
      should.exist(stream);
      should.exist(stream.on);
      done();
    });
    it('should return a folder stream that writes files', function(done) {
      var outpath = join(__dirname, "./out-fixtures");
      rimraf(outpath, function(err){
        should.not.exist(err);
        var instream = gulp.files(join(__dirname, "./fixtures/*.coffee"));
        var outstream = gulp.folder(outpath);
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
          fs.readFile(join(outpath, "test.coffee"), function(err, contents){
            should.not.exist(err);
            should.exist(contents);
            String(contents).should.equal("this is a test");
            done();
          });
        });
      });
    });
  });
});
