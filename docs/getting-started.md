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

This file is just a jumping off point. Check out some [recipes](recipes) if you need more samples to get started.

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

The default tasks will run and gulp will watch for changes.

To run individual tasks, use `gulp <task> <othertask>`


## Available Plugins

The gulp community is growing, with new plugins being added daily. See the [main website](http://gulpjs.com/) for a complete list.

## .src, .watch, .dest - How do I use these things?

For API specific documentation you can check out the [documentation for that](API.md)
