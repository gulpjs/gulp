# Delete arquivos e pastas

Uma hora ou outra, você vai querer deletar alguns arquivos, antes de rodar a build. No entanto, já que o processo de deletar arquivos não opera no conteúdo deles, não há razão para usar plugins. Por isso, essa é uma ótima oportunidade para usar algum módulo _vanilla_.

Vamos usar o módulo [`del`](https://github.com/sindresorhus/del), nesse exemplo, já que ele suporta deletar múltiplos arquivos e [globbing](https://github.com/sindresorhus/multimatch#globbing-patterns):

```sh
$ npm install --save-dev gulp del
```

Agora, imagine a seguinte estrutura de arquivos:

```
.
├── dist
│   ├── report.csv
│   ├── desktop
│   └── mobile
│       ├── app.js
│       ├── deploy.json
│       └── index.html
└── src
```

Usando o gulpfile, nós vamos deletar os conteúdos da pasta `mobile`, antes de executar nossa build:

```js
var gulp = require('gulp');
var del = require('del');

gulp.task('clean:mobile', function () {
  return del([
    'dist/report.csv',
    /* aqui, nós usamos um padrão de globbing que 
     * dá match em tudo que está dentro da pasta `mobile` */
    'dist/mobile/**/*',
    /* no entanto, como não queremos deletar deploy.json, 
     * vamos usar um padrão de negação */
    '!dist/mobile/deploy.json'
  ]);
});

gulp.task('default', gulp.series('clean:mobile'));
```


## Deletando arquivos em uma pipeline

Você também pode querer deletar alguns arquivos, depois de processá-los em uma _pipeline_.

Para isso, vamos usar [vinyl-paths](https://github.com/sindresorhus/vinyl-paths) para termos acesso aos caminhos dos arquivos da stream (com facilidade) e passá-los para o método `del`.

```sh
$ npm install --save-dev gulp del vinyl-paths
```

Agora, imagine a seguinte estrutura de arquivos:

```
.
├── tmp
│   ├── rainbow.js
│   └── unicorn.js
└── dist
```

```js
var gulp = require('gulp');
// usamos gulp-strip-debug só para exemplificar
var stripDebug = require('gulp-strip-debug');
var del = require('del');
var vinylPaths = require('vinyl-paths');

gulp.task('clean:tmp', function () {
  return gulp.src('tmp/*')
    .pipe(vinylPaths(del))
    .pipe(stripDebug())
    .pipe(gulp.dest('dist'));
});

gulp.task('default', gulp.series('clean:tmp'));
```

Isso vai deletar o diretório `tmp`, mas só ele.

Só faça isso se você já estiver usando outro plugin, na _pipeline_. Caso contrário, úse o módulo diretamente, já que `gulp.src` é um processo que custa caro.
