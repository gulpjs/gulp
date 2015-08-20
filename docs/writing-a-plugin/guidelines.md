# Guidelines

> While these guidelines are totally optional, we **HIGHLY** recommend that everyone follows them. Nobody wants to use a bad plugin. These guidelines will actually help make your life easier by giving you assurance that your plugin fits well within gulp.

[Writing a Plugin](README.md) > Guidelines

1. Your plugin should not do something that can be done easily with an existing node module
  - For example: deleting a folder does not need to be a gulp plugin. Use a module like [del](https://github.com/sindresorhus/del) within a task instead.
  - Wrapping every possible thing just for the sake of wrapping it will pollute the ecosystem with low quality plugins that don't make sense within the gulp paradigm.
  - gulp plugins are for file-based operations! If you find yourself shoehorning a complex process into streams just make a normal node module instead.
  - A good example of a gulp plugin would be something like gulp-coffee. The coffee-script module does not work with Vinyl out of the box, so we wrap it to add this functionality and abstract away pain points to make it work well within gulp.
1. Your plugin should only do **one thing**, and do it well.
  - Avoid config options that make your plugin do completely different tasks
  - For example: A JS minification plugin should not have an option that adds a header as well
1. Your plugin shouldn't do things that other plugins are responsible for
  - It should not concat, [gulp-concat](https://github.com/wearefractal/gulp-concat) does that
  - It should not add headers, [gulp-header](https://github.com/godaddy/gulp-header) does that
  - It should not add footers, [gulp-footer](https://github.com/godaddy/gulp-footer) does that
  - If it's a common but optional use case, document that your plugin is often used with another plugin
  - Make use of other plugins within your plugin! This reduces the amount of code you have to write and ensures a stable ecosystem.
1. Your plugin **must be tested**
  - Testing a gulp plugin is easy, you don't even need gulp to test it
  - Look at other plugins for examples
1. Add `gulpplugin` as a keyword in your `package.json` so you show up on our search
1. Do not throw errors inside a stream
  - Instead, you should emit it as an **error** event.
  - If you encounter an error **outside** the stream, such as invalid configuration while creating the stream, you may throw it.
1. Prefix any errors with the name of your plugin
  - For example: `gulp-replace: Cannot do regexp replace on a stream`
  - Use gulp-util's [PluginError](https://github.com/gulpjs/gulp-util#new-pluginerrorpluginname-message-options) class to make this easy
1. Name your plugin appropriately: it should begin with "gulp-" if it is a gulp plugin
  - If it is not a gulp plugin, it should not begin with "gulp-"
1. The type of `file.contents` should always be the same going out as it was when it came in
  - If file.contents is null (non-read) just ignore the file and pass it along
  - If file.contents is a Stream and you don't support that just emit an error
    - Do not buffer a stream to shoehorn your plugin to work with streams. This will cause horrible things to happen.
1. Do not pass the `file` object downstream until you are done with it
1. Use [`file.clone()`](https://github.com/wearefractal/vinyl#clone) when cloning a file or creating a new one based on a file.
1. Use modules from our [recommended modules page](recommended-modules.md) to make your life easier
1. Do NOT require `gulp` as a dependency or peerDependency in your plugin
  - Using gulp to test or automate your plugin workflow is totally cool, just make sure you put it as a devDependency
  - Requiring gulp as a dependency of your plugin means that anyone who installs your plugin is also installing a new gulp and its entire dependency tree.
  - There is no reason you should be using gulp within your actual plugin code. If you find yourself doing this open an issue so we can help you out.

## Why are these guidelines so strict?

gulp aims to be simple for users. By providing strict guidelines we are able to provide a consistent and high-quality ecosystem for everyone. While this does add a little more work and thought for plugin authors, it removes a lot of problems later down the road.

### What happens if I don't follow them?

npm is open for everyone, and you are free to make whatever you want but these guidelines were prescribed for a reason. There are acceptance tests coming soon that will be integrated into the plugin search. If you fail to adhere to the plugin guidelines it will be publicly visible/sortable via a scoring system. People will always prefer to use plugins that match "the gulp way".

### What does a good plugin look like?

```js
// through2 is a thin wrapper around node transform streams
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

// Plugin level function(dealing with files)
function gulpPrefixer(prefixText) {

  if (!prefixText) {
    throw new PluginError(PLUGIN_NAME, 'Missing prefix text!');
  }
  prefixText = new Buffer(prefixText); // allocate ahead of time

  // Creating a stream through which each file will pass
  return through.obj(function(file, enc, cb) {
    if (file.isNull()) {
      // return empty file
      return cb(null, file);
    }
    if (file.isBuffer()) {
      file.contents = Buffer.concat([prefixText, file.contents]);
    }
    if (file.isStream()) {
      file.contents = file.contents.pipe(prefixStream(prefixText));
    }

    cb(null, file);

  });

}

// Exporting the plugin main function
module.exports = gulpPrefixer;
```
