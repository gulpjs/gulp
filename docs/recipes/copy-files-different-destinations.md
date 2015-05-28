# Copy files to different destinations

Using gulp, you can copy files from different sources to different destinations in one task.

```js
gulp.task('copy-files', function () {
   gulp.src('src/html/robots.txt')
      .pipe(gulp.dest('dist'))
  gulp.src('src/images/favicon.*')
      .pipe(gulp.dest('dist'));
  gulp.src('src/images/**')
      .pipe(gulp.dest('dist/images'));
});
```

See also: [Using multiple sources in one task](https://github.com/gulpjs/gulp/blob/master/docs/recipes/using-multiple-sources-in-one-task.md)
 
