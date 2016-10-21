'use strict';

var gulp = require('../');
var fs = require('graceful-fs');
var rimraf = require('rimraf');
var mkdirp = require('mkdirp');
var path = require('path');

var should = require('should');
require('mocha');

var outpath = path.join(__dirname, './out-fixtures');

describe('gulp', () => {
  describe('watch()', () => {
    beforeEach(rimraf.bind(null, outpath));
    beforeEach(mkdirp.bind(null, outpath));
    afterEach(rimraf.bind(null, outpath));

    var tempFileContent = 'A test generated this file and it is safe to delete';

    var writeTimeout = 125; // Wait for it to get to the filesystem
    var writeFileWait = function(name, content, cb) {
      if (!cb) {
        cb = function() {};
      }
      setTimeout(() => {
        fs.writeFile(name, content, cb);
      }, writeTimeout);
    };

    it('should call the function when file changes: no options', done => {

      // Arrange
      var tempFile = path.join(outpath, 'watch-func.txt');
      fs.writeFile(tempFile, tempFileContent, () => {

        // Assert: it works if it calls done
        var watcher = gulp.watch(tempFile, evt => {
          should.exist(evt);
          should.exist(evt.path);
          should.exist(evt.type);
          evt.type.should.equal('changed');
          evt.path.should.equal(path.resolve(tempFile));
          watcher.end();
          done();
        });

        // Act: change file
        writeFileWait(tempFile, tempFileContent + ' changed');
      });
    });

    it('should call the function when file changes: w/ options', done => {

      // Arrange
      var tempFile = path.join(outpath, 'watch-func-options.txt');
      fs.writeFile(tempFile, tempFileContent, () => {

        // Assert: it works if it calls done
        var watcher = gulp.watch(tempFile, { debounceDelay: 5 }, evt => {
          should.exist(evt);
          should.exist(evt.path);
          should.exist(evt.type);
          evt.type.should.equal('changed');
          evt.path.should.equal(path.resolve(tempFile));
          watcher.end();
          done();
        });

        // Act: change file
        writeFileWait(tempFile, tempFileContent + ' changed');
      });
    });

    it('should not drop options when no callback specified', done => {
      // Arrange
      var tempFile = path.join(outpath, 'watch-func-nodrop-options.txt');
      // By passing a cwd option, ensure options are not lost to gaze
      var relFile = '../watch-func-nodrop-options.txt';
      var cwd = outpath + '/subdir';
      fs.writeFile(tempFile, tempFileContent, () => {

        // Assert: it works if it calls done
        var watcher = gulp.watch(relFile, { debounceDelay: 5, cwd: cwd })
            .on('change', evt => {
              should.exist(evt);
              should.exist(evt.path);
              should.exist(evt.type);
              evt.type.should.equal('changed');
              evt.path.should.equal(path.resolve(tempFile));
              watcher.end();
              done();
            });

        // Act: change file
        writeFileWait(tempFile, tempFileContent + ' changed');
      });
    });

    it('should run many tasks: w/ options', done => {
      // Arrange
      var tempFile = path.join(outpath, 'watch-task-options.txt');
      var task1 = 'task1';
      var task2 = 'task2';
      var task3 = 'task3';
      var a = 0;
      var timeout = writeTimeout * 2.5;

      fs.writeFile(tempFile, tempFileContent, () => {

        gulp.task(task1, () => {
          a++;
        });
        gulp.task(task2, () => {
          a += 10;
        });
        gulp.task(task3, () => {
          throw new Error('task3 called!');
        });

        // It works if it calls the task
        var config = { debounceDelay: timeout / 2 };
        var watcher = gulp.watch(tempFile, config, [task1, task2]);

        // Assert
        setTimeout(() => {
          a.should.equal(11); // Task1 and task2

          gulp.reset();
          watcher.end();
          done();
        }, timeout);

        // Act: change file
        writeFileWait(tempFile, tempFileContent + ' changed');
      });
    });

    it('should run many tasks: no options', done => {
      // Arrange
      var tempFile = path.join(outpath, 'watch-many-tasks-no-options.txt');
      var task1 = 'task1';
      var task2 = 'task2';
      var task3 = 'task3';
      var a = 0;
      var timeout = writeTimeout * 2.5;

      fs.writeFile(tempFile, tempFileContent, () => {

        gulp.task(task1, () => {
          a++;
        });
        gulp.task(task2, () => {
          a += 10;
        });
        gulp.task(task3, () => {
          throw new Error('task3 called!');
        });

        // It works if it calls the task
        var watcher = gulp.watch(tempFile, [task1, task2]);

        // Assert
        setTimeout(() => {
          a.should.equal(11); // Task1 and task2

          gulp.reset();
          watcher.end();
          done();
        }, timeout);

        // Act: change file
        writeFileWait(tempFile, tempFileContent + ' changed');
      });
    });

  });
});
