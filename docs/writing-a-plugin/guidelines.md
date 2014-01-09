# Guidelines

> While these guidelines are totally optional, we **HIGHLY** recommend that everyone follows them. Nobody wants to use a bad plugin. These guidelines will actually help make your life easier by giving you assurance that your plugin fits well within gulp.

[Writing a Plugin](README.md) > Guidelines

1. Your plugin should not do something that can be done easily with an existing node module
  - Wrapping every possible thing just for the sake of wrapping it will pollute the ecosystem with low quality plugins that don't make sense
1. Your plugin should only do **one thing**, and do it well.
  - Avoid config options that make your plugin do completely different tasks
1. Your plugin shouldn't do things that other plugins are responsible for
  - It should not concat, [gulp-concat](https://github.com/wearefractal/gulp-concat) does that
  - It should not add headers, [gulp-header](https://github.com/godaddy/gulp-header) does that
  - It should not add footers, [gulp-footer](https://github.com/godaddy/gulp-footer) does that
  - If it's a common but optional use case, document that your plugin is often used with another plugin
  - If it's an internal requirement, make use of existing plugins by piping your plugin's output to them
1. Your plugin **must be tested**
  - Testing a gulp plugin is easy, you don't even need gulp to test it
  - Look at other plugins for examples
1. Add `gulpplugin` as a keyword in your `package.json` so you show up on our search
1. Do not throw errors inside a stream
  - Instead, you should emit it as an **error** event.
  - If you encounter an error **outside** the stream, such as invalid configuration, you may throw it.
1. Prefix any errors with the name of your plugin
  - For example: `gulp-replace: Cannot do regexp replace on a stream`
  - Use gulp-util's [PluginError](https://github.com/gulpjs/gulp-util#new-pluginerrorpluginname-message-options) class to make this easy
1. The type of `file.contents` should always be the same going out as it was when it came in
  - If file.contents is null (non-read) just ignore the file and pass it along
  - If file.contents is a Stream and you don't support that just emit an error
  - If you choose to support file.contents as a Stream, use [BufferStream](https://github.com/nfroidure/BufferStream) to make this easy
1. Do not pass the `file` object downstream until you are done with it
1. Make use of the [gulp-util](https://github.com/gulpjs/gulp-util) library
  - It provides templating, CLI colors, logging, changing file extensions
  - Try looking for common things there first and add it if it doesn't exist
1. Do NOT require `gulp` as a dependency or peerDependency
  - There is no reason you should have to do this and it will cause problems if you do

## Why are these guidelines so strict?

gulp aims to be simple for users. By providing strict guidelines we are able to provide a consistent and high-quality ecosystem for everyone. While this does add a little more work and thought for plugin authors, it removes a lot of problems later down the road.

### What happens if I don't follow them?

npm is open for everyone, and you are free to make whatever you want but these guidelines were prescribed for a reason. There are acceptances tests coming soon that will be integrated into the plugin search. If you fail to adhere to the plugin guidelines it will be publicly visible/sortable via a scoring system. People will always prefer to use plugins that match "the gulp way".

### What does a good plugin look like?

```js
var through = require('through');
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
  var stream = through(function (file) {
    if (file.isNull()) return this.queue(file); // Do nothing if no contents

    if (file.isBuffer()) {
      file.contents = Buffer.concat([prefixText, file.contents]);
      return this.queue(file);
    }

    if (file.isStream()) {
      file.contents = file.contents.pipe(prefixStream(prefixText));
      return this.queue(file);
    }
  });

  // returning the file stream
  return stream;
};

// Exporting the plugin main function
module.exports = gulpPrefixer;
```
