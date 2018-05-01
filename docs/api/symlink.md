<!-- front-matter
id: api-symlink
title: symlink()
hide_title: true
sidebar_label: symlink()
-->

# `gulp.symlink(folder[, options])`

Functions exactly like `gulp.dest`, but will create symlinks instead of copying
a directory.

## folder
Type: `String` or `Function`

A folder path or a function that receives in a file and returns a folder path.

## options
Type: `Object`

### options.cwd
Type: `String`

Default: `process.cwd()`

`cwd` for the output folder, only has an effect if provided output folder is
relative.

### options.dirMode
Type: `String` or `Number`

Default: Default is the process mode.

Octal permission specifying the mode the directory should be created with: e.g.
`"0755"`, `0755` or `493` (`0755` in base 10).
