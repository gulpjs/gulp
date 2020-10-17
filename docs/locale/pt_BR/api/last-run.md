<!-- front-matter
id: lastrun
title: lastRun()
hide_title: true
sidebar_label: lastRun()
-->

# lastRun()

Retorna a última vez que uma tarefa conseguiu finalizar com sucesso, durante o atual processo em execução. Esse método é mais útil em subsequentes execuções de tarefas, enquanto um observador está rodando.

Quando combinado com `src()`, ativa builds incrementais para reduzir os tempos de execução: pulando arquivos que não alteraram desde a última tarefa que conseguiu finalizar com sucesso.

## Usage

```js
const { src, dest, lastRun, watch } = require('gulp');
const imagemin = require('gulp-imagemin');

function images() {
  return src('src/images/**/*.jpg', { since: lastRun(images) })
    .pipe(imagemin())
    .pipe(dest('build/img/'));
}

exports.default = function() {
  watch('src/images/**/*.jpg', images);
};
```

## Assinatura

```js
lastRun(task, [precision])
```

### Parâmetros

| parâmetro | tipo | descrição |
|:--------------:|:------:|-------|
| task<br />**(obrigatório)** | function<br />string | A função de uma tarefa ou o alias de uma tarefa registrada. |
| precision | number | Padrão: `1000` no Node v0.10, `0` no Node v0.12+. Mais detalhes em [Timestamp precision][timestamp-precision-section]. |

### Retorno

Uma timestamp (em milissegundos), indicando o tempo da última conclusão da tarefa. Se a tarefa não tiver sido executada ou falhar, retorna `undefined`.

O valor retornado é `undefined`, quando uma tarefa falha, para evitar fazer cache de estados inválidos.

### Erros

Quando invocamos com um valor que não seja uma string ou função, um erro é lançado com a seguinte mensagem:

> Only functions can check lastRun.

Quando invocamos em uma função não-extensível e Node não possui WeakMap, um erro é lançado com a seguinte mensagem:

> Only extensible functions can check lastRun.

## Precisão da timestamp

Apesar de existir configurações decentes para calibrar a precisão de timestamps, elas podem ser melhoradas usando o parâmetro `precision`. Isso pode ser útil se seu sistema de arquivos ou versão Node possui uma precisão fraca para atributos de tempo de arquivos.

* `lastRun(someTask)` retorna 1426000001111
* `lastRun(someTask, 100)` retorna 1426000001100
* `lastRun(someTask, 1000)` retorna 1426000001000

A precisão [mtime stat][fs-stats-concepts] de um arquivo pode variar, dependendo da versão Node e/ou sistema de arquivos utilizado.


| plataforma | precisão |
|:-----------:|:------------:|
| Node v0.10 | 1000ms |
| Node v0.12+ | 1ms |
| sistema de arquivos  FAT32| 2000ms |
| sistema de arquivos HFS+ ou Ext3 | 1000ms |
| NTFS usando Node v0.10 | 1s |
| NTFS usando Node 0.12+ | 100ms |
| Ext4 usando Node v0.10 | 1000ms |
| Ext4 usando Node 0.12+ | 1ms |


[timestamp-precision-section]: #timestamp-precision
[fs-stats-concepts]: ../api/concepts.md#file-system-stats
