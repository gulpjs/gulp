gulp = require '../'
should = require 'should'
require 'mocha'

{join} = require 'path'

describe 'gulp file utilities', ->
  describe 'createGlobStream()', ->
    it 'should return a file name stream from a glob', (done) ->
      stream = gulp.createGlobStream join __dirname, "./fixtures/*.coffee"
      should.exist stream
      stream.on 'error', (err) -> throw err
      stream.on 'data', (file) ->
        should.exist file
        String(file).should.equal join __dirname, "./fixtures/test.coffee"

      stream.on 'end', -> done()

  describe 'readFile()', ->
    it 'should return a valid file struct', (done) ->
      fname = join __dirname, "./fixtures/test.coffee"
      gulp.readFile fname, (err, struct) ->
        should.not.exist err
        should.exist struct
        should.exist struct.path
        should.exist struct.contents
        struct.path.should.equal fname
        String(struct.contents).should.equal "this is a test"
        done()