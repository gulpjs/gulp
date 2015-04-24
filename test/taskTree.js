'use strict';

var taskTree = require('../lib/taskTree');
var should = require('should');

require('mocha');

describe('taskTree()', function() {
  it('should form a tree properly', function(done) {
    should.exist(taskTree); // Lol shutup jshint

    var tasks = {
      test: {
        dep: ['abc', 'def'],
      },
      abc: {
        dep: ['def'],
      },
      def: {
        dep: [],
      },
    };

    var expectTree = {
      nodes: [
        {
          label: 'test',
          nodes: ['abc', 'def'],
        }, {
          label: 'abc',
          nodes: ['def'],
        }, {
          label: 'def',
          nodes: [],
        },
      ],
    };

    taskTree(tasks).should.eql(expectTree);
    done();
  });
});
