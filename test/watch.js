'use strict';

var gulp = require('../');
var fs = require('fs');
var path = require('path');

var should = require('should');
require('mocha');

describe('gulp', function() {
  describe('watch()', function() {
    var tempFileContent = 'A test generated this file and it is safe to delete';

    var writeTimeout = 125; // Wait for it to get to the filesystem
    var writeFile = function (name, content, cb) {
      fs.writeFile(name, content, cb);
    };
    var writeFileWait = function (name, content, cb) {
      setTimeout(function () {
        fs.writeFile(name, content, cb);
      }, writeTimeout);
    };

    it('should call the function when file changes: no options', function(done) {

      // arrange
      var tempFile = './test/watch-func.txt';
      writeFile(tempFile, tempFileContent, function () {

        // assert: it works if it calls done
        gulp.watch(tempFile, function (evt) {
          should.exist(evt);
          should.exist(evt.path);
          should.exist(evt.type);
          evt.type.should.equal('changed');
          evt.path.should.equal(path.resolve(tempFile));
          done();
        });

        // act: change file
        writeFileWait(tempFile, tempFileContent+' changed');
      });
    });

    it('should call the function when file changes: w/ options', function(done) {
      // arrange
      var tempFile = './test/watch-func-options.txt';
      writeFile(tempFile, tempFileContent, function () {

        // assert: it works if it calls done
        gulp.watch(tempFile, {debounceDelay:5}, function (evt) {
          should.exist(evt);
          should.exist(evt.path);
          should.exist(evt.type);
          evt.type.should.equal('changed');
          evt.path.should.equal(path.resolve(tempFile));
          done();
        });

        // act: change file
        writeFileWait(tempFile, tempFileContent+' changed');
      });
    });

    it('should run a task by name: no options', function(done) {
      // arrange
      var tempFile = './test/watch-task.txt';
      var taskName = 'run-task';
      var a = 0;
      var timeout = writeTimeout * 2.5;

      writeFile(tempFile, tempFileContent, function () {

        gulp.task(taskName, function () {
          a++;
        });

        // assert
        setTimeout(function () {
          a.should.equal(1);

          gulp.reset();
          done();
        }, timeout);

        // it works if it calls the task
        gulp.watch(tempFile, taskName);

        // act: change file
        writeFileWait(tempFile, tempFileContent+' changed');
      });
    });

    it('should run many tasks: w/ options', function(done) {
      // arrange
      var tempFile = './test/watch-task-options.txt';
      var task1 = 'task1';
      var task2 = 'task2';
      var a = 0;
      var timeout = writeTimeout * 2.5;

      writeFile(tempFile, tempFileContent, function () {

        gulp.task(task1, function () {
          a++;
        });
        gulp.task(task2, function () {
          a += 10;
        });

        // assert
        setTimeout(function () {
          a.should.equal(11); // task1 and task2

          gulp.reset();
          done();
        }, timeout);

        // it works if it calls the task
        gulp.watch(tempFile, {debounceDelay:timeout/2}, [task1,task2]);

        // act: change file
        writeFileWait(tempFile, tempFileContent+' changed');
      });
    });

  });
});
