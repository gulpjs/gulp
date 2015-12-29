## gulp API docs

* [gulp.src](#gulpsrcglobs-options) - Emit files matching one or more globs
* [gulp.dest](#gulpdestpath-options) - Write files to directories
* [gulp.symlink](#gulpsymlinkfolder-options) - Write files to symlinks
* [gulp.task](#gulptaskname-fn) - Define tasks
* [gulp.lastRun](#gulplastruntaskname-timeresolution) - Get timestamp of last successful run
* [gulp.parallel](#gulpparalleltasks) - Run tasks in parallel
* [gulp.series](#gulpseriestasks) - Run tasks in series
* [gulp.watch](#gulpwatchglob-opts-fn) - Do something when a file changes
* [gulp.tree](#gulptreeoptions) - Get the tree of tasks
* [gulp.registry](#gulpregistryregistry) - Get or set the task registry

### gulp.src(globs[, options])

Emits files matching provided glob or array of globs.
Returns a [stream] of [Vinyl files] that can be [piped] to plugins.

```js
gulp.src('client/templates/*.jade')
  .pipe(jade())
  .pipe(minify())
  .pipe(gulp.dest('build/minified_templates'));
```

`glob` refers to [node-glob syntax][node-glob] or it can be a direct file path.

#### globs
Type: `String` or `Array`

Glob or array of globs to read. Globs use the following syntax

"Globs" are the patterns you type when you do stuff like `ls *.js` on
the command line, or put `build/*` in a `.gitignore` file.

Before parsing the path part patterns, braced sections are expanded
into a set.  Braced sections start with `{` and end with `}`, with any
number of comma-delimited sections within.  Braced sections may contain
slash characters, so `a{/b/c,bcd}` would expand into `a/b/c` and `abcd`.

The following characters have special magic meaning when used in a
path portion:

* `*` Matches 0 or more characters in a single path portion
* `?` Matches 1 character
* `[...]` Matches a range of characters, similar to a RegExp range.
  If the first character of the range is `!` or `^` then it matches
  any character not in the range.
* `!(pattern|pattern|pattern)` Matches anything that does not match
  any of the patterns provided.
* `?(pattern|pattern|pattern)` Matches zero or one occurrence of the
  patterns provided.
* `+(pattern|pattern|pattern)` Matches one or more occurrences of the
  patterns provided.
* `*(a|b|c)` Matches zero or more occurrences of the patterns provided
* `@(pattern|pat*|pat?erN)` Matches exactly one of the patterns
  provided
* `**` If a "globstar" is alone in a path portion, then it matches
  zero or more directories and subdirectories searching for matches.
  It does not crawl symlinked directories.

### Dots

If a file or directory path portion has a `.` as the first character,
then it will not match any glob pattern unless that pattern's
corresponding path part also has a `.` as its first character.

For example, the pattern `a/.*/c` would match the file at `a/.b/c`.
However the pattern `a/*/c` would not, because `*` does not start with
a dot character.

You can make glob treat dots as normal characters by setting
`dot:true` in the options.

### Basename Matching

If you set `matchBase:true` in the options, and the pattern has no
slashes in it, then it will seek for any file anywhere in the tree
with a matching basename.  For example, `*.js` would match
`test/simple/basic.js`.

### Empty Sets

If no matching files are found, then an empty array is returned.  This
differs from the shell, where the pattern itself is returned.  For
example:

    $ echo a*s*d*f
    a*s*d*f

To get the bash-style behavior, set the `nonull:true` in the options.

### See Also:

* `man sh`
* `man bash` (Search for "Pattern Matching")
* `man 3 fnmatch`
* `man 5 gitignore`
* [minimatch documentation](https://github.com/isaacs/minimatch)
* [node-glob documentation](https://github.com/isaacs/node-glob)

Globbing is provided by [glob-stream](https://github.com/gulpjs/glob-stream) module. Please report any file watching problems directly to its [issue tracker](https://github.com/gulpjs/glob-stream/issues).

A glob that begins with `!` excludes matching files from the glob results up to that point. For example, consider this directory structure:

    client/
      a.js
      bob.js
      bad.js

The following expression matches `a.js` and `bad.js`:

    gulp.src(['client/*.js', '!client/b*.js', 'client/bad.js'])

You can pass any combination of globs. One caveat is that you can not only pass a glob negation, you must give it at least one positive glob so it knows where to start. All given must match for the file to be returned.

Globs are executed in order, so negations should follow positive globs. For example:

    gulp.src(['!b*.js', '*.js'])

would not exclude any files, but this would

    gulp.src(['*.js', '!b*.js'])

which means this is possible

```js
// exclude every JS file that starts with a b except bad.js
gulp.src(['*.js', '!b*.js', 'bad.js'])
```


#### options
Type: `Object`

Options to pass to [node-glob] through [glob-stream].


##### options.allowEmpty
Type: `Boolean`

Default: `false`

When true, will allow singular globs to fail to match. Otherwise, globs which are only supposed to match one file (such as `./foo/bar.js`) will cause an error to be thrown if they don't match.

```js
// Emits an error if app/scripts.js doesn't exist
gulp.src('app/scripts.js')
  .pipe(...);

// Won't emit an error
gulp.src('app/scripts.js', { allowEmpty: true })
  .pipe(...);
```


##### options.base
Type: `String`

Default: everything before a glob starts (see [glob2base])

E.g., consider `somefile.js` in `client/js/somedir`:

```js
// Matches 'client/js/somedir/somefile.js' and resolves `base` to `client/js/`
gulp.src('client/js/**/*.js')
  .pipe(minify())
  .pipe(gulp.dest('build'));  // Writes 'build/somedir/somefile.js'

gulp.src('client/js/**/*.js', { base: 'client' })
  .pipe(minify())
  .pipe(gulp.dest('build'));  // Writes 'build/js/somedir/somefile.js'
```


##### options.buffer
Type: `Boolean`

Default: `true`

Setting this to `false` will return `file.contents` as a stream and not
buffer files. This is useful when working with large files.

**Note:** Plugins might not implement support for streams.


##### options.cache
Type: `Object`
Default: Creates a new cache if none is provided

See cache property above. Pass in a previously generated cache object to save some fs calls.


##### options.cwd
Type:  `String`
Default: process.cwd()

The current working directory in which to search.


##### options.cwdbase
Type: `Boolean`
Default: `false`

When true it is the same as saying opt.base = opt.cwd


##### options.debug
Type: `Boolean`
Default: `false`

Set to enable debug logging.


##### options.dot
Type: `Boolean`
Default: `false`

Include .dot files in normal matches and globstar matches. Note that an explicit dot in a portion of the pattern will always match dot files.


##### options.follow
Type: `Boolean`
Default: `false`

Follow symlinked directories when expanding ** patterns. Note that this can result in a lot of duplicate references in the presence of cyclic links.


##### options.mark
Type: `Boolean`
Default: `false`

Add a / character to directory matches. Note that this requires additional stat calls.


##### options.matchBase
Type: `Boolean`
Default: `false`

Perform a basename-only match if the pattern does not contain any slash characters. That is, *.js would be treated as equivalent to **/*.js, matching all js files in all directories.


##### options.nobrace
Type: `Boolean`
Default: `false`

Do not expand {a,b} and {1..3} brace sets.


##### options.nodir
Type: `Boolean`
Default: `false`

Do not match directories, only files. (Note: to match only directories, simply put a / at the end of the pattern.)
ignore Add a pattern or an array of glob patterns to exclude matches. Note: ignore patterns are always in dot:true mode, regardless of any other settings.


##### options.noglobstar
Type: `Boolean`
Default: `false`

Do not match ** against multiple filenames. (i.e., treat it as a normal * instead.)


##### options.noext
Type: `Boolean`
Default: `false`

Do not match +(a|b) "extglob" patterns.


##### options.nocase
Type: `Boolean`
Default: `false`

Perform a case-insensitive match. Note: on case-insensitive filesystems, non-magic patterns will match by default, since stat and readdir will not raise errors.


##### options.nomount
Type: `Boolean`
Default: `false`

By default, a pattern starting with a forward-slash will be "mounted" onto the root setting, so that a valid filesystem path is returned. Set this flag to disable that behavior.


##### options.nonull
Type: `Boolean`
Default: `true`

Set to never return an empty set, instead returning a set containing the pattern itself.


##### options.nosort
Type: `Boolean`
Default: `false`

Don't sort the results.


##### options.passthrough
Type: `Boolean`

Default: `false`

If true, it will create a duplex stream which passes items through and
emits globbed files.


##### options.read
Type: `Boolean`

Default: `true`

Setting this to `false` will return `file.contents` as null and not read
the file at all.


##### options.realpath
Type: `Boolean`
Default: `false`

Set to true to call fs.realpath on all of the results. In the case of a symlink that cannot be resolved, the full absolute path to the matched entry is returned (though it will usually be a broken symlink)


##### options.root
Type: `String`
Default: path.resolve(options.cwd, "/") (/ on Unix systems, and C:\ or some such on Windows.)

The place where patterns starting with / will be mounted onto.


##### options.silent
Type: `Boolean`
Default: `false`

When an unusual error is encountered when attempting to read a directory, a warning will be printed to stderr. Set the silent option to true to suppress these warnings.


##### options.since
Type: `Date` or `Number`

Setting this to a Date or a time stamp will discard any file that have not been
modified since the time specified.


##### options.stat
Type: `Boolean`
Default: `false`

Set to true to stat all results. This reduces performance somewhat, and is completely unnecessary, unless readdir is presumed to be an untrustworthy indicator of file existence.


##### options.statCache
Type: `Object`
Default: Creates a new `statCache` if none is provided.

A cache of results of filesystem information, to prevent unnecessary stat calls. While it should not normally be necessary to set this, you may pass the statCache from one glob() call to the options object of another, if you know that the filesystem will not change between calls. (See "Race Conditions" below.)


##### options.strict
Type: `Boolean`
Default: `false`

When an unusual error is encountered when attempting to read a directory, the process will just continue on in search of other matches. Set the strict option to raise an error in these cases.


##### options.symlinks
Type: `Object`
Default: Creates a new symlink cache if none is provided.

A cache of known symbolic links. You may pass in a previously generated symlinks object to save lstat calls when resolving ** matches.


The full set of options is available on [glob-stream](https://github.com/gulpjs/glob-stream).


### gulp.dest(path[, options])

Can be piped to and it will write files. Re-emits all data passed to it so you
can pipe to multiple folders. Folders that don't exist will be created.

```js
gulp.src('./client/templates/*.jade')
  .pipe(jade())
  .pipe(gulp.dest('./build/templates'))
  .pipe(minify())
  .pipe(gulp.dest('./build/minified_templates'));
```

The write path is calculated by appending the file relative path to the given
destination directory. In turn, relative paths are calculated against the file base.
See `gulp.src` above for more info.

#### path
Type: `String` or `Function`

The path (output folder) to write files to. Or a function that returns it,
the function will be provided a [vinyl File instance].

#### options
Type: `Object`

##### options.cwd
Type: `String`

Default: `process.cwd()`

`cwd` for the output folder, only has an effect if provided output folder is
relative.

##### options.mode
Type: `String` or `Number`

Default: the mode of the input file (file.stat.mode) or the process mode
if the input file has no mode property.

Octal permission specifying the mode the files should be created with: e.g.
`"0744"`, `0744` or `484` (`0744` in base 10).

##### options.dirMode
Type: `String` or `Number`

Default: Default is the process mode.

Octal permission specifying the mode the directory should be created with: e.g.
`"0755"`, `0755` or `493` (`0755` in base 10).

##### options.overwrite
Type: `Boolean`

Default: `true`

Specify if existing files with the same path should be overwritten or not.


### gulp.symlink(folder[, options])

Functions exactly like `gulp.dest`, but will create symlinks instead of copying
a directory.

#### folder
Type: `String` or `Function`

A folder path or a function that receives in a file and returns a folder path.

#### options
Type: `Object`

##### options.cwd
Type: `String`

Default: `process.cwd()`

`cwd` for the output folder, only has an effect if provided output folder is
relative.

##### options.dirMode
Type: `String` or `Number`

Default: Default is the process mode.

Octal permission specifying the mode the directory should be created with: e.g.
`"0755"`, `0755` or `493` (`0755` in base 10).


### gulp.task([name,] fn)

Define a task exposed to gulp-cli, `gulp.series`, `gulp.parallel` and
`gulp.lastRun`; inherited from [undertaker].

```js
gulp.task(function someTask() {
  // Do stuff
});
```

Or get a task that has been registered.

```js
// someTask will be the registered task function
var someTask = gulp.task('someTask');
```

#### name

If the name is not provided, the task will be named after the function
`name` or `displayName` property. The name argument is required if the
`name` and `displayName` properties of `fn` are empty.

Since the task can be run from the command line, you should avoid using
spaces in task names.

#### fn

The function that performs the task's operations. Generally it takes this form:

```js
function someTask() {
  return gulp.src(['some/glob/**/*.ext']).pipe(someplugin());
}
someTask.description = 'Does something';

gulp.task(someTask)
```

Gulp tasks are asynchronous and Gulp uses [async-done] to wait for the task's
completion. Tasks are called with a callback parameter to call to signal
completion. Alternatively, Task can return a stream, a promise, a child process
or a RxJS observable to signal the end of the task.

**Warning:** Sync tasks are not supported and your function will never complete
if the one of the above strategies is not used to signal completion. However,
thrown errors will be caught by Gulp.

#### fn properties

##### fn.name

`gulp.task` names the task after the function `name` property
if the optional `name` parameter of `gulp.task` is not provided.

**Note:** [Function.name] is not writable; it cannot be set or edited. If
you need to assign a function name or use characters that aren't allowed
in function names, use the `displayName` property.
It will be empty for anonymous functions:

```js
function foo() {};
foo.name === 'foo' // true

var bar = function() {};
bar.name === '' // true

bar.name = 'bar'
bar.name === '' // true
```

##### fn.displayName

`gulp.task` names the task after the function `displayName` property
if function is anonymous and the optional `name` parameter of `gulp.task`
is not provided.

##### fn.description

gulp-cli prints this description alongside the task name when listing tasks:

```js
var gulp = require('gulp');

function test(done){
  done();
}
test.description = 'I do nothing';

gulp.task(test);
```

```sh
$> gulp --tasks
[12:00:02] Tasks for ~/Documents/some-project/gulpfile.js
[12:00:02] └── test  I do nothing
```

#### Async support

##### Accept a callback

```js
var del = require('del');

gulp.task('clean', function(done) {
  del(['.build/'], done);
});
```

The callback accepts an optional `Error` object. If it receives an error,
the task will fail.

##### Return a stream

```js
gulp.task('somename', function() {
  return gulp.src('client/**/*.js')
    .pipe(minify())
    .pipe(gulp.dest('build'));
});
```

##### Return a promise

```js
var Promise = require('promise');
var del = require('del');

gulp.task('clean', function() {
  return new Promise(function (resolve, reject) {
    del(['.build/'], function(err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
});
```

or:
```js
var promisedDel = require('promised-del');

gulp.task('clean', function() {
  return promisedDel(['.build/']);
});
```

##### Return a child process

```js
gulp.task('clean', function() {
  return spawn('rm', ['-rf', path.join(__dirname, 'build')]);
});

```

##### Return a [RxJS] observable

```js
var Observable = require('rx').Observable;

gulp.task('sometask', function() {
  return Observable.return(42);
});
```


### gulp.lastRun(taskName, [timeResolution])

Returns the timestamp of the last time the task ran successfully. The time
will be the time the task started. Returns `undefined` if the task has
not run yet.

#### taskName

Type: `String`

The name of the registered task or of a function.

#### timeResolution

Type: `Number`.

Default: `1000` on node v0.10, `0` on node v0.12 (and iojs v1.5).

Set the time resolution of the returned timestamps. Assuming
the task named "someTask" ran at `1426000004321`:

- `gulp.lastRun('someTask', 1000)` would return `1426000004000`.
- `gulp.lastRun('someTask', 100)` would return `1426000004300`.

`timeResolution` allows you to compare a run time to a file [mtime stat][fs stats]
attribute. This attribute time resolution may vary depending of the node version
and the file system used:

- on node v0.10, a file [mtime stat][fs stats] time resolution of any files will be 1s at best;
- on node v0.12 and iojs v1.5, 1ms at best;
- for files on FAT32, the mtime time resolution is 2s;
- on HFS+ and Ext3, 1s;
- on NTFS, 1s on node v0.10, 100ms on node 0.12;
- on Ext4, 1s on node v0.10, 1ms on node 0.12.


### gulp.parallel(...tasks)

Takes a number of task names or functions and returns a function of the composed
tasks or functions.

When using task names, the task should already be registered.

When the returned function is executed, the tasks or functions will be executed
in parallel, all being executed at the same time. If an error occurs,
all execution will complete.

```js
gulp.task('one', function(done) {
  // do stuff
  done();
});

gulp.task('two', function(done) {
  // do stuff
  done();
});

gulp.task('default', gulp.parallel('one', 'two', function(done) {
  // do more stuff
  done();
}));
```

#### tasks
Type: `Array`, `String` or `Function`

A task name, a function or an array of either.


### gulp.series(...tasks)

Takes a number of task names or functions and returns a function of the composed
tasks or functions.

When using task names, the task should already be registered.

When the returned function is executed, the tasks or functions will be executed
in series, each waiting for the prior to finish. If an error occurs,
execution will stop.

```js
gulp.task('one', function(done) {
  // do stuff
  done();
});

gulp.task('two', function(done) {
  // do stuff
  done();
});

gulp.task('default', gulp.series('one', 'two', function(done) {
  // do more stuff
  done();
}));
```

#### tasks
Type: `Array`, `String` or `Function`

A task name, a function or an array of either.


### gulp.watch(glob[, opts], fn)

Watch files and do something when a file changes.
File watching is provided by the [`chokidar`][chokidar] module.
Please report any file watching problems directly to its
[issue tracker](https://github.com/paulmillr/chokidar/issues).

```js
gulp.watch('js/**/*.js', gulp.parallel('uglify', 'reload'));
```

In the example, `gulp.watch` runs the function returned by gulp.parallel each
time a file with the `js` extension in `js/` is updated.

#### glob
Type: `String` or `Array`

A single glob or array of globs that indicate which files to watch for changes.

#### opts
Type: `Object`

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

#### fn
Type: `Function`

An [async](#async-support) function to run when a file changes.

`gulp.watch` returns a wrapped [chokidar] FSWatcher object. If provided,
the callback will be triggered upon any `add`, `change`, or `unlink` event.
Listeners can also be set directly for any of [chokidar]'s events, such as
`addDir`, `unlinkDir`, and `error`.

```js
var watcher = gulp.watch('js/**/*.js', gulp.parallel('uglify', 'reload'));
watcher.on('change', function(path, stats) {
  console.log('File ' + path + ' was changed');
});

watcher.on('unlink', function(path) {
  console.log('File ' + path + ' was removed');
});
```

##### path
Type: `String`

The relative path of the document.

##### stats
Type: `Object`

[File stats][fs stats] object when available.
Setting the `alwaysStat` option to `true` will ensure that a file stat object will be
provided.

#### watcher methods

##### watcher.close()

Shuts down the file watcher.

##### watcher.add(glob)

Watch additional glob (or array of globs) with an already-running watcher instance.

##### watcher.unwatch(glob)

Stop watching a glob (or array of globs) while leaving the watcher running and
emitting events for the remaining paths it is watching.


### gulp.tree(options)

Returns the tree of tasks. Inherited from [undertaker]. See the [undertaker docs for this function](https://github.com/phated/undertaker#treeoptions--object).

#### options
Type: `Object`

Options to pass to [undertaker].

##### options.deep
Type: `Boolean`

Default: `false`

If set to `true` whole tree should be returned.

#### Example gulpfile

```js
gulp.task('one', function(done) {
  // do stuff
  done();
});

gulp.task('two', function(done) {
  // do stuff
  done();
});

gulp.task('three', function(done) {
  // do stuff
  done();
});

gulp.task('four', gulp.series('one', 'two'));

gulp.task('five',
  gulp.series('four',
    gulp.parallel('three', function(done) {
      // do more stuff
      done();
    })
  )
);
```

#### Example tree output

```js
gulp.tree()

// output: [ 'one', 'two', 'three', 'four', 'five' ]

gulp.tree({ deep: true })

/*output: [
   {
      "label":"one",
      "type":"task",
      "nodes":[]
   },
   {
      "label":"two",
      "type":"task",
      "nodes":[]
   },
   {
      "label":"three",
      "type":"task",
      "nodes":[]
   },
   {
      "label":"four",
      "type":"task",
      "nodes":[
          {
            "label":"<series>",
            "type":"function",
            "nodes":[
               {
                  "label":"one",
                  "type":"task",
                  "nodes":[]
               },
               {
                  "label":"two",
                  "type":"task",
                  "nodes":[]
               }
            ]
         }
      ]
   },
   {
      "label":"five",
      "type":"task",
      "nodes":[
         {
            "label":"<series>",
            "type":"function",
            "nodes":[
               {
                  "label":"four",
                  "type":"task",
                  "nodes":[
                     {
                        "label":"<series>",
                        "type":"function",
                        "nodes":[
                           {
                              "label":"one",
                              "type":"task",
                              "nodes":[]
                           },
                           {
                              "label":"two",
                              "type":"task",
                              "nodes":[]
                           }
                        ]
                     }
                  ]
               },
               {
                  "label":"<parallel>",
                  "type":"function",
                  "nodes":[
                     {
                        "label":"three",
                        "type":"task",
                        "nodes":[]
                     },
                     {
                        "label":"<anonymous>",
                        "type":"function",
                        "nodes":[]
                     }
                  ]
               }
            ]
         }
      ]
   }
]
*/
```


### gulp.registry([registry])

Get or set the underlying task registry. Inherited from [undertaker]; see the undertaker documention on [registries](https://github.com/phated/undertaker#registryregistryinstance). Using this, you can change registries that enhance gulp in different ways. Utilizing a custom registry has at least three use cases:

- [Sharing tasks](https://github.com/phated/undertaker#sharing-tasks)
- [Sharing functionality](https://github.com/phated/undertaker#sharing-functionalities) (e.g. you could override the task prototype to add some additional logging, bind task metadata or include some config settings.)
- Handling other behavior that hooks into the registry lifecycle (see [gulp-hub](https://github.com/frankwallis/gulp-hub) for an example)

To build your own custom registry see the [undertaker documentation on custom registries](https://github.com/phated/undertaker#custom-registries).

#### registry

A registry instance. When passed in, the tasks from the current registry will be transferred to the new registry and then current registry will be replaced with the new registry.

#### Example

This example shows how to create and use a simple custom registry to add tasks.

```js
//gulpfile.js
var gulp = require('gulp');

var companyTasks = require('./myCompanyTasksRegistry.js');

gulp.registry(companyTasks);

gulp.task('one', gulp.parallel('someCompanyTask', function(done) {
  console.log('in task one');
  done();
}));
```

```js
//myCompanyTasksRegistry.js
var util = require('util');

var DefaultRegistry = require('undertaker-registry');

function MyCompanyTasksRegistry() {
  DefaultRegistry.call(this);
}
util.inherits(MyCompanyTasksRegistry, DefaultRegistry);

MyCompanyTasksRegistry.prototype.init = function(gulp) {
  gulp.task('clean', function(done) {
    done();
  });
  gulp.task('someCompanyTask', function(done) {
    console.log('performing some company task.');
    done();
  });
};

module.exports = new MyCompanyTasksRegistry();
```

[Function.name]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/name
[chokidar]: https://github.com/paulmillr/chokidar
[glob-stream]: https://github.com/wearefractal/glob-stream
[glob2base]: https://github.com/wearefractal/glob2base
[gulp-if]: https://github.com/robrich/gulp-if
[node-glob documentation]: https://github.com/isaacs/node-glob#options
[node-glob]: https://github.com/isaacs/node-glob
[piped]: http://nodejs.org/api/stream.html#stream_readable_pipe_destination_options
[RxJS]: https://www.npmjs.com/package/rx
[stream]: http://nodejs.org/api/stream.html
[async-done]: https://www.npmjs.com/package/async-done
[undertaker]: https://github.com/phated/undertaker
[vinyl File instance]: https://github.com/wearefractal/vinyl
[Vinyl files]: https://github.com/wearefractal/vinyl-fs
[fs stats]: https://nodejs.org/api/fs.html#fs_class_fs_stats
