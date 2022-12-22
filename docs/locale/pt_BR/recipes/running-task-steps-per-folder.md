# Gerando um arquivo por pasta

Se você tem um punhado de pastas e quer executar um conjunto de tarefas em cada, como nesse caso:

```
/scripts
/scripts/jquery/*.js
/scripts/angularjs/*.js
```

Que depois é transformado nisso:

```
/scripts
/scripts/jquery.min.js
/scripts/angularjs.min.js
```

Você precisará fazer algo como isso:

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

gulp.task('scripts', function(done) {
   var folders = getFolders(scriptsPath);
   if (folders.length === 0) return done(); // nada à fazer!
   var tasks = folders.map(function(folder) {
      return gulp.src(path.join(scriptsPath, folder, '/**/*.js'))
        // concatena em foldername.js
        .pipe(concat(folder + '.js'))
        // escreve no output
        .pipe(gulp.dest(scriptsPath))
        // minimiza
        .pipe(uglify())
        // renomeia para folder.min.js
        .pipe(rename(folder + '.min.js'))
        // escreve no output, novamente
        .pipe(gulp.dest(scriptsPath));
   });

  /* processa os arquivos restantes, na raíz de scriptsPath 
   * e coloca nos arquivos main.js e main.min.js */
  var root = gulp.src(path.join(scriptsPath, '/*.js'))
        .pipe(concat('main.js'))
        .pipe(gulp.dest(scriptsPath))
        .pipe(uglify())
        .pipe(rename('main.min.js'))
        .pipe(gulp.dest(scriptsPath));

   return merge(tasks, root);
});
```

Notas:

- `folders.map` - executa a função uma vez por pasta e retorna a _stream_ assíncrona;
- `merge` - combina as _streams_ e só finaliza quando todas elas emitirem conclusão.
