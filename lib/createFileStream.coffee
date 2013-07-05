es = require 'event-stream'
readFile = require './readFile'

module.exports = (path, opt) ->
  stream = es.pause()
  stream.pipe es.map readFile
  stream.emit path
  return stream