# Writing a plugin

If you plan to create your own Gulp plugin, you will save time by reading the full documentation.

* [Guidelines](guidelines.md) (a MUST read)
* [Using buffers](using-buffers.md)
* [Dealing with streams](dealing-with-streams.md)
* [Testing](testing.md)

## What it does

### Streaming file objects

A gulp plugin always returns a stream in [object mode](http://nodejs.org/api/stream.html#stream_object_mode) that does the following:

1. Takes in [vinyl File objects](http://github.com/wearefractal/vinyl)
2. Outputs [vinyl File objects](http://github.com/wearefractal/vinyl)

These are known as [transform streams](http://nodejs.org/api/stream.html#stream_class_stream_transform_1) 
(also sometimes called through streams). 
Transform streams are streams that are readable and writable which manipulate objects as they're being passed through.

eg:
```js
var Transform = require('transform');

module.exports = function() {
  // Monkey patch Transform or create your own subclass, implementing `_transform()` and optionally `_flush()`.
  var transformStream = new Transform({objectMode: true});
  /** 
   * @param {Buffer|string} file
   * @param {string=} encoding - ignored if file contains a Buffer
   * @param {function(Error, object)} callback - Call this function (optionally with an error argument and data) when you are done processing the supplied chunk.
   */
  transformStream._transform = function(file, encoding, callback) {
    var error = null, 
        output = file;
    callback(error, output);
    //TODO: what are we supposed to return?
  });
  
  return transformStream;
};
```

Many plugins use the [through2](https://github.com/rvagg/through2/) module to simplify their code:

```js
var through = require('through2');    // npm install --save through2

module.exports = function() {
  /** 
   * @param {Buffer|string} file
   * @param {string=} encoding - ignored if file contains a Buffer
   * @param {function(Error, object)} callback - Call this function (optionally with an error argument and data) when you are done processing the supplied chunk.
   * @this {Transform}
   */
  return through.obj(function(file, encoding, callback) {
    //TODO: what are we supposed to return?
  });
};
```

The stream returned from `through2()` is an instance of the [Transform](https://github.com/iojs/readable-stream/blob/master/lib/_stream_transform.js)
class, which extends [Duplex](https://github.com/iojs/readable-stream/blob/master/lib/_stream_duplex.js),
[Readable](https://github.com/iojs/readable-stream/blob/master/lib/_stream_readable.js)
(and then parasitically from Writable) and ultimately
[Stream](https://nodejs.org/api/stream.html).  If you need to parse additional options, you can use the alternative method:

```js
  return through2({objectMode: true /* other options... */}, function(file, encoding, callback) { ...
```
 
Supported options include:

* highWaterMark (defaults to 16)
* defaultEncoding (defaults to 'utf8')
* encoding - 'utf8', 'base64', 'utf16le', 'ucs2' etc.
    If specified, a [StringDecoder](https://github.com/rvagg/string_decoder/blob/master/index.js) `decoder` will be attached to the stream.
* readable {boolean}
* writable {boolean}
* allowHalfOpen {boolean} If set to false, then the stream will automatically end the readable side when the writable side ends and vice versa.

### Modifying file content

The function parameter that you pass to `through.obj()` is a [_transform](https://nodejs.org/api/stream.html#stream_transform_transform_chunk_encoding_callback)
function which will operate on the input `file`.  You may also provide an optional [_flush](https://nodejs.org/api/stream.html#stream_transform_flush_callback)
function if you need to emit a bit more data at the end of the stream.

From within your transform function call `this.push(outputChunk)` 0 or more times to pass along transformed output from the input `file`, 
depending on how much data you want to output.  
You don't need to call `this.push(output)` if you provide all output to the `callback()` function.

Call the `callback` function only when the current file (stream/buffer) is completely consumed. 
If an error is encountered, pass it as the first argument to the callback, otherwise set it to null. 
If you have passed all output data to `this.push()` you can omit the second argument to the callback.

eg:

```js
module.exports = function() {
  return through.obj(function(file, encoding, callback) {
    this.push("hello ");
    this.push("world!");
    
    callback();
    //TODO: what are we supposed to return?
  });
};

Vinyl files can have 3 possible forms for the contents attribute:

- [Streams](dealing-with-streams.md)
- [Buffers](using-buffers.md)
- Empty (null) - Useful for things like rimraf, clean, where contents is not needed.

eg: 
```js
var PluginError = require('gulp-util').PluginError;

// consts
var PLUGIN_NAME = 'gulp-example';

module.exports = function() {
    return through.obj(function(file, encoding, callback) {
        if (file.isNull()) {
            // nothing to do
            return callback(null, file);
        }

        if (file.isStream()) {
            // file.contents is a Stream - https://nodejs.org/api/stream.html
            this.emit('error', new PluginError(PLUGIN_NAME, 'Streams not supported!'));
            
            // or, if you can handle Streams:
            //file.contents = file.contents.pipe(...
            //return callback(null, file);
        } else if (file.isBuffer()) {
            // file.contents is a Buffer - https://nodejs.org/api/buffer.html
            this.emit('error', new PluginError(PLUGIN_NAME, 'Buffers not supported!'));
        
            // or, if you can handle Buffers:
            //file.contents = ...
            //return callback(null, file);
        }
    });
};
```

## Useful resources

* [File object](https://github.com/wearefractal/gulp-util/#new-fileobj)
* [PluginError](https://github.com/gulpjs/gulp-util#new-pluginerrorpluginname-message-options)
* [event-stream](https://github.com/dominictarr/event-stream)
* [BufferStream](https://github.com/nfroidure/BufferStream)
* [gulp-util](https://github.com/wearefractal/gulp-util)


## Sample plugins

* [sindresorhus' gulp plugins](https://github.com/search?q=%40sindresorhus+gulp-)
* [Fractal's gulp plugins](https://github.com/search?q=%40wearefractal+gulp-)
* [gulp-replace](https://github.com/lazd/gulp-replace)


## About streams

If you're unfamiliar with streams, you will need to read up on them:

* https://github.com/substack/stream-handbook (a MUST read)
* http://nodejs.org/api/stream.html

Other libraries that are not file manipulating through streams but are made for use with gulp are tagged with the [gulpfriendly](https://npmjs.org/browse/keyword/gulpfriendly) keyword on npm.
