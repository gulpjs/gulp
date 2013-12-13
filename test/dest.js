var gulp = require('../');
var should = require('should');
var join = require('path').join;
var rimraf = require('rimraf');
var fs = require('fs');
var es = require('event-stream');

require('mocha');

describe('gulp output stream', function() {
  describe('dest()', function() {

    it('should return a stream', function(done) {
      var stream = gulp.dest(join(__dirname, "./fixtures/"));
      should.exist(stream);
      should.exist(stream.on);
      done();
    });

    it('should be able to write buffered content', function(done){
      var outpath = join(__dirname, "./out-fixtures");
      rimraf(outpath, function(err){
        should.not.exist(err);
        var instream = gulp.src(join(__dirname, "./fixtures/**/*.txt"));
        var bufferifyContents = es.through(
          function(file){
            file.contents = new Buffer(file.contents);
            this.emit('data', file);
          },
          function(){ this.emit('end'); }
        );
        var outstream = gulp.dest(outpath);
        instream
          .pipe(bufferifyContents)
          .pipe(outstream);

        outstream.on('error', done);
        outstream.on('data', function(file) {
          // data should be re-emitted right
          should.exist(file);
          should.exist(file.path);
          should.exist(file.contents);
          join(file.path,'').should.equal(join(__dirname, "./fixtures/copy/example.txt"));
          String(file.contents).should.equal("this is a test");
        });
        outstream.on('end', function() {
          fs.readFile(join(outpath, "copy", "example.txt"), function(err, contents){
            should.not.exist(err);
            should.exist(contents);
            String(contents).should.equal("this is a test");
            done();
          });
        });
      });
    });

    it('should be able to write string content', function(done){
      var outpath = join(__dirname, "./out-fixtures");
      rimraf(outpath, function(err){
        should.not.exist(err);
        var instream = gulp.src(join(__dirname, "./fixtures/**/*.txt"));
        var stringifyContents = es.through(
          function(file){
            file.contents = new String(file.contents);
            this.emit('data', file);
          },
          function(){ this.emit('end'); }
        );
        var outstream = gulp.dest(outpath);
        instream
          .pipe(stringifyContents)
          .pipe(outstream);

        outstream.on('error', done);
        outstream.on('data', function(file) {
          // data should be re-emitted right
          should.exist(file);
          should.exist(file.path);
          should.exist(file.contents);
          join(file.path,'').should.equal(join(__dirname, "./fixtures/copy/example.txt"));
          String(file.contents).should.equal("this is a test");
        });
        outstream.on('end', function() {
          fs.readFile(join(outpath, "copy", "example.txt"), function(err, contents){
            should.not.exist(err);
            should.exist(contents);
            String(contents).should.equal("this is a test");
            done();
          });
        });
      });
    });

    it('should return a output stream that writes files', function(done) {
      var outpath = join(__dirname, "./out-fixtures");
      rimraf(outpath, function(err){
        should.not.exist(err);
        var instream = gulp.src(join(__dirname, "./fixtures/**/*.txt"));
        var outstream = gulp.dest(outpath);
        instream.pipe(outstream);

        outstream.on('error', done);
        outstream.on('data', function(file) {
          // data should be re-emitted right
          should.exist(file);
          should.exist(file.path);
          should.exist(file.contents);
          join(file.path,'').should.equal(join(__dirname, "./fixtures/copy/example.txt"));
          String(file.contents).should.equal("this is a test");
        });
        outstream.on('end', function() {
          fs.readFile(join(outpath, "copy", "example.txt"), function(err, contents){
            should.not.exist(err);
            should.exist(contents);
            String(contents).should.equal("this is a test");
            done();
          });
        });
      });
    });
  
    it('should return a output stream that does not write non-read files', function(done) {
      var outpath = join(__dirname, "./out-fixtures");
      rimraf(outpath, function(err){
        should.not.exist(err);
        var instream = gulp.src(join(__dirname, "./fixtures/**/*.txt"), {read:false});
        var outstream = gulp.dest(outpath);
        instream.pipe(outstream);

        outstream.on('error', done);
        outstream.on('data', function(file) {
          // data should be re-emitted right
          should.exist(file);
          should.exist(file.path);
          should.not.exist(file.contents);
          join(file.path,'').should.equal(join(__dirname, "./fixtures/copy/example.txt"));
        });
        outstream.on('end', function() {
          fs.readFile(join(outpath, "copy", "example.txt"), function(err, contents){
            should.exist(err);
            should.not.exist(contents);
            done();
          });
        });
      });
    });

    it('should return a output stream that writes streaming files', function(done) {
      var outpath = join(__dirname, "./out-fixtures");
      rimraf(outpath, function(err){
        should.not.exist(err);
        var instream = gulp.src(join(__dirname, "./fixtures/**/*.txt"), {buffer:false});
        var outstream = gulp.dest(outpath);
        instream.pipe(outstream);

        outstream.on('error', done);
        outstream.on('data', function(file) {
          // data should be re-emitted right
          should.exist(file);
          should.exist(file.path);
          should.exist(file.contents);
          join(file.path,'').should.equal(join(__dirname, "./fixtures/copy/example.txt"));
        });
        outstream.on('end', function() {
          fs.readFile(join(outpath, "copy", "example.txt"), function(err, contents){
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
