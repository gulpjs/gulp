# gulp changelog

## [5.0.0](https://www.github.com/gulpjs/gulp/compare/v4.0.2...v5.0.0) (2024-03-29)

We've tried to provide a high-level changelog for gulp v5 below, but it
doesn't contain all changes from the 60+ dependencies that we maintain.

Please see [individual changelogs](#individual-changelogs) to drill down
into all changes that were made.

### ⚠ BREAKING CHANGES

* Drop support for Node.js <10.13
* Default stream encoding to UTF-8
* Standardized on `anymatch` library for globbing paths. All globs should work the same between `src` and `watch` now!
* Removed support for ordered globs. This aligns with the chokidar globbing implementation. If you need your globs to be ordered, you can use `ordered-read-stream`
* All globs and paths are normalized to unix-like filepaths
* Only allow JS variants for `.gulp.*` config files
* Removed support for alpha releases of v4 from `gulp-cli`
* Removed the `--verify` flag
* Renamed the `--require` flag to `--preload` to avoid conflicting with Node.js flags
* Removed many legacy and deprecated loaders
* Upgrade to chokidar v3
* Clone `Vinyl` objects with stream contents using `teex`, but no longer wait for all streams to flow before cloned streams will receive data
* Stop using `process.umask()` to make directories, instead falling back to Node's default mode
* Throw on non-function, non-string option coercers
* Drop support of Node.js snake_case flags
* Use a Symbol for attaching the `gulplog` namespace to the store
* Use a Symbol for attaching the `gulplog` store to the global
* Use sha256 to hash the `v8flags` cache into a filename

### Features

* Streamlined the dependency tree
* Switch all streams implementation to Streamx
* Rewrote `glob-stream` to use a custom directory walk that relies on newer Node.js features and is more performant than old implementation
* Implement translation support for all CLI messages and all messages passing through gulplog
* Allow users to customize or remove the timestamp from their logs
* Upgraded gulplog to v2. Messages logged via v1 will also display a deprecated warning. Plugins should update to v2 as the community upgrades to gulp 5
* Added support for `gulpile.cjs` and `gulpfile.mjs`
* Add support for `swc`, `esbuild`, `sucrase`, and `mdx` loaders
* Provide an ESM export ([#2760](https://www.github.com/gulpjs/gulp/issues/2760)) ([b00de68](https://www.github.com/gulpjs/gulp/commit/b00de681f5ef6ade283d544f62f770f6b27a9e52))
* Support sourcemap handling on streaming `Vinyl` contents
* Support `extends` syntax for `.gulp.*` config file
* Allow overriding `gulpfile` and `preloads` via `.gulp.*` config file

### Bug Fixes

* Resolve bugs related to symlinks on various platforms
* Resolved some reported ReDoS CVEs and improved performance in glob-parent
* Rework errors surfaced when encountering files or symlinks when trying to create directories
* Ensure watch allows japanese characters in globs ([72668c6](https://www.github.com/gulpjs/gulp/commit/72668c61e445c81fad23bc6ed24967a3238a648d))
* Ensure watch does not trigger on negated globs ([72668c6](https://www.github.com/gulpjs/gulp/commit/72668c61e445c81fad23bc6ed24967a3238a648d))
* Improve handling of BOM at the beginning of a stream
* Properly handle function coercer in array of option coercers
* Fork `to-absolute-glob` to:
  - Check negative patterns before trimming
  - Ensure glob-like characters are escaped in cwd & root options
  - Resolve `../` at the beginning of globs

### Miscellaneous Chores

* Remove lazystream dependency
* Updated various stream test suites to test against Node.js core `stream`, `readable-stream`, and `streamx`
* Normalize repository, dropping node <10.13 support ([#2758](https://www.github.com/gulpjs/gulp/issues/2758)) ([72668c6](https://www.github.com/gulpjs/gulp/commit/72668c61e445c81fad23bc6ed24967a3238a648d))

### Individual Changelogs

We created and maintain various projects that gulp depends upon. You can find their changelogs linked below:

* [undertaker](https://github.com/gulpjs/undertaker/blob/master/CHANGELOG.md#200-2024-03-22)
* [vinyl-fs](https://github.com/gulpjs/vinyl-fs/blob/master/CHANGELOG.md#400-2023-06-11)
* [glob-stream](https://github.com/gulpjs/glob-stream/blob/master/CHANGELOG.md#801-2024-03-25)
* [gulp-cli](https://github.com/gulpjs/gulp-cli/blob/master/CHANGELOG.md#300-2024-03-24)
* [interpret](https://github.com/gulpjs/interpret/blob/master/CHANGELOG.md#311-2022-06-29)
* [glob-parent](https://github.com/gulpjs/glob-parent/blob/main/CHANGELOG.md#602-2021-09-29)
* [glob-watcher](https://github.com/gulpjs/glob-watcher/blob/master/CHANGELOG.md#600-2023-05-31)
* [vinyl](https://github.com/gulpjs/vinyl/blob/master/CHANGELOG.md#300-2022-09-26)
* [fs-mkdirp-stream](https://github.com/gulpjs/fs-mkdirp-stream/blob/master/CHANGELOG.md#201-2022-09-17)
* [lead](https://github.com/gulpjs/lead/blob/master/CHANGELOG.md#400-2022-09-22)
* [vinyl-sourcemap](https://github.com/gulpjs/vinyl-sourcemap/blob/master/CHANGELOG.md#200-2022-10-17)
* [to-through](https://github.com/gulpjs/to-through/blob/master/CHANGELOG.md#300-2022-09-07)
* [resolve-options](https://github.com/gulpjs/resolve-options/blob/master/CHANGELOG.md#200-2022-06-24)
* [remove-bom-stream](https://github.com/gulpjs/remove-bom-stream/blob/master/CHANGELOG.md#200-2022-04-19)
* [value-or-function](https://github.com/gulpjs/value-or-function/blob/master/CHANGELOG.md#400-2022-01-30)
* [now-and-later](https://github.com/gulpjs/now-and-later/blob/master/CHANGELOG.md#300-2022-06-25)
* [@gulpjs/to-absolute-glob](https://github.com/gulpjs/to-absolute-glob/blob/master/CHANGELOG.md#400-2023-01-03)
* [fined](https://github.com/gulpjs/fined/blob/master/CHANGELOG.md#200-2021-10-31)
* [mute-stdout](https://github.com/gulpjs/mute-stdout/blob/master/CHANGELOG.md#200-2021-11-22)
* [semver-greatest-satisfied-range](https://github.com/gulpjs/semver-greatest-satisfied-range/blob/master/CHANGELOG.md#200-2022-01-31)
* [flagged-respawn](https://github.com/gulpjs/flagged-respawn/blob/master/CHANGELOG.md#200-2021-11-21)
* [rechoir](https://github.com/gulpjs/rechoir/blob/master/CHANGELOG.md#080-2021-07-24)
* [gulplog](https://github.com/gulpjs/gulplog/blob/master/CHANGELOG.md#220-2024-03-23)
* [glogg](https://github.com/gulpjs/glogg/blob/master/CHANGELOG.md#220-2024-03-23)
* [@gulpjs/messages](https://github.com/gulpjs/messages/blob/master/CHANGELOG.md#110-2024-03-24)
* [sparkles](https://github.com/gulpjs/sparkles/blob/master/CHANGELOG.md#210-2024-03-23)
* [liftoff](https://github.com/gulpjs/liftoff/blob/main/CHANGELOG.md#500-2024-03-16)
* [v8flags](https://github.com/gulpjs/v8flags/blob/master/CHANGELOG.md#401-2023-09-03)
* [bach](https://github.com/gulpjs/bach/blob/master/CHANGELOG.md#201-2022-08-29)
* [undertaker-registry](https://github.com/gulpjs/undertaker-registry/blob/master/CHANGELOG.md#200-2021-12-29)
* [async-settle](https://github.com/gulpjs/async-settle/blob/master/CHANGELOG.md#200-2022-06-25)
* [last-run](https://github.com/gulpjs/last-run/blob/master/CHANGELOG.md#200-2022-01-10)
* [async-done](https://github.com/gulpjs/async-done/blob/master/CHANGELOG.md#200-2022-06-25)
* [replace-homedir](https://github.com/gulpjs/replace-homedir/blob/master/CHANGELOG.md#200-2022-01-31)

## 4.0.0

### Task system changes

- replaced 3.x task system (orchestrator) with new task system (bach)
  - removed gulp.reset
  - removed 3 argument syntax for `gulp.task`
  - `gulp.task` should only be used when you will call the task with the CLI
  - added `gulp.series` and `gulp.parallel` methods for composing tasks. Everything must use these now.
  - added single argument syntax for `gulp.task` which allows a named function to be used as the name of the task and task function.
  - added `gulp.tree` method for retrieving the task tree. Pass `{ deep: true }` for an `archy` compatible node list.
  - added `gulp.registry` for setting custom registries.

### CLI changes

- split CLI out into a module if you want to save bandwidth/disk space. you can install the gulp CLI using either `npm install gulp -g` or `npm install gulp-cli -g`, where gulp-cli is the smaller one (no module code included)
- add `--tasks-json` flag to CLI to dump the whole tree out for other tools to consume
- added `--verify` flag to check the dependencies in package.json against the plugin blacklist.

### vinyl/vinyl-fs changes

- added `gulp.symlink` which functions exactly like `gulp.dest`, but symlinks instead.
- added `dirMode` param to `gulp.dest` and `gulp.symlink` which allows better control over the mode of the destination folder that is created.
- globs passed to `gulp.src` will be evaluated in order, which means this is possible `gulp.src(['*.js', '!b*.js', 'bad.js'])` (exclude every JS file that starts with a b except bad.js)
- performance for gulp.src has improved massively
  - `gulp.src(['**/*', '!b.js'])` will no longer eat CPU since negations happen during walking now
- added `since` option to `gulp.src` which lets you only match files that have been modified since a certain date (for incremental builds)
- fixed `gulp.src` not following symlinks
- added `overwrite` option to `gulp.dest` which allows you to enable or disable overwriting of existing files

## 3.9.1

- update interpret to 1.0.0 (support for babel-register)
- fix to include manpages in published tarball
- documentation/recipe updates

## 3.9.0

- add babel support
- add transpiler fallback support
- add support for some renamed transpilers: livescript, etc
- add JSCS
- update dependencies (liftoff, interpret)
- documentation tweaks

## 3.8.11

- fix node 0.12/iojs problems
- add node 0.12 and iojs to travis
- update dependencies (liftoff, v8flags)
- documentation tweaks

## 3.8.10

- add link to spanish docs
- update dependencies (archy, semver, mocha, etc)
- documentation tweaks

## 3.8.9

- fix local version undefined output
- add completion for fish shell
- fix powershell completion line splitting
- add support for arbitrary node flags (oops, should have been a minor bump)
- add v8flags dependency
- update dependencies (liftoff)
- documentation tweaks

## 3.8.8

- update dependencies (minimist, tildify)
- documentation tweaks

## 3.8.7

- handle errors a bit better
- update dependencies (gulp-util, semver, etc)
- documentation tweaks

## 3.8.6

- remove executable flag from LICENSE
- update dependencies (chalk, minimist, liftoff, etc)
- documentation tweaks

## 3.8.5

- simplify --silent and --tasks-simple
- fix bug in autocomplete where errors would come out

## 3.8.4

- CLI will use exit code 1 on exit when any task fails during the lifetime of the process


## 3.8.3

- Tweak error formatting to work better with PluginErrors and strings

## 3.8.2

- add manpage generation

## 3.8.1

- the CLI now adds process.env.INIT_CWD which is the original cwd it was launched from

## 3.8.0

- update vinyl-fs
  - gulp.src is now a writable passthrough, this means you can use it to add files to your pipeline at any point
  - gulp.dest can now take a function to determine the folder

This is now possible!

```js
gulp.src('lib/*.js')
  .pipe(uglify())
  .pipe(gulp.src('styles/*.css'))
  .pipe(gulp.dest(function(file){
    // I don't know, you can do something cool here
    return 'build/whatever';
  }));
```

## 3.7.0

- update vinyl-fs to remove BOM from UTF8 files
- add --tasks-simple flag for plaintext task listings
- updated autocomplete scripts to be simpler and use new --tasks-simple flag
- added support for transpilers via liftoff 0.11 and interpret
  - just npm install your compiler (coffee-script for example) and it will work out of the box

## 3.5.5

- update deps
- gulp.dest now support mode option, uses source file mode by default (file.stat.mode)
- use chalk for colors in bin
- update gulp.env deprecation msg to be more helpful


## 3.5.2

- add -V for version on CLI (unix standard)
- -v is deprecated, use -V
- add -T as an alias for --tasks
- documentation

## 3.5

- added `gulp.watch(globs, tasksArray)` sugar
- remove gulp.taskQueue
- deprecate gulp.run
- deprecate gulp.env
- add engineStrict to prevent people with node < 0.9 from installing

## 3.4

- added `--tasks` that prints out the tree of tasks + deps
- global cli + local install mismatch is no longer fatal
- remove tests for fs stuff
- switch core src, dest, and watch to vinyl-fs
- internal cleaning

## 3.3.4

- `--base` is now `--cwd`

## 3.3.3

- support for `--base` CLI arg to change where the search for gulpfile/`--require`s starts
- support for `--gulpfile` CLI arg to point to a gulpfile specifically

## 3.3.0

- file.contents streams are no longer paused coming out of src
- dest now passes files through before they are empty to fix passing to multiple dests

## 3.2.4

- Bug fix - we didn't have any CLI tests

## 3.2.3

- Update dependencies for bug fixes
- autocomplete stuff in the completion folder

## 3.2

- File object is now [vinyl](https://github.com/wearefractal/vinyl)
- .watch() is now [glob-watcher](https://github.com/wearefractal/glob-watcher)
- Fix CLI -v when no gulpfile found
- gulp-util updated
- Logging moved to CLI bin file
  - Will cause double logging if you update global CLI to 3.2 but not local
  - Will cause no logging if you update local to 3.1 but not global CLI
- Drop support for < 0.9

## 3.1.3

- Move isStream and isBuffer to gulp-util

## 3.1

- Move file class to gulp-util

## 3.0

- Ability to pass multiple globs and glob negations to glob-stream
- Breaking change to the way glob-stream works
- File object is now a class
- file.shortened changed to file.relative
- file.cwd added
- Break out getStats to avoid nesting
- Major code reorganization

## 2.7

- Breaking change to the way options are passed to glob-stream
- Introduce new File object to ease pain of computing shortened names (now a getter)

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
