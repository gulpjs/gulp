# Usando um arquivo de configuração externo

É bom porque mantém tarefas usando o princípio DRY e `config.json` pode ser usado por outro _task runner_, como `grunt`.

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
// npm install --save-dev gulp gulp-uglify merge-stream
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var merge = require('merge-stream');

var config = require('./config.json');

function doStuff(cfg) {
  return gulp.src(cfg.src)
    .pipe(uglify())
    .pipe(gulp.dest(cfg.dest));
}

gulp.task('dry', function() {
  // retorna uma stream para sinalizar conclusão
  return merge([
    doStuff(config.desktop),
    doStuff(config.mobile)
  ])
});
```
