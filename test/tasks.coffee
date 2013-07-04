gulp = require '../'
should = require 'should'
require 'mocha'

describe 'gulp tasks', ->
  describe 'task()', ->
    it 'should define a task', (done) ->
      fn = ->

      gulp.task 'test', fn
      should.exist gulp.tasks.test
      gulp.tasks.test.should.equal fn
      gulp.reset()
      done()

  describe 'run()', ->
    it 'should run multiple tasks', (done) ->
      a = 0
      fn = ->
        @.should.equal gulp
        ++a
      fn2 = ->
        @.should.equal gulp
        ++a

      gulp.task 'test', fn
      gulp.task 'test2', fn2
      gulp.run 'test', 'test2'
      a.should.equal 2
      gulp.reset()
      done()

    it 'should run task scoped to gulp', (done) ->
      a = 0
      fn = ->
        @.should.equal gulp
        ++a

      gulp.task 'test', fn
      gulp.run 'test'
      a.should.equal 1
      gulp.reset()
      done()