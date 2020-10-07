<!-- front-matter
id: watching-files
title: Watching Files
hide_title: true
sidebar_label: Watching Files
-->

# Observando Arquivos Recursivamente

A API `watch()` liga [globs][globs-docs] à [tarefas][creating-tasks-docs], usando um observador de sistema de arquivos.

Essa API fica esperando por alterações em arquivos correspondentes aos _globs_ para executar alguma tarefa, quando isso ocorre.

Se a tarefa não sinalizar [conclusão assíncrona][async-completion-doc], o observador nunca executará ela mais de uma vez.

Essa API também disponibiliza um recurso integrado de _delay_ e outro de enfileiramento baseado em _defaults_ de uso mais recorrente.

```js
const { watch, series } = require('gulp');

function clean(cb) {
  // código omitido
  cb();
}

function javascript(cb) {
  // código omitido
  cb();
}

function css(cb) {
  // código omitido
  cb();
}

exports.default = function() {
  // você pode usar uma única tarefa
  watch('src/*.css', css);
  // ou várias
  watch('src/*.js', series(clean, javascript));
};
```

## Aviso: evite sincronicidade

A tarefa de um observador não pode ser síncrona, assim como as tarefas registradas no sistema de tarefas.

Se você passar uma tarefa síncrona, nunca será possível determinar que ela concluiu sua execução. Isso fará com que nunca seja executada mais de uma vez, já que o sistema assume que ela esteja executando, eternamente.

Nenhuma mensagem de erro ou aviso aparece, porque o observador de arquivos mantém o seu processo Node executando. Já que o processo executa sem parar, não é possível determinar se a tarefa concluíu em algum momento ou se só está levando muito tempo para finalizar sua execução.

## Tipos de eventos

Por padrão, o observador executa tarefas quando um arquivo é criado, alterado ou deletado. Se você precisa de gatilhos diferentes, use a opção `events` quando invocar `watch()`. 

Os tipos de eventos disponíveis são `'add'`, `'addDir'`, `'change'`, `'unlink'`, `'unlinkDir'`, `'ready'` e `'error'`. Adicionalmente, `'all'` está disponível para representar todos os outros eventos (com excessão de `'ready'` e `'error'`).

```js
const { watch } = require('gulp');

exports.default = function() {
  // todos eventos serão observados
  watch('src/*.js', { events: 'all' }, function(cb) {
    // código omitido
    cb();
  });
};
```

## Execução inicial

Tarefas não são executadas, assim que invocamos `watch()`. Elas esperam alguma alteração de arquivo, antes.

Para executar tarefas antes de alterações, configure `ignoreInitial` como `false`.

```js
const { watch } = require('gulp');

exports.default = function() {
  // a tarefa será executada, assim que o processo iniciar
  watch('src/*.js', { ignoreInitial: false }, function(cb) {
    // código omitido
    cb();
  });
};
```

## Enfileiramento

Cada `watch()` garante que tarefa sendo executada não será re-executada paralelamente.

Quando alguma alteração de arquivo ocorre enquanto uma tarefa está sendo executada, outra execução dela é programada para acontecer quando esta finalizar.

Somente uma única execução pode ser enfileirada, por vez.

Para desativar este comportamento, configure a opção `queue` como `false`.

```js
const { watch } = require('gulp');

exports.default = function() {
  // a tarefa será executada paralelamente, a cada alteração
  watch('src/*.js', { queue: false }, function(cb) {
    // código omitido
    cb();
  });
};
```

## Delay

Depois de ocorrer alguma alteração de arquivo, a tarefa não é executada até que se passe 200ms. 

Esse recurso serve para evitar a execução de tarefas muito rápido, quando muitos arquivos estão sendo alterados de uma só vez (como quando usando _find-and-replace_ de algum editor de texto).

Para ajustar a duração desse delay, configure a opção `delay` usando um número inteiro positivo.

```js
const { watch } = require('gulp');

exports.default = function() {
  /* a tarefa não será executada, até que se passe 500ms
   * depois da primeira alteração */
  watch('src/*.js', { delay: 500 }, function(cb) {
    // código omitido
    cb();
  });
};
```

## Usando a instância do observador

Provavelmente, você não vai usar esse recurso. No entanto, se precisar de controle total sobre os arquivos alterados: use a instância de [chokidar][chokidar-module-package], retornada pelo `watch()`.

Controle total sobre arquivos alterados, pode permitir: acesso à caminhos ou metadados, por exemplo.

__Cuidado:__ a instância do chokidar que é retornada não possui os recursos de enfileiramento, delay ou conclusão assíncrona.

## Dependência opcional

Gulp tem uma dependência opcional chamada [fsevents][fsevents-package], a qual é um observador de eventos específico para uso em Mac.

Se você ver um aviso durante a instalação (sobre _fsevents_), não é um problema:

> npm WARN optional SKIPPING OPTIONAL DEPENDENCY: fsevents

Quando a instalação do _fsevents_ é pulada, um observador substituto é usado. Por isso: qualquer erro em seu gulpfile não tem qualquer relação com este aviso.

[globs-docs]: ../getting-started/6-explaining-globs.md
[creating-tasks-docs]: ../getting-started/3-creating-tasks.md
[async-completion-doc]: ../getting-started/4-async-completion.md
[chokidar-module-package]: https://www.npmjs.com/package/chokidar
[fsevents-package]: https://www.npmjs.com/package/fsevents
