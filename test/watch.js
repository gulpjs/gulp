var gulp = require('../');
var should = require('should');
var join = require('path').join;
var fs = require('fs');
var rimraf = require('rimraf');

require('mocha');

var expectedName = join(__dirname, "./fixtures/_temp.coffee");

after(function(done){
  rimraf(expectedName, function(err){
    should.not.exist(err);
    done();
  });
});

describe('gulp watch', function() {
  describe('watch()', function() {
    it('should return a valid file struct', function(done) {
      var fname = join(__dirname, "./fixtures/*.*");

      var watcher = gulp.watch(fname);
      watcher.on('change', function(evt) {
        should.exist(evt);
        should.exist(evt.path);
        should.exist(evt.type);
        evt.type.should.equal('added');
        evt.path.should.equal(expectedName);
        done();
      });

      fs.writeFileSync(expectedName, "test");
    });
  });
});
