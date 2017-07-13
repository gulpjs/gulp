# Getting Started

*If you've [previously installed](https://medium.com/gulpjs/gulp-sips-command-line-interface-e53411d4467) gulp globally, run `npm rm --global gulp` before following these instructions.*

#### Check for Node and npm
Make sure that you've installed Node and npm before attempting to install gulp.

```node --version```

#### Install the `gulp` command

```sh
npm install --global gulp-cli
```

#### Create a package.json
If you don't have a package.json, create one. If you need help, run an npm init which will walk you through giving it a name, version, and description.


#### Install `gulp` in your devDependencies

Run this command in your project directory:

```sh
npm install --save-dev gulp
```

#### Create a `gulpfile`

In your project directory, create a file named `gulpfile.js` in your project root with these contents:

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

#### Result

Voila! The default task will run and do nothing.

```sh
Using gulpfile ~/my-project/gulpfile.js
[11:15:51] Starting 'default'...
[11:15:51] Finished 'default' after 103 μs
```

To run multiple tasks, you can use `gulp <task> <othertask>`.

## Where do I go now?

- [API Documentation](API.md)
- [Recipes](recipes)
- [Help Articles](README.md#articles)
- [Plugins](http://gulpjs.com/plugins/)
