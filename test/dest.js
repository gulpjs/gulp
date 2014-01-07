var gulp = require('../');
var should = require('should');
var join = require('path').join;
var rimraf = require('rimraf');
var fs = require('fs');
var gutil = require('gulp-util');
var Stream = require('stream');

require('mocha');

describe('gulp output stream', function() {
  describe('dest()', function() {

    it('should return a stream', function(done) {
      var stream = gulp.dest(join(__dirname, "./fixtures/"));
      should.exist(stream);
      should.exist(stream.on);
      done();
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
        var outstream = instream.pipe(gulp.dest(outpath));

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

    it('should return a output stream only after file close', function(done) {
      var outpath = join(__dirname, "./out-fixtures");
      rimraf(outpath, function(err){
        should.not.exist(err);
        var instream = new Stream.PassThrough({objectMode: true});
        var outstream = instream.pipe(gulp.dest(outpath));

        var fakeFile = new gutil.File({
          path:'foo.txt',
          contents: new Stream.PassThrough()
        });
        
        instream.write(fakeFile);
        instream.end();

        outstream.on('error', done);
        outstream.on('data', function(file) {
          // data should be re-emitted right
          should.exist(file);
          should.exist(file.path);
          should.exist(file.contents);
          join(file.path,'').should.equal("foo.txt");
        });
        outstream.on('end', function() {
          fs.readFileSync(join(outpath, "foo.txt"), 'utf-8')
            .should.equal('plopplopplopplop');
          done();
        });
        process.nextTick(function() {
          fakeFile.contents.write(Buffer('plop'));
          fakeFile.contents.write(Buffer('plop'));
          fakeFile.contents.write(Buffer('plop'));
          fakeFile.contents.write(Buffer('plop'));
          fakeFile.contents.end();
        });
      });
    });



  });
});
