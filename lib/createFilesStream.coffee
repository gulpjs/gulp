createGlobStream = require './createGlobStream'
es = require 'event-stream'
fs = require 'fs'

readFile = (fname, cb) ->
  fs.readFile fname, (err, contents) ->
    return cb err if err?
    fileObj =
      path: fname
      contents: contents
    cb null, fileObj

module.exports = createFilesStream = (glob, opt) ->
  globStream = createGlobStream glob, opt
  stream = globStream.pipe es.map readFile

  return stream 