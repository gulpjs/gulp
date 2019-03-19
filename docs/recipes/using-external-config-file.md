# Using external config file

Beneficial because it keeps tasks DRY and `config.json` can be used by another task runner, like `grunt`.

-

###### `config.json`

```json
{
  "desktop" : {
    "src" : [
      "dev/desktop/js/**/*.js",
      "!dev/desktop/js/vendor/**"
    ],
    "dest" : "build/desktop/js"
  },
  "mobile" : {
    "src" : [
      "dev/mobile/js/**/*.js",
      "!dev/mobile/js/vendor/**"
    ],
    "dest" : "build/mobile/js"
  }
}
```

-

###### `gulpfile.js`

```js
// npm install --save-dev gulp gulp-uglify

const { src, dest, parallel } = require('gulp');
const uglify = require('gulp-uglify');

const config = require('./config.json');

function test(cfg) {
  return src(cfg.src)
    .pipe(uglify())
    .pipe(dest(cfg.dest));
}

exports.default = function(cb) {
  test(config.desktop),
  test(config.mobile),
  cb();
};
```
