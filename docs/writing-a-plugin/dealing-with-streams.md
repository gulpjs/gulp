# Dealing with streams

> It is highly recommended to write plugins supporting streams. Here is some information on creating a gulp plugin that supports streams.

> Make sure to follow the best practice regarging error handling and add the line that make the gulp plugin re-emit the first error catched during the transformation of the content

[Writing a Plugin](README.md) > Writing stream based plugins

## Dealing with streams

Let's implement a plugin prepending some text to files. This plugin supports all possible forms of file.contents.

```js
var through = require('through2');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;

// Consts
const PLUGIN_NAME = 'gulp-prefixer';

function prefixStream(prefixText) {
  var stream = through();
  stream.write(prefixText);
  return stream;
}

// Plugin level function (dealing with files)
function gulpPrefixer(prefixText) {

  if (!prefixText) {
    throw PluginError(PLUGIN_NAME, "Missing prefix text!");
  }
  prefixText = new Buffer(prefixText); // allocate ahead of time

  // Creating a stream through which each file will pass
  var stream = through.obj(function (file, enc, callback) {
    if (file.isNull()) {
      this.push(file); // Do nothing if no contents
      return callback();
    }

    if (file.isBuffer()) {
      this.emit('error', new PluginError(PLUGIN_NAME, 'Buffers not supported!'));
      return callback();
    }

    if (file.isStream()) {
      // define the streamer that will transform the content
      var streamer = prefixStream(prefixText);
      // catch errors from the streamer and emit a gulp plugin error
      streamer.on('error', this.emit.bind(this, 'error'));
      // start the transformation
      file.contents = file.contents.pipe(streamer);
      // make sure the file goes through the next gulp plugin
      this.push(file);
      // tell the stream engine that we are done with this file
      return callback();
    }
  });

  // returning the file stream
  return stream;
};

// Exporting the plugin main function
module.exports = gulpPrefixer;
```

The above plugin can be used like this:

```js
var gulp = require('gulp');
var gulpPrefixer = require('gulp-prefixer');

gulp.src('files/**/*.js')
  .pipe(gulpPrefixer('prepended string'))
  .pipe(gulp.dest('/modified-files/'));
```

## Some plugins using streams

* [gulp-svgicons2svgfont](https://github.com/nfroidure/gulp-svgiconstosvgfont)
* gulp-browserify (Soon)
