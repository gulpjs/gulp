createGlobStream = require './createGlobStream'
es = require 'event-stream'
fs = require 'fs'

module.exports = createFilesStream = (glob, opt) ->
  throw new Error "Invalid or missing glob string" unless typeof glob is 'string'

  globStream = createGlobStream glob, opt
  
  stream = globStream.pipe es.map fs.readFile

  return stream 