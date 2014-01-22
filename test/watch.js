'use strict';

var gulp = require('../');
var fs = require('graceful-fs');
var rimraf = require('rimraf');
var mkdirp = require('mkdirp');
var path = require('path');

var should = require('should');
require('mocha');

var outpath = path.join(__dirname, "./out-fixtures");

describe('gulp', function() {
  describe('watch()', function() {
    beforeEach(rimraf.bind(null, outpath));
    beforeEach(mkdirp.bind(null, outpath));
    afterEach(rimraf.bind(null, outpath));

    var tempFileContent = 'A test generated this file and it is safe to delete';

    var writeTimeout = 125; // Wait for it to get to the filesystem
    var writeFileWait = function (name, content, cb) {
      if (!cb) cb = function(){};
      setTimeout(function () {
        fs.writeFile(name, content, cb);
      }, writeTimeout);
    };
    it('should call the function when file changes: no options', function(done) {

      // arrange
      var tempFile = path.join(outpath, 'watch-func.txt');
      fs.writeFile(tempFile, tempFileContent, function () {

        // assert: it works if it calls done
        var watcher = gulp.watch(tempFile, function (evt) {
          should.exist(evt);
          should.exist(evt.path);
          should.exist(evt.type);
          evt.type.should.equal('changed');
          evt.path.should.equal(path.resolve(tempFile));
          watcher.end();
          done();
        });

        // act: change file
        writeFileWait(tempFile, tempFileContent+' changed');
      });
    });

    it('should call the function when file changes: w/ options', function(done) {
      // arrange
      var tempFile = path.join(outpath, 'watch-func-options.txt');
      fs.writeFile(tempFile, tempFileContent, function () {

        // assert: it works if it calls done
        var watcher = gulp.watch(tempFile, {debounceDelay:5}, function (evt) {
          should.exist(evt);
          should.exist(evt.path);
          should.exist(evt.type);
          evt.type.should.equal('changed');
          evt.path.should.equal(path.resolve(tempFile));
          watcher.end();
          done();
        });

        // act: change file
        writeFileWait(tempFile, tempFileContent+' changed');
      });
    });

    it('should run many tasks: w/ options', function(done) {
      // arrange
      var tempFile = path.join(outpath, 'watch-task-options.txt');
      var task1 = 'task1';
      var task2 = 'task2';
      var task3 = 'task3';
      var a = 0;
      var timeout = writeTimeout * 2.5;

      fs.writeFile(tempFile, tempFileContent, function () {

        gulp.task(task1, function () {
          a++;
        });
        gulp.task(task2, function () {
          a += 10;
        });
        gulp.task(task3, function () {
          throw new Error("task3 called!");
        });

        // assert
        setTimeout(function () {
          a.should.equal(11); // task1 and task2

          gulp.reset();
          watcher.end();
          done();
        }, timeout);

        // it works if it calls the task
        var watcher = gulp.watch(tempFile, {debounceDelay:timeout/2}, [task1,task2]);

        // act: change file
        writeFileWait(tempFile, tempFileContent+' changed');
      });
    });

  });
});
