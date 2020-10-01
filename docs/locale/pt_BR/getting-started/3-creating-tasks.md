<!-- front-matter
id: creating-tasks
title: Creating Tasks
hide_title: true
sidebar_label: Creating Tasks
-->

# Criando tarefas

Cada tarefa é uma função JavaScript assíncrona: uma função que aceita um _error-first callback_ ou retorna uma _stream_, _promise_, _event emitter_, _child process_ ou _observable_ ([veremos mais sobre isso][async-completion-docs]).

Devido a alguns limites de plataforma, tarefas síncronas não são suportadas. No entanto, existe uma boa [alternativa][using-async-await-docs] a esse método.

## Exportando

Tarefas podem ser **_public_** (públicas) ou **_private_** (privadas).

* **Tarefas públicas** são aquelas exportadas do seu gulpfile, oquê permite que sejam executadas pelo comando `gulp`.
* **Tarefas privadas** são aquelas feitas para uso interno. Normalmente, usamos elas com as APIs `series()` e `parallel()`.

Uma tarefa privada parece e age como qualquer outra, mas nunca é executada por usuários finais. Para registrar uma tarefa como pública, exporte ela a partir do seu gulpfile.

```js
const { series } = require('gulp');

// A função `clean` não é exportada, por isso é considerada uma tarefa privada.
// No entanto, ainda assim, ela pode ser usada dentro da composição da API `series()`.
function clean(cb) {
  // código omitido
  cb();
}

// Já a função `build` é exportada, então é considerada pública e pode ser executada com o comando `gulp`.
// E, como sempre, também pode ser usada dentro da composição da API `series()`.
function build(cb) {
  // código omitido
  cb();
}

exports.build = build;
exports.default = series(clean, build);
```

![ALT TEXT MISSING][img-gulp-tasks-command]

<small>Antigamente, a API `task()` era usada para registrar suas funções como tarefas. Apesar de ainda funcionar, o principal mecanismo de registro tem que ser exportação (exceto em casos que não é possível exportar a função).</small>

## Composição de tarefas

Gulp disponibiliza dois poderosos métodos de composição: `series()` e `parallel()`, os quais permitem tarefas individuais comporem outras maiores (operações compostas).

Ambos métodos aceitam qualquer quantidade de tarefas ou operações compostas.

`series()` e `parallel()` podem ser aninhados dentro de si, em qualquer nível de profundidade.

Para executar suas tarefas em sequência: use o método `series()`.
```js
const { series } = require('gulp');

function transpile(cb) {
  // código omitido
  cb();
}

function bundle(cb) {
  // código omitido
  cb();
}

exports.build = series(transpile, bundle);
```

Já para executar tarefas em _concorrência máxima_: combine elas dentro do método `parallel()`.
```js
const { parallel } = require('gulp');

function javascript(cb) {
  // código omitido
  cb();
}

function css(cb) {
  // código omitido
  cb();
}

exports.build = parallel(javascript, css);
```

Tarefas são compostas imediatamente, quando `series()` ou `parallel()` são invocados. Isso permite variação na composição de tarefas, invés de condicionais dentro de cada tarefa.

```js
const { series } = require('gulp');

function minify(cb) {
  // código omitido
  cb();
}


function transpile(cb) {
  // código omitido
  cb();
}

function livereload(cb) {
  // código omitido
  cb();
}

if (process.env.NODE_ENV === 'production') {
  exports.build = series(transpile, minify);
} else {
  exports.build = series(transpile, livereload);
}
```

`series()` e `parallel()` podem se aninhar, em qualquer nível de profundidade.

```js
const { series, parallel } = require('gulp');

function clean(cb) {
  // código omitido
  cb();
}

function cssTranspile(cb) {
  // código omitido
  cb();
}

function cssMinify(cb) {
  // código omitido
  cb();
}

function jsTranspile(cb) {
  // código omitido
  cb();
}

function jsBundle(cb) {
  // código omitido
  cb();
}

function jsMinify(cb) {
  // código omitido
  cb();
}

function publish(cb) {
  // código omitido
  cb();
}

exports.build = series(
  clean,
  parallel(
    cssTranspile,
    series(jsTranspile, jsBundle)
  ),
  parallel(cssMinify, jsMinify),
  publish
);
```

Quando uma operação composta é executada, cada tarefa dentro dela é executada toda vez que for referenciada.

No exemplo abaixo: a tarefa `clean`, referenciada antes de duas diferentes tarefas, seria executada duas vezes e talvez geraria resultados inesperados.

```js
// This is INCORRECT
const { series, parallel } = require('gulp');

const clean = function(cb) {
  // código omitido
  cb();
};

const css = series(clean, function(cb) {
  // código omitido
  cb();
});

const javascript = series(clean, function(cb) {
  // código omitido
  cb();
});

exports.build = parallel(css, javascript);
```

Invés disso, seria melhor refatorar o código e referenciar a tarefa `clean` na composição final.

```js
const { series, parallel } = require('gulp');

function clean(cb) {
  // código omitido
  cb();
}

function css(cb) {
  // código omitido
  cb();
}

function javascript(cb) {
  // código omitido
  cb();
}

exports.build = series(clean, parallel(css, javascript));
```

[async-completion-docs]: ../getting-started/4-async-completion.md
[using-async-await-docs]: ../getting-started/4-async-completion.md#using-async-await
[img-gulp-tasks-command]: https://gulpjs.com/img/docs-gulp-tasks-command.png
[async-once]: https://github.com/gulpjs/async-once
