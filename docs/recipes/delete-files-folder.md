# Delete files and folders

You might want to delete some files before running your build. Since deleting files doesn't work on the file contents, there's no reason to use a gulp plugin. An excellent opportunity to use a vanilla node module.

Let's use the [`del`](https://github.com/sindresorhus/del) module for this example as it supports multiple files and [globbing](https://github.com/sindresorhus/multimatch#globbing-patterns):

```sh
$ npm install --save-dev gulp del
```

Imagine this file structure:

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

gulp.task('clean:mobile', function (cb) {
  del([
    'dist/report.csv',
    // here we use a globbing pattern to match everything inside the `mobile` folder
    'dist/mobile/**',
    // we don't want to clean this file though so we negate the pattern
    '!dist/mobile/deploy.json'
  ], cb);
});

gulp.task('default', ['clean:mobile']);
```
