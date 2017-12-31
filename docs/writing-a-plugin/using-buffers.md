# Using buffers

> Here is some information on creating gulp plugin that manipulates buffers.

[Writing a Plugin](README.md) > Using buffers

## Using buffers
If your plugin is relying on a buffer based library, you will probably choose to base your plugin around file.contents as a buffer. Let's implement a plugin prepending some text to files:

```js
var through = require('through2');
var PluginError = require('plugin-error');

// consts
const PLUGIN_NAME = 'gulp-prefixer';

// plugin level function (dealing with files)
function gulpPrefixer(prefixText) {
  if (!prefixText) {
    throw new PluginError(PLUGIN_NAME, 'Missing prefix text!');
  }

  prefixText = new Buffer(prefixText); // allocate ahead of time

  // creating a stream through which each file will pass
  var stream = through.obj(function(file, enc, cb) {
    if (file.isStream()) {
      this.emit('error', new PluginError(PLUGIN_NAME, 'Streams are not supported!'));
      return cb();
    }

    if (file.isBuffer()) {
      file.contents = Buffer.concat([prefixText, file.contents]);
    }

    // make sure the file goes through the next gulp plugin
    this.push(file);

    // tell the stream engine that we are done with this file
    cb();
  });

  // returning the file stream
  return stream;
};

// exporting the plugin main function
module.exports = gulpPrefixer;
```

The above plugin can be used like this:

```js
var gulp = require('gulp');
var gulpPrefixer = require('gulp-prefixer');

gulp.src('files/**/*.js')
  .pipe(gulpPrefixer('prepended string'))
  .pipe(gulp.dest('modified-files'));
```

## Handling streams

Unfortunately, the above plugin will error when using gulp.src in non-buffered (streaming) mode. You should support streams too if possible. See [Dealing with streams](dealing-with-streams.md) for more information.

## Some plugins based on buffers

* [gulp-coffee](https://github.com/contra/gulp-coffee)
* [gulp-svgmin](https://github.com/ben-eb/gulp-svgmin)
* [gulp-marked](https://github.com/lmtm/gulp-marked)
* [gulp-svg2ttf](https://github.com/nfroidure/gulp-svg2ttf)
