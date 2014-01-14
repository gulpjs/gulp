# Specifying a new base directory

`gulpfile.js`

```js
var gulp = require('gulp');

try {
  process.chdir(gulp.env.base);
} catch (err) {
  console.error('Unable to chdir to %s', gulp.env.base);
}
```

If you only need to specify a base directory for a certain glob

```js
gulp.src('./some/dir/**/*.js', { cwd: './public' });
```
