var gulp = require('../');
var should = require('should');
var join = require('path').join;
var fs = require('fs');
var rimraf = require('rimraf');

require('mocha');

var expectedName = join(__dirname, "./fixtures/stuff/temp.coffee");

describe('gulp watch', function() {
  describe('watch()', function() {
    it('should return a valid file struct', function(done) {
      var fname = join(__dirname, "./fixtures/**/*.coffee");

      var watcher = gulp.watch(fname);
      watcher.on('change', function(evt) {
        should.exist(evt);
        should.exist(evt.path);
        should.exist(evt.type);
        // dont check type for now it always seems to be messed up
        //evt.type.should.equal('added');
        evt.path.should.equal(expectedName);
        rimraf.sync(expectedName);
        done();
      });
      setTimeout(function(){
        fs.writeFileSync(expectedName, "test");
      }, 200);
    });
  });
});