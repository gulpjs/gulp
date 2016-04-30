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

These are known as [transform streams](http://nodejs.org/api/stream.html#stream_class_stream_transform_1) (also sometimes called through streams). Transform streams are streams that are readable and writable which manipulate objects as they're being passed through.

### Modifying file content

Vinyl files can have 3 possible forms for the contents attribute:

- [Streams](dealing-with-streams.md)
- [Buffers](using-buffers.md)
- Empty (null) - Useful for things like rimraf, clean, where contents is not needed.

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
