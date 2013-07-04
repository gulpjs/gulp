es = require 'event-stream'
createGlobStream = require './createGlobStream'
readFile = require './readFile'

module.exports = (glob, opt) ->
  globStream = createGlobStream glob, opt
  stream = globStream.pipe es.map readFile

  return stream 