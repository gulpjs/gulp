# Lidando com streams

> A escrita de plugins com suporte a streams é altamente recomendável. Aqui temos alguma informação sobre como criar um plugin gulp com suporte
a streams.

> Tenha certeza que está seguindo as melhores práticas em relação à captura de erros e inclua uma linha que fará o plugin gulp re-emitir o primeiro erro capturado durante a transformação do conteúdo.

[Escrevendo um Plugin](README.md) > Escrevendo plugins baseados em stream

## Trabalhando com streams

Vamos implementar um plugin prefixando algum texto aos arquivos. Esse plugin suporta todas as formas possíveis de `file.contents`.

```js
var through = require('through2');
var PluginError = require('plugin-error');

// consts
const PLUGIN_NAME = 'gulp-prefixer';

function prefixStream(prefixText) {
  var stream = through();
  stream.write(prefixText);
  return stream;
}

// função principal do pugin (lidando com os arquivos)
function gulpPrefixer(prefixText) {
  if (!prefixText) {
    throw new PluginError(PLUGIN_NAME, 'Falta o texto do prefixo!');
  }

  prefixText = new Buffer(prefixText); // aloca antecipadamente, para uso futuro

  // criando um stream por onde cada arquivo irá passar
  var stream = through.obj(function(file, enc, cb) {
    if (file.isBuffer()) {
      this.emit('error', new PluginError(PLUGIN_NAME, 'Buffers not supported!'));
      return cb();
    }

    if (file.isStream()) {
      // define o streamer que irá transformar o conteúdo
      var streamer = prefixStream(prefixText);
      // captura erros do stream e emite um erro no plugin gulp
      streamer.on('error', this.emit.bind(this, 'error'));
      // inicia a transformação
      file.contents = file.contents.pipe(streamer);
    }

    // garanta que o arquivo irá passar pelo próximo plugin gulp
    this.push(file);
    // avise à engine de stream que nós encerramos o trabalho neste arquivo
    cb();
  });

  // retornando o stream dos arquivos
  return stream;
}

// expotando a função principal do plugin
module.exports = gulpPrefixer;
```

O plugin acima pode ser usado da seguinte forma:

```js
var gulp = require('gulp');
var gulpPrefixer = require('gulp-prefixer');

gulp.src('files/**/*.js', { buffer: false })
  .pipe(gulpPrefixer('prepended string'))
  .pipe(gulp.dest('modified-files'));
```

## Alguns plugins que usam streams

* [gulp-svgicons2svgfont](https://github.com/nfroidure/gulp-svgiconstosvgfont)
