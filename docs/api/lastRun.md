<!-- front-matter
id: api-lastRun
title: lastRun()
hide_title: true
sidebar_label: lastRun()
-->

# `gulp.lastRun(taskName, [timeResolution])`

Returns the timestamp of the last time the task ran successfully. The time
will be the time the task started. Returns `undefined` if the task has
not run yet.

## taskName

Type: `String`

The name of the registered task or of a function.

## timeResolution

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

[fs stats]: https://nodejs.org/api/fs.html#fs_class_fs_stats
