'use strict';

var expect = require('expect');

var Undertaker = require('../');

describe('lastRun', function() {
  var taker, test1, test2, error, alias;
  var defaultResolution = process.env.UNDERTAKER_TIME_RESOLUTION;

  beforeEach(function(done) {
    process.env.UNDERTAKER_TIME_RESOLUTION = '0';
    taker = new Undertaker();

    test1 = function(cb) {
      cb();
    };
    taker.task('test1', test1);

    test2 = function(cb) {
      cb();
    };
    test2.displayName = 'test2';
    taker.task(test2);

    error = function(cb) {
      cb(new Error());
    };
    taker.task('error', error);

    alias = test1;
    taker.task('alias', alias);

    done();
  });

  afterEach(function(done) {
    process.env.UNDERTAKER_TIME_RESOLUTION = defaultResolution;
    done();
  });

  it('should only record time when task has completed', function(done) {
    var ts;
    var test = function(cb) {
      ts = taker.lastRun('test');
      cb();
    };
    taker.task('test', test);
    taker.parallel('test')(function(err) {
      expect(ts).toEqual(undefined);
      done(err);
    });
  });

  it('should record tasks time execution', function(done) {
    taker.parallel('test1')(function(err) {
      expect(taker.lastRun('test1')).toExist();
      expect(taker.lastRun('test1')).toBeLessThanOrEqualTo(Date.now());
      expect(taker.lastRun(test2)).toNotExist();
      expect(taker.lastRun(function() {})).toNotExist();
      expect(taker.lastRun.bind(taker, 'notexists')).toThrow(Error);
      done(err);
    });
  });

  it('should record all tasks time execution', function(done) {
    taker.parallel('test1', test2)(function(err) {
      expect(taker.lastRun('test1')).toExist();
      expect(taker.lastRun('test1')).toBeLessThanOrEqualTo(Date.now());
      expect(taker.lastRun(test2)).toExist();
      expect(taker.lastRun(test2)).toBeLessThanOrEqualTo(Date.now());
      done(err);
    });
  });

  it('should record same tasks time execution for a string task and its original', function(done) {
    taker.series(test2)(function(err) {
      expect(taker.lastRun(test2)).toEqual(taker.lastRun('test2'));
      done(err);
    });
  });

  it('should record tasks time execution for an aliased task', function(done) {
    taker.series('alias')(function(err) {
      expect(taker.lastRun('alias')).toEqual(taker.lastRun('test1'));
      done(err);
    });
  });

  it('should give time with 1s resolution', function(done) {
    var resolution = 1000; // 1s
    var since = Date.now();
    var expected = since - (since % resolution);

    taker.series('test1')(function() {
      expect(taker.lastRun('test1', resolution)).toEqual(expected);
      done();
    });
  });

  it('should not record task start time on error', function(done) {
    taker.on('error', function() {
      // To keep the test from catching the emitted errors
    });
    taker.series('error')(function(err) {
      expect(err).toExist();
      expect(taker.lastRun('error')).toNotExist();
      done();
    });
  });

});
