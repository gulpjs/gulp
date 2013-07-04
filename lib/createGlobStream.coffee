es = require 'event-stream'
glob = require 'glob'

module.exports = (globb, opt={}) ->
  throw new Error "Invalid or missing glob string" unless typeof globb is 'string'
  
  opt.silent ?= true
  opt.nonull ?= false

  stream = es.pause()

  globber = new glob.Glob globb, opt
  globber.on 'error', (e) ->
    stream.emit 'error', e

  globber.on 'end', ->
    stream.emit 'end'

  globber.on 'match', (filename) ->
    stream.emit 'data', filename

  return stream