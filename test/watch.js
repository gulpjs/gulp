'use strict';

/* eslint-disable no-use-before-define */

var fs = require('fs');
var path = require('path');

var expect = require('expect');
var rimraf = require('rimraf');
var mkdirp = require('mkdirp').mkdirp;

var gulp = require('../');

var outpath = path.join(__dirname, './out-fixtures');

var tempFileContent = 'A test generated this file and it is safe to delete';

function createTempFile(path) {
  fs.writeFileSync(path, tempFileContent);
}

function updateTempFile(path) {
  setTimeout(function() {
    fs.appendFileSync(path, ' changed');
  }, 125);
}

function removeTempFile(path) {
  setTimeout(function() {
    fs.unlinkSync(path);
  }, 125);
}

describe('gulp.watch()', function() {
  beforeEach(function (done) {
    rimraf(outpath, done);
  });
  beforeEach(function () {
    return mkdirp(outpath);
  });
  afterEach(function (done) {
    rimraf(outpath, done);
  });

  it('should call the function when file changes: no options', function(done) {
    var tempFile = path.join(outpath, 'watch-func.txt');

    createTempFile(tempFile);

    var watcher = gulp.watch('watch-func.txt', { cwd: outpath }, function(cb) {
      watcher.close();
      cb();
      done();
    });

    updateTempFile(tempFile);
  });

  it('should execute the gulp.parallel tasks', function(done) {
    var tempFile = path.join(outpath, 'watch-func.txt');

    createTempFile(tempFile);

    gulp.task('test', function(cb) {
      watcher.close();
      cb();
      done();
    });

    var watcher = gulp.watch('watch-func.txt', { cwd: outpath }, gulp.parallel('test'));

    updateTempFile(tempFile);
  });

  it('should work with destructuring', function(done) {
    var tempFile = path.join(outpath, 'watch-func.txt');
    var watch = gulp.watch;
    var parallel = gulp.parallel;
    var task = gulp.task;
    createTempFile(tempFile);

    task('test', function(cb) {
      watcher.close();
      cb();
      done();
    });

    var watcher = watch('watch-func.txt', { cwd: outpath }, parallel('test'));

    updateTempFile(tempFile);
  });

  it('should not call the function when no file changes: no options', function(done) {
    var tempFile = path.join(outpath, 'watch-func.txt');

    createTempFile(tempFile);

    var watcher = gulp.watch('watch-func.txt', { cwd: outpath }, function() {
      // TODO: proper fail here
      expect('Watcher erroneously called');
    });

    setTimeout(function() {
      watcher.close();
      done();
    }, 10);
  });

  it('should call the function when file changes: w/ options', function(done) {
    var tempFile = path.join(outpath, 'watch-func-options.txt');

    createTempFile(tempFile);

    var watcher = gulp.watch('watch-func-options.txt', { cwd: outpath }, function(cb) {
      watcher.close();
      cb();
      done();
    });

    updateTempFile(tempFile);
  });

  it('should call the function when file changes at a path with japanese characters', function(done) {
    var japaneseDir = path.join(outpath, 'フォルダ');

    fs.mkdirSync(japaneseDir);

    var tempFile = path.join(japaneseDir, 'foobar.txt');

    createTempFile(tempFile);

    var watcher = gulp.watch('フォルダ/*', { cwd: outpath }, function(cb) {
      watcher.close();
      cb();
      done();
    });

    updateTempFile(tempFile);
  });

  it('should not call the function when ignored file changes', function(done) {
    var tempFile = path.join(outpath, 'ignored.txt');

    createTempFile(tempFile);

    var watcher = gulp.watch(['*', '!ignored.txt'], { cwd: outpath }, function() {
      done(new Error('should not each here!'));
    });

    removeTempFile(tempFile);
    setTimeout(function () {
      watcher.close();
      done();
    }, 1000);
  });

  it('should not drop options when no callback specified', function(done) {
    var tempFile = path.join(outpath, 'watch-func-nodrop-options.txt');
    // By passing a cwd option, ensure options are not lost to gaze
    var relFile = '../watch-func-nodrop-options.txt';
    var cwd = path.join(outpath, '/subdir');

    createTempFile(tempFile);

    var watcher = gulp.watch(relFile, { cwd: cwd })
      .on('change', function(filepath) {
        expect(filepath).toBeDefined();
        expect(path.resolve(cwd, filepath)).toEqual(path.resolve(tempFile));
        watcher.close();
        done();
      });

    updateTempFile(tempFile);
  });

  it('should work without options or callback', function(done) {
    var watcher = gulp.watch('x');
    watcher.close();
    done();
  });

  it('should run many tasks: w/ options', function(done) {
    var tempFile = path.join(outpath, 'watch-task-options.txt');
    var a = 0;

    createTempFile(tempFile);

    gulp.task('task1', function(cb) {
      a++;
      cb();
    });
    gulp.task('task2', function(cb) {
      a += 10;
      expect(a).toEqual(11);
      watcher.close();
      cb();
      done();
    });

    var watcher = gulp.watch('watch-task-options.txt', { cwd: outpath }, gulp.series('task1', 'task2'));

    updateTempFile(tempFile);
  });

  it('should run many tasks: no options', function(done) {
    var tempFile = path.join(outpath, 'watch-many-tasks-no-options.txt');
    var a = 0;

    createTempFile(tempFile);

    gulp.task('task1', function(cb) {
      a++;
      cb();
    });
    gulp.task('task2', function(cb) {
      a += 10;
      expect(a).toEqual(11);
      watcher.close();
      cb();
      done();
    });

    var watcher = gulp.watch('./test/out-fixtures/watch-many-tasks-no-options.txt', gulp.series('task1', 'task2'));

    updateTempFile(tempFile);
  });

  it('should throw an error: passed parameter (string) is not a function', function(done) {
    var filename = 'empty.txt';
    var tempFile = path.join(outpath, filename);

    createTempFile(tempFile);
    try {
      gulp.watch(filename, { cwd: outpath }, 'task1');
    } catch (err) {
      expect(err.message).toEqual('watching ' + filename +  ': watch task has to be a function (optionally generated by using gulp.parallel or gulp.series)');
      done();
    }
  });

  it('should throw an error: passed parameter (array) is not a function', function(done) {
    var filename = 'empty.txt';
    var tempFile = path.join(outpath, filename);

    createTempFile(tempFile);
    try {
      gulp.watch(filename, { cwd: outpath }, ['task1']);
    } catch (err) {
      expect(err.message).toEqual('watching ' + filename +  ': watch task has to be a function (optionally generated by using gulp.parallel or gulp.series)');
      done();
    }
  });

});
