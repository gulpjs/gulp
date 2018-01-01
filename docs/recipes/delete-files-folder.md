
# Delete files and folders

You might want to delete some files before running your build. Since deleting files doesn't work on the file contents, there's no reason to use a gulp plugin. An excellent opportunity to use a vanilla node module.

Let's use the [`del`](https://github.com/sindresorhus/del) module for this example as it supports multiple files and [globbing](https://github.com/sindresorhus/multimatch#globbing-patterns):

```sh
$ npm install --save-dev gulp@next del
```

Imagine the following file structure:

```
.
├── dist
│   ├── report.csv
│   ├── desktop
│   └── mobile
│       ├── app.js
│       ├── deploy.json
│       └── index.html
└── src
```

In the gulpfile we want to clean out the contents of the `mobile` folder before running our build:

```js
var gulp = require('gulp');
var del = require('del');

gulp.task('clean:mobile', function () {
  return del([
    'dist/report.csv',
    // here we use a globbing pattern to match everything inside the `mobile` folder
    'dist/mobile/**/*',
    // we don't want to clean this file though so we negate the pattern
    '!dist/mobile/deploy.json'
  ]);
});

gulp.task('default', gulp.series('clean:mobile'));
```


## Delete files in a pipeline

You might want to delete some files after processing them in a pipeline.

We'll use [vinyl-paths](https://github.com/sindresorhus/vinyl-paths) to easily get the file path of files in the stream and pass it to the `del` method.

```sh
$ npm install --save-dev gulp@next del vinyl-paths
```

Imagine the following file structure:

```
.
├── tmp
│   ├── rainbow.js
│   └── unicorn.js
└── dist
```

```js
var gulp = require('gulp');
var stripDebug = require('gulp-strip-debug'); // only as an example
var del = require('del');
var vinylPaths = require('vinyl-paths');

gulp.task('clean:tmp', function () {
  return gulp.src('tmp/*')
    .pipe(vinylPaths(del))
    .pipe(stripDebug())
    .pipe(gulp.dest('dist'));
});

gulp.task('default', gulp.series('clean:tmp'));
```

This will only delete the tmp dir.


Only do this if you're already using other plugins in the pipeline, otherwise just use the module directly as `gulp.src` is costly.
