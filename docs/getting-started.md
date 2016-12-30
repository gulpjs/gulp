# Getting Started

*If you've previously installed a version of gulp globally, run `npm rm --global gulp` before following these instructions.*

#### Install the `gulp` command

```sh
npm install --global gulp-cli
```

#### Install `gulp` in your devDependencies

Run this command in your project directory:

```sh
npm install --save-dev gulp
```

#### Create a `gulpfile`

Create a file called `gulpfile.js` in your project root with these contents:

```js
var gulp = require('gulp');

gulp.task('default', function() {
  // place code for your default task here
});
```

#### Test it out

Run the gulp command in your project directory:

```sh
gulp
```

Voila! The default task will run and do nothing.

To run multiple tasks, you can use `gulp <task> <othertask>`.

## Where do I go now?

You have an empty gulpfile and everything is installed. Check out the [recipes](recipes) and the [list of articles](README.md#articles) for more information.

## .src, .watch, .dest, CLI args - How do I use these things?

For API specific documentation you can check out the [documentation for that](API.md).

## Available Plugins

The gulp community is growing, with new plugins being added daily. See the [main website](http://gulpjs.com/plugins/) for a complete list.
