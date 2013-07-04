async = require 'async'
#createFolderStream = require './createFolderStream'
createFilesStream = require './createFilesStream'
#createFileStream = require './createFileStream'

module.exports = gulp =
  reset: ->
    gulp.tasks = {}
    return @

  tasks: {}
  task: (name, fn) ->
    gulp.tasks[name] = fn
    return @

  run: (tasks...) ->
    for name in tasks
      fn = gulp.tasks[name]
      throw new Error "No task nmed #{name}" unless fn?
      fn.call gulp
    return @

  #folder: createFolderStream
  files: createFilesStream
  #file: createFileStream