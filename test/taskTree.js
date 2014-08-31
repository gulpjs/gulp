'use strict';

var gulp = require('../');
var taskTree = require('../lib/taskTree');
var should = require('should');

require('mocha');

function noop(done){ done(); }

describe('taskTree()', function() {
  it('should form a tree properly', function(done) {
    var localGulp = new gulp.Gulp();

    var getTree = taskTree(localGulp);

    localGulp.task('fn1', noop);
    localGulp.task('fn2', noop);

    var expectTree = {
      nodes: [
        {
          label: 'fn1',
          nodes: []
        },
        {
          label: 'fn2',
          nodes: []
        }
      ]
    };

    var tree = getTree();

    tree.should.eql(expectTree);
    done();
  });
});
