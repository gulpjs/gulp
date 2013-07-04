gulp = require '../'
should = require 'should'
require 'mocha'

{join} = require 'path'

describe 'gulp', ->

  describe 'createGlobStream()', ->
    it 'should return a file name stream from a glob', (done) ->
      stream = gulp.createGlobStream join __dirname, "./fixtures/*.coffee"
      should.exist stream
      stream.on 'error', (err) -> throw err
      stream.on 'data', (file) ->
        should.exist file
        String(file).should.equal join __dirname, "./fixtures/test.coffee"

      stream.on 'end', -> done()

  describe 'files()', ->
    it 'should return a files stream from a glob', (done) ->
      stream = gulp.files join __dirname, "./fixtures/*.coffee"
      should.exist stream
      stream.on 'error', (err) -> throw err
      stream.on 'data', (file) ->
        should.exist file
        should.exist file.path
        should.exist file.contents

        file.path.should.equal join __dirname, "./fixtures/test.coffee"
        String(file.contents).should.equal "this is a test"

      stream.on 'end', -> done()