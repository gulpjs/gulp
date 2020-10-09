# Exportar tarefas com módulos ES2015

Usando a sintaxe de módulos do ES2015, você pode usar exportações com tarefas.

```js
import gulp from 'gulp';
import babel from 'gulp-babel';

// tarefa nomeada
export function build() {
  return gulp.src('src/*.js')
    .pipe(babel())
    .pipe(gulp.dest('lib'));
}

// tarefa padrão
export default function dev() {
  gulp.watch('src/*.js', ['build']);
}
```

Isso **não vai** funcionar com o `gulp-cli` das versões 3.x do gulp. Você tem que usar alguma versão publicada, recentemente.
