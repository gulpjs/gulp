# gulp changelog

## 2.7

- Breaking change to the way options are passed to glob-stream
- Introduce new File object to ease pain of computing shortened names

## 2.4 - 2.6

- Moved stuff to gulp-util
- Quit exposing createGlobStream (just use the glob-stream module)
- More logging
- Prettier time durations
- Tons of documentation changes
- gulp.trigger(tasks...) as a through stream

## 1.2-2.4 (11/12/13)

- src buffer=false fixed for 0.8 and 0.9 (remember to .resume() on these versions before consuming)
- CLI completely rewritten
  - Colorful logging
  - Uses local version of gulp to run tasks
  - Uses findup to locate gulpfile (so you can run it anywhere in your project)
  - chdir to gulpfile directory before loading it
  - Correct exit codes on errors
- silent flag added to gulp to disable logging
- Fixes to task orchestration (3rd party)
- Better support for globbed directories (thanks @robrich)

## 1.2 (10/28/13)

- Can specify buffer=false on src streams to make file.content a stream
- Can specify read=false on src streams to disable file.content

## 1.1 (10/21/13)

- Can specify run callback
- Can specify task dependencies
- Tasks can accept callback or return promise
- `gulp.verbose` exposes run-time internals

## 1.0 (9/26/13)

- Specify dependency versions
- Updated docs

## 0.2 (8/6/13)

- Rename .files() to .src() and .folder() to .dest()

## 0.1 (7/18/13)

- Initial Release
