var gulp = require('../');
var should = require('should');
var join = require('path').join;
require('mocha');

describe('gulp file utilities', function() {
  describe('readFile()', function() {
    it('should return a valid file struct', function(done) {
      var fname = join(__dirname, "./fixtures/test.coffee");
      gulp.readFile({path:fname,base:fname}, function(err, struct) {
        should.not.exist(err);
        should.exist(struct);
        should.exist(struct.path);
        should.exist(struct.contents);
        should.exist(struct.base);
        struct.path.should.equal(fname);
        struct.base.should.equal(fname);
        String(struct.contents).should.equal("this is a test");
        done();
      });
    });
  });
});
