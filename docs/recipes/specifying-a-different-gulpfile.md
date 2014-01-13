# Specifying a different gulpfile

`gulpfile.js`

```js
var gulp = require('gulp');
var path = require('path');

try {
  require(path.resolve(__dirname, gulp.env.gulpfile));
} catch (err) {
  console.error('Unable to load %s', gulp.env.gulpfile);
}
```
