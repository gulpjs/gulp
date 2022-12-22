# Rollup com rollup-stream

Tal qual Browserify, [Rollup](https://rollupjs.org/) é um bundler e, portanto, só se comporta bem no gulp se for colocado no início da pipeline. 

Diferente do Browserify, Rollup não produz uma stream como output (nativamente) e precisa ser envolto por algo, antes que possa fazer isso.

O [rollup-stream](https://github.com/Permutatrix/rollup-stream) é capaz de fazer isso por você: produzindo output igual ao feito pelo método `bundle()` do Browserify. Devido a isso, a maioria das receitas para Browserify que aqui estão também vão funcionar com _rollup-stream_.

## Modo de uso básico
```js
// npm install --save-dev gulp @rollup/stream@1 vinyl-source-stream
var gulp = require('gulp');
var rollup = require('rollup-stream');
var source = require('vinyl-source-stream');

gulp.task('rollup', function() {
  return rollup({
      input: './src/main.js'
    })

    // nomeie o arquivo de output
    .pipe(source('app.js'))

    // faz output em ./dist/app.js, como sempre.
    .pipe(gulp.dest('./dist'));
});
```

## Modo de uso com sourcemaps
```js
// npm install --save-dev gulp @rollup/stream@1 gulp-sourcemaps vinyl-source-stream vinyl-buffer
// opcionalmente: npm install --save-dev gulp-rename
var gulp = require('gulp');
var rollup = require('rollup-stream');
var sourcemaps = require('gulp-sourcemaps');
//var rename = require('gulp-rename');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

gulp.task('rollup', function() {
  return rollup({
      input: './src/main.js',
      sourcemap: true,
      format: 'umd'
    })

    // indica o arquivo de entrada.
    .pipe(source('main.js', './src'))

    /* faz buffer do output.
     * a maioria dos plugins gulp não suporta streams.
     * (incluindo gulp-sourcemaps) */
    .pipe(buffer())

    /* pede para gulp-sourcemaps carregar o inline 
     * sourcemap, produzido pelo rollup-stream. */
    .pipe(sourcemaps.init({loadMaps: true}))

        // faça mais transformações no código, aqui.

    /* se você quiser fazer output com um nome diferente
     * do arquivo de input, use gulp-rename aqui. */
    //.pipe(rename('index.js'))

    // cria o sourcemap, junto ao arquivo de output.
    .pipe(sourcemaps.write('.'))

    // faz output em ./dist/main.js, como sempre.
    .pipe(gulp.dest('./dist'));
});
```
