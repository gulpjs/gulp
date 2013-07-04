gulp = require '../'
{argv} = require 'optimist'
{join} = require 'path'
{existsSync} = require 'fs'

tasks = argv._

getGulpFile = ->
  for ext, handler of require.extensions
    script = join process.cwd(), "Gulpfile#{ext}"
    return script if existsSync script
  return

gulpFilename = getGulpFile()

throw new Error "Missing Gulpfile" unless gulpFilename?

# require in their gulp file
# it should register all of the tasks to gulp
theGulpfile = require gulpFilename

if tasks.length is 0
  gulp.run 'default'
else
  gulp.run tasks...