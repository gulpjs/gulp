# Criar stream à partir de buffer (conteúdos na memória)

Às vezes, você pode precisar iniciar uma stream com arquivos em que seus conteúdos estão em uma variável, mas não em um arquivo físico. Em outras palavras: _como iniciar uma gulp stream, sem usar `gulp.src()`?_

Vamos imaginar, por exemplo, que temos um diretório `lib` com arquivos JS e outro diretório com versões de algum módulo. O objetivo da build seria criar um arquivo `.js` para cada versão, contendo todas as libs e a versão do módulo concatenada.

De maneira lógica, nós descreveríamos o processo assim:

* carregar os arquivos em `lib`;
* concatenar os conteúdos dos arquivos de `lib`;
* carregar os arquivos de versão;
* para cada arquivo de versão:
  * concatenar os conteúdos de `lib` e os conteúdos do arquivo de versão.
  * fazer o output do resultado, em um arquivo.

Com essa estrutura de arquivos:

```sh
├── libs
│   ├── lib1.js
│   └── lib2.js
└── versions
    ├── version.1.js
    └── version.2.js
```

Você obteria isso:

```sh
└── output
    ├── version.1.complete.js # lib1.js + lib2.js + version.1.js
    └── version.2.complete.js # lib1.js + lib2.js + version.2.js
```

Uma forma simples e modular de fazer isso, seria assim:

```js
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var vinylBuffer = require('vinyl-buffer');
var tap = require('gulp-tap');
var concat = require('gulp-concat');
var size = require('gulp-size');
var path = require('path');
var es = require('event-stream');

var memory = {}; // vamos manter nossos assets, na memória

// tarefa para salvar o conteúdo dos arquivos, na memória
gulp.task('load-lib-files', function() {
  // lê os arquivos de lib, à partir do disco
  return gulp.src('src/libs/*.js')
    // concatena todos os arquivos de lib, em um único
    .pipe(concat('libs.concat.js'))
    // usa tap na stream para capturar os dados de cada arquivo
    .pipe(tap(function(file) {
      // salva os conteúdos dos arquivos, na memória
      memory[path.basename(file.path)] = file.contents.toString();
    }));
});

gulp.task('load-versions', function() {
  memory.versions = {};
  // lê os arquivos de versão, à partir do disco
  return gulp.src('src/versions/version.*.js')
  // usa tap na stream para capturar os dados de cada arquivo
  .pipe( tap(function(file) {
    // salva os conteúdos dos arquivos, nos assets
    memory.versions[path.basename(file.path)] = file.contents.toString();
  }));
});

gulp.task('write-versions', function() {
  // armazenamos todas os nomes dos diferentes arquivos de versões, em uma array
  var availableVersions = Object.keys(memory.versions);
  // fazemos uma array para armazenar todas as promises de streams
  var streams = [];

  availableVersions.forEach(function(v) {
    // cria uma nova stream, usando um nome de arquivo falso
    var stream = source('final.' + v);

    var streamEnd = stream;

    // carregamos os dados dos arquivos lib concatenados
    var fileContents = memory['libs.concat.js'] +
      // adicionamos os dados das versões
      '\n' + memory.versions[v];

    // escreve os conteúdos dos arquivos, na stream
    stream.write(fileContents);

    process.nextTick(function() {
      // no próximo ciclo do processo, finalize a stream
      stream.end();
    });

    streamEnd = streamEnd
    /* transforma os dados crus adentro da stream, 
     * adentro de um objeto/arquivo vinyl */
    .pipe(vinylBuffer())
    //.pipe(tap(function(file) { /* faça algo com o conteúdo dos arquivos, aqui */ }))
    .pipe(gulp.dest('output'));

    /* adiciona o fim da stream, caso contrário, a tarefa 
     * seria finalizada antes de todo processamento acabar. */
    streams.push(streamEnd);

  });

  return es.merge.apply(this, streams);
});

//============================================ nossa tarefa principal
gulp.task('default', gulp.series(
    // carrega os arquivos, em paralelo
    gulp.parallel('load-lib-files', 'load-versions'),
    // escreve todas os recursos (uma vez), na memória
    'write-versions'
  )
);

//============================================ nossa tarefa para observar arquivos
/* só observa depois de executar 'default' uma vez, 
 * para que todos os recursos já estejam na memória. */
gulp.task('watch', gulp.series(
  'default',
  function() {
    gulp.watch('./src/libs/*.js', gulp.series(
      'load-lib-files',
      'write-versions'
    ));

    gulp.watch('./src/versions/*.js', gulp.series(
      'load-lib-files',
      'write-versions'
    ));
  }
));
```
