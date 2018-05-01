<!-- front-matter
id: api-src
title: src()
hide_title: true
sidebar_label: src()
-->

# `gulp.src(globs[, options])`

Emits files matching provided glob or array of globs.
Returns a [stream] of [Vinyl files] that can be [piped] to plugins.

```javascript
gulp.src('client/templates/*.pug')
  .pipe(pug())
  .pipe(minify())
  .pipe(gulp.dest('build/minified_templates'));
```

`glob` refers to [node-glob syntax][node-glob] or it can be a direct file path.

## globs
Type: `String` or `Array`

Glob or array of globs to read. Globs use [node-glob syntax] except that negation is fully supported.

A glob that begins with `!` excludes matching files from the glob results up to that point. For example, consider this directory structure:

    client/
      a.js
      bob.js
      bad.js

The following expression matches `a.js` and `bad.js`:

    gulp.src(['client/*.js', '!client/b*.js', 'client/bad.js'])


Note that globs are evaluated in order, which means this is possible:

```js
// exclude every JS file that starts with a b except bad.js
gulp.src(['*.js', '!b*.js', 'bad.js'])
```

**Note:** glob symlink following behavior is opt-in and you must specify
`follow: true` in the options object that is passed to [node-glob].

## options
Type: `Object`

Options to pass to [node-glob] through [glob-stream].

gulp adds some additional options in addition to the
[options supported by node-glob][node-glob documentation] and [glob-stream]:

### options.cwd

The working directory the folder is relative to.

Type: `String`

Default: `process.cwd()`


### options.buffer
Type: `Boolean`

Default: `true`

Setting this to `false` will return `file.contents` as a stream and not
buffer files. This is useful when working with large files.

**Note:** Plugins might not implement support for streams.

### options.read
Type: `Boolean`

Default: `true`

Setting this to `false` will return `file.contents` as null and not read
the file at all.

### options.base
Type: `String`

Default: everything before a glob starts (see [glob-parent])

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

### options.since
Type: `Date` or `Number`

Setting this to a Date or a time stamp will discard any file that have not been
modified since the time specified.

### options.passthrough
Type: `Boolean`

Default: `false`

If true, it will create a duplex stream which passes items through and
emits globbed files.

### options.allowEmpty
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

[glob-stream]: https://github.com/gulpjs/glob-stream
[glob-parent]: https://github.com/es128/glob-parent
[node-glob documentation]: https://github.com/isaacs/node-glob#options
[node-glob]: https://github.com/isaacs/node-glob
[piped]: http://nodejs.org/api/stream.html#stream_readable_pipe_destination_options
[stream]: http://nodejs.org/api/stream.html
[Vinyl files]: https://github.com/gulpjs/vinyl-fs
