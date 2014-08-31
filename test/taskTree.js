'use strict';

var gulp = require('../');
var taskTree = require('../lib/taskTree');
var should = require('should');

var singleLevel = require('./fixtures/taskTree/singleLevel');
var doubleLevel = require('./fixtures/taskTree/doubleLevel');
var tripleLevel = require('./fixtures/taskTree/tripleLevel');

require('mocha');

function noop(done){ done(); }

describe('taskTree()', function() {

  var localGulp;
  var getTree;

  beforeEach(function(done){
    localGulp = new gulp.Gulp();
    getTree = taskTree(localGulp);
    done();
  });

  it('should form a 1 level tree', function(done) {
    localGulp.task('fn1', noop);
    localGulp.task('fn2', noop);

    var tree = getTree();

    tree.should.eql(singleLevel);
    done();
  });

  it('should form a 2 level nested tree', function(done){
    localGulp.task('fn1', noop);
    localGulp.task('fn2', noop);
    localGulp.task('fn3', localGulp.series('fn1', 'fn2'));

    var tree = getTree();

    tree.should.eql(doubleLevel);

    done();
  });

  it('should form a 3 level nested tree', function(done){
    var anon = function(done){
      done();
    };
    localGulp.task('fn1', localGulp.parallel(anon, noop));
    localGulp.task('fn2', localGulp.parallel(anon, noop));
    localGulp.task('fn3', localGulp.series('fn1', 'fn2'));

    var tree = getTree();

    tree.should.eql(tripleLevel);

    done();
  });
});
