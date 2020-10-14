# Executando Comandos Shell

Às vezes, é bom poder invocar algumas ferramentas de linha de comando, usando o Gulp.

Existem duas formas de fazer isso: 

- Usando o módulo [`child_process`](https://nodejs.org/api/child_process.html);
- Usando o módulo [`gulp-exec`](https://github.com/robrich/gulp-exec).
  - Use esse método se precisar integrar o comando à pipeline existente.

```js
'use strict';

var cp = require('child_process');
var gulp = require('gulp');

gulp.task('reset', function() {
  /* no Gulp 4, você pode retornar um processo filho
   * para sinalizar conclusão de tarefa */
  return cp.execFile('git checkout -- .');
});
```

```js
'use strict';

var gulp = require('gulp');
var exec = require('gulp-exec');

gulp.task('reset', function() {
  return gulp.src('./**/**')
    .pipe(exec('git checkout -- <%= file.path %>'));
});
```
