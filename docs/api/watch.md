<!-- front-matter
id: api-watch
title: watch()
hide_title: true
sidebar_label: watch()
-->

# `gulp.watch(globs[, opts][, fn])`

Takes a path string, an array of path strings, a [glob][node-glob] string or an array of [glob][node-glob] strings as `globs` to watch on the filesystem. Also optionally takes `options` to configure the watcher and a `fn` to execute when a file changes.

Returns an instance of [`chokidar`][chokidar].

```js
gulp.watch('js/**/*.js', gulp.parallel('concat', 'uglify'));
```

In the example, `gulp.watch` runs the function returned by `gulp.parallel` each
time a file with the `js` extension in `js/` is updated.

## globs
Type: `String` or `Array`

A path string, an array of path strings, a [glob][node-glob] string or an array of [glob][node-glob] strings that indicate which files to watch for changes.

## opts
Type: `Object`

* `delay` (milliseconds, default: `200`). The delay to wait before triggering the fn. Useful for waiting on many changes before doing the work on changed files, e.g. find-and-replace on many files.
* `queue` (boolean, default: `true`). Whether or not a file change should queue the fn execution if the fn is already running. Useful for a long running fn.
* `ignoreInitial` (boolean, default: `true`). If set to `false` the `fn` is called during [chokidar][chokidar] instantiation as it discovers the file paths. Useful if it is desirable to trigger the `fn` during startup. __Passed through to [chokidar][chokidar], but defaulted to `true` instead of `false`.__

Options that are passed to [`chokidar`][chokidar].

Commonly used options:

* `ignored` ([anymatch](https://github.com/es128/anymatch)-compatible definition).
Defines files/paths to be excluded from being watched.
* `usePolling` (boolean, default: `false`). When `true` uses a watch method backed
by stat polling. Usually necessary when watching files on a network mount or on a
VMs file system.
* `cwd` (path string). The base directory from which watch paths are to be
derived. Paths emitted with events will be relative to this.
* `alwaysStat` (boolean, default: `false`). If relying upon the
[`fs.Stats`][fs stats] object
that may get passed as a second argument with `add`, `addDir`, and `change` events
when available, set this to `true` to ensure it is provided with every event. May
have a slight performance penalty.

Read about the full set of options in [`chokidar`'s README][chokidar].

## fn
Type: `Function`

If the `fn` is passed, it will be called when the watcher emits a `change`, `add` or `unlink` event. It is automatically debounced with a default delay of 200 milliseconds and subsequent calls will be queued and called upon completion. These defaults can be changed using the `options`.

The `fn` is passed a single argument, `callback`, which is a function that must be called when work in the `fn` is complete. Instead of calling the `callback` function, [async completion][async-completion] can be signalled by:
  * Returning a `Stream` or `EventEmitter`
  * Returning a `Child Process`
  * Returning a `Promise`
  * Returning an `Observable`

Once async completion is signalled, if another run is queued, it will be executed.

`gulp.watch` returns a wrapped [chokidar] FSWatcher object. Listeners can also be set directly for any of [chokidar]'s events, such as `addDir`, `unlinkDir`, and `error`. You must set listeners directly to get
access to chokidar's callback parameters, such as `path`.

```js
var watcher = gulp.watch('js/**/*.js', gulp.parallel('concat', 'uglify'));
watcher.on('change', function(path, stats) {
  console.log('File ' + path + ' was changed');
});

watcher.on('unlink', function(path) {
  console.log('File ' + path + ' was removed');
});
```

### path
Type: `String`

Path to the file. If `opts.cwd` is set, `path` is relative to it.

### stats
Type: `Object`

[File stats][fs stats] object when available.
Setting the `alwaysStat` option to `true` will ensure that a file stat object will be
provided.

## watcher methods

### watcher.close()

Shuts down the file watcher.

### watcher.add(glob)

Watch additional glob (or array of globs) with an already-running watcher instance.

### watcher.unwatch(glob)

Stop watching a glob (or array of globs) while leaving the watcher running and
emitting events for the remaining paths it is watching.

[chokidar]: https://github.com/paulmillr/chokidar
[node-glob]: https://github.com/isaacs/node-glob
[fs stats]: https://nodejs.org/api/fs.html#fs_class_fs_stats
[async-completion]: https://github.com/gulpjs/async-done#completion-and-error-resolution
