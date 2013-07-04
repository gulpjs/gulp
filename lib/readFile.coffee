fs = require 'fs'

module.exports = (fname, cb) ->
  fs.readFile fname, (err, contents) ->
    return cb err if err?
    fileObj =
      path: fname
      contents: contents
    cb null, fileObj