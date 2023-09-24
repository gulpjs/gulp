'use strict';

var expect = require('expect');

var Undertaker = require('../');

function noop(done) {
  done();
}

var anon = function() {};

describe('task', function() {
  var taker;

  beforeEach(function(done) {
    taker = new Undertaker();
    done();
  });

  it('should register a named function', function(done) {
    taker.task(noop);
    expect(taker.task('noop').unwrap()).toEqual(noop);
    done();
  });

  it('should register an anonymous function by string name', function(done) {
    taker.task('test1', anon);
    expect(taker.task('test1').unwrap()).toEqual(anon);
    done();
  });

  it('should register an anonymous function by displayName property', function(done) {
    anon.displayName = '<display name>';
    taker.task(anon);
    expect(taker.task('<display name>').unwrap()).toEqual(anon);
    delete anon.displayName;
    done();
  });

  it('should throw on register an anonymous function without string name', function(done) {
    function noName() {
      taker.task(function() {});
    }

    expect(noName).toThrow('Task name must be specified');
    done();
  });

  it('should register a named function by string name', function(done) {
    taker.task('test1', noop);
    expect(taker.task('test1').unwrap()).toEqual(noop);
    done();
  });

  it('should not get a task that was not registered', function(done) {
    expect(taker.task('test1')).toEqual(undefined);
    done();
  });

  it('should get a task that was registered', function(done) {
    taker.task('test1', noop);
    expect(taker.task('test1').unwrap()).toEqual(noop);
    done();
  });

  it('should get the wrapped task, not original function', function(done) {
    var registry = taker.registry();
    taker.task('test1', noop);
    expect(taker.task('test1').unwrap).toBeA('function');
    expect(taker.task('test1')).toEqual(registry.get('test1'));
    done();
  });

  it('provides an `unwrap` method to get the original function', function(done) {
    taker.task('test1', noop);
    expect(taker.task('test1').unwrap).toBeA('function');
    expect(taker.task('test1').unwrap()).toEqual(noop);
    done();
  });

  it('should return a function that was registered in some other way', function(done) {
    taker.registry()._tasks.test1 = noop;
    expect(taker.task('test1')).toEqual(noop);
    done();
  });

  it('should prefer displayName instead of name when both properties are defined', function(done) {
    function fn() {}
    fn.displayName = 'test1';
    taker.task(fn);
    expect(taker.task('test1').unwrap()).toEqual(fn);
    done();
  });

  it('should allow different tasks to refer to the same function', function(done) {
    function fn() {}
    taker.task('foo', fn);
    taker.task('bar', fn);
    expect(taker.task('foo').unwrap()).toEqual(taker.task('bar').unwrap());
    done();
  });

  it('should allow using aliased tasks in composite tasks', function(done) {
    var count = 0;
    function fn(cb) {
      count++;
      cb();
    }

    taker.task('foo', fn);
    taker.task('bar', fn);

    var series = taker.series('foo', 'bar', function(cb) {
      expect(count).toEqual(2);
      cb();
    });

    var parallel = taker.parallel('foo', 'bar', function(cb) {
      setTimeout(function() {
        expect(count).toEqual(4);
        cb();
      }, 500);
    });

    taker.series(series, parallel)(done);
  });

  it('should allow composite tasks tasks to be aliased', function(done) {
    var count = 0;
    function fn1(cb) {
      count += 1;
      cb();
    }
    function fn2(cb) {
      count += 2;
      cb();
    }

    taker.task('ser', taker.series(fn1, fn2));
    taker.task('foo', taker.task('ser'));

    taker.task('par', taker.parallel(fn1, fn2));
    taker.task('bar', taker.task('par'));

    var series = taker.series('foo', function(cb) {
      expect(count).toEqual(3);
      cb();
    });

    var parallel = taker.series('bar', function(cb) {
      setTimeout(function() {
        expect(count).toEqual(6);
        cb();
      }, 500);
    });

    taker.series(series, parallel)(done);
  });

});
