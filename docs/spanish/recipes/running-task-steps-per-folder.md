# Generar un archivo por carpeta

Si tienes un conjunto de carpetas, y quisieras hacer un conjunto de tareas en cada uno de ellos, por ejemplo... 

```
/scripts
/scripts/jquery/*.js
/scripts/angularjs/*.js
```

...y quieres acabar con...

```
/scripts
/scripts/jquery.min.js
/scripts/angularjs.min.js
```

...necesitarás hacer algo como lo siguiente...

``` javascript
var fs = require('fs');
var path = require('path');
var merge = require('merge-stream');
var gulp = require('gulp');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');

var scriptsPath = 'src/scripts';

function getFolders(dir) {
    return fs.readdirSync(dir)
      .filter(function(file) {
        return fs.statSync(path.join(dir, file)).isDirectory();
      });
}

gulp.task('scripts', function() {
   var folders = getFolders(scriptsPath);

   var tasks = folders.map(function(folder) {
      // concatenar en carpeta.js
      // escribir archivo de salida
      // minificar
      // renombrarlo a folder.min.js
      // escribir achivo de salida de nuevo
      return gulp.src(path.join(scriptsPath, folder, '/*.js'))
        .pipe(concat(folder + '.js'))
        .pipe(gulp.dest(scriptsPath))
        .pipe(uglify())
        .pipe(rename(folder + '.min.js'))
        .pipe(gulp.dest(scriptsPath));
   });

   return merge(tasks);
});
```

Unas pocas notas:
- `folders.map` - ejecuta la funcion una vez por cada carpeta y devuelver el stream asíncrono.
- `es.concat` - combina los streams y termina sólo cuando todos los streams hallan acabado
