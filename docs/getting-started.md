## Getting Started

### 1. Install gulp globally:

```
npm install -g gulp
```

### 2. Install gulp and gulp-util in your project devDependencies:

```
npm install --save-dev gulp gulp-util
```

### 3. Create a `gulpfile.js` at the root of your project:

```javascript
var gulp = require('gulp');
var gutil = require('gulp-util');

gulp.task('default', function(){
  // place code for your default task here
});
```

### 4. Run gulp

```
gulp
```

The default task will run and do nothing.

To run individual tasks, use `gulp <task> <othertask>`

## Where do I go now?

You have an empty gulpfile and everything is installed. How do you REALLY get started? Check out the [recipes and articles section](README.md#articles-and-recipes) for more information

## .src, .watch, .dest, CLI args - How do I use these things?

For API specific documentation you can check out the [documentation for that](API.md)

## Available Plugins

The gulp community is growing, with new plugins being added daily. See the [main website](http://gulpjs.com/) for a complete list.
