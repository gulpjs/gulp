gulp = require '../'
should = require 'should'
require 'mocha'

{join} = require 'path'

describe 'gulp file collection', ->
  describe 'files()', ->
    it 'should return a stream', (done) ->
      stream = gulp.files join __dirname, "./fixtures/*.coffee"
      should.exist stream
      should.exist stream.on # good enough for me
      done()

    it 'should return a files stream from a flat glob', (done) ->
      stream = gulp.files join __dirname, "./fixtures/*.coffee"

      stream.on 'error', (err) -> throw err
      stream.on 'data', (file) ->
        should.exist file
        should.exist file.path
        should.exist file.contents

        file.path.should.equal join __dirname, "./fixtures/test.coffee"
        String(file.contents).should.equal "this is a test"

      stream.on 'end', -> done()

    it 'should return a files stream from a deep glob', (done) ->
      stream = gulp.files join __dirname, "./fixtures/**/*.jade"
      stream.on 'error', (err) -> throw err
      stream.on 'data', (file) ->
        should.exist file
        should.exist file.path
        should.exist file.contents

        file.path.should.equal join __dirname, "./fixtures/test/run.jade"
        String(file.contents).should.equal "test template"

      stream.on 'end', -> done()

    it 'should return a files stream from a deeper glob', (done) ->
      stream = gulp.files join __dirname, "./fixtures/**/*.dmc"
      a = 0
      stream.on 'error', (err) -> throw err
      stream.on 'data', (file) ->
        ++a

      stream.on 'end', ->
        a.should.equal 2
        done()