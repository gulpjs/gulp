# Using external config file
## bonus: keeping those tasks DRY
## bonus2: config.json can be used by another task runner, like `Grunt`

---

`config.json`

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

---

`gulpfile.js`

```js
// npm install gulp gulp-uglify
var gulp   = require('gulp');
var uglify = require('gulp-uglify');
var config = require('./config.json');

function doStuff(cfg) {
  return gulp.src(cfg.src)
    .pipe(uglify())
    .pipe(gulp.dest(cfg.dest));
}

gulp.task('dry', function () {
  doStuff(config.desktop);
  doStuff(config.mobile);
});
```

