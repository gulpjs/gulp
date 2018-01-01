# Getting Started

*If you've previously installed gulp globally, run `npm rm --global gulp` before following these instructions.* For more information, read this [Sip](https://medium.com/gulpjs/gulp-sips-command-line-interface-e53411d4467).

#### Check for Node and npm
Make sure that you've installed Node and npm before attempting to install gulp.

```sh
node --version
```
```sh
npm --version
```

#### Install the `gulp` command

```sh
npm install --global gulp-cli
```

#### Create a `package.json` in your project directory
If you don't have a package.json, create one. If you need help, run an `npm init` which will walk you through giving it a name, version, description, etc.


#### Install `gulp` in your devDependencies

Run this command in your project directory:

```sh
npm install --save-dev gulp@next
```

#### Create a `gulpfile`

In your project directory, create a file named `gulpfile.js` in your project root with these contents:

```js
var gulp = require('gulp');

gulp.task('default', defaultTask);

function defaultTask(done) {
  // place code for your default task here
  done();
}
```

#### Test it out

Run the gulp command in your project directory:

```sh
gulp
```

To run multiple tasks, you can use `gulp <task> <othertask>`.

#### Result

Voila! The default task will run and do nothing.

```sh
Using gulpfile ~/my-project/gulpfile.js
[11:15:51] Starting 'default'...
[11:15:51] Finished 'default' after 103 μs
```

## .src, .watch, .dest, .parallel, .series, CLI args - How do I use these things?

For API specific documentation, you can check out the [documentation for that](API.md).

## Where do I go now?

- [API Documentation](API.md) - The programming interface, defined
- [Recipes](recipes) - Specific examples from the community
- [In Depth Help](https://travismaynard.com/writing/getting-started-with-gulp) - A tutorial from the guy who wrote the book
- [Plugins](https://gulpjs.com/plugins/) - Building blocks for your gulp file
