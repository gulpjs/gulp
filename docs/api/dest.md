<!-- front-matter
id: api-dest
title: dest()
hide_title: true
sidebar_label: dest()
-->

# `gulp.dest(path[, options])`

Can be piped to and it will write files. Re-emits all data passed to it so you
can pipe to multiple folders. Folders that don't exist will be created.

```javascript
gulp.src('./client/templates/*.pug')
  .pipe(pug())
  .pipe(gulp.dest('./build/templates'))
  .pipe(minify())
  .pipe(gulp.dest('./build/minified_templates'));
```

The write path is calculated by appending the file relative path to the given
destination directory. In turn, relative paths are calculated against
the file base. See `gulp.src` above for more info.

## path
Type: `String` or `Function`

The path (output folder) to write files to. Or a function that returns it,
the function will be provided a [vinyl File instance].

## options
Type: `Object`

### options.cwd
Type: `String`

Default: `process.cwd()`

`cwd` for the output folder, only has an effect if provided output folder is
relative.

### options.mode
Type: `String` or `Number`

Default: the mode of the input file (file.stat.mode) or the process mode
if the input file has no mode property.

Octal permission specifying the mode the files should be created with: e.g.
`"0744"`, `0744` or `484` (`0744` in base 10).

### options.dirMode
Type: `String` or `Number`

Default: Default is the process mode.

Octal permission specifying the mode the directory should be created with: e.g.
`"0755"`, `0755` or `493` (`0755` in base 10).

### options.overwrite
Type: `Boolean`

Default: `true`

Specify if existing files with the same path should be overwritten or not.

[vinyl File instance]: https://github.com/gulpjs/vinyl
