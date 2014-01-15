# Specifying a new base directory

If using a nested directory structure (where tasks a)

`gulpfile.js`

```js
var gulp = require('gulp');

try {
  process.chdir(gulp.env.cwd);
} catch (err) {
  console.error('Unable to chdir to %s', gulp.env.cwd);
}
```

If you only need to specify a base directory for a certain glob

```js
gulp.src('./some/dir/**/*.js', { cwd: './public' });
```
