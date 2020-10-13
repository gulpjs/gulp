<!-- front-matter
id: tree
title: tree()
hide_title: true
sidebar_label: tree()
-->

# tree()

Mostra a ávore de dependências de tarefas atual (nos raros casos em que precisamos).

Geralmente, `tree()` não é usado por usuários do Gulp, mas é exposto para que o CLI possa mostrar o gráfico de dependências das tarefas definidas em um gulpfile.

## Modo de uso

Exemplo de gulpfile:
```js

const { series, parallel } = require('gulp');

function one(cb) {
  // código omitido
  cb();
}

function two(cb) {
  // código omitido
  cb();
}

function three(cb) {
  // código omitido
  cb();
}

const four = series(one, two);

const five = series(four,
  parallel(three, function(cb) {
    // código omitido
    cb();
  })
);

module.exports = { one, two, three, four, five };
```

Output de `tree()`:
```js
{
  label: 'Tasks',
  nodes: [ 'one', 'two', 'three', 'four', 'five' ]
}
```


Output de `tree({ deep: true })`:
```js
{
  label: "Tasks",
  nodes: [
    {
      label: "one",
      type: "task",
      nodes: []
    },
    {
      label: "two",
      type: "task",
      nodes: []
    },
    {
      label: "three",
      type: "task",
      nodes: []
    },
    {
      label: "four",
      type: "task",
      nodes: [
        {
          label: "<series>",
          type: "function",
          branch: true,
          nodes: [
            {
              label: "one",
              type: "function",
              nodes: []
            },
            {
              label: "two",
              type: "function",
              nodes: []
            }
          ]
        }
      ]
    },
    {
      label: "five",
      type: "task",
      nodes: [
        {
          label: "<series>",
          type: "function",
          branch: true,
          nodes: [
            {
              label: "<series>",
              type: "function",
              branch: true,
              nodes: [
                {
                  label: "one",
                  type: "function",
                  nodes: []
                },
                {
                  label: "two",
                  type: "function",
                  nodes: []
                }
              ]
            },
            {
              label: "<parallel>",
              type: "function",
              branch: true,
              nodes: [
                {
                  label: "three",
                  type: "function",
                  nodes: []
                },
                {
                  label: "<anonymous>",
                  type: "function",
                  nodes: []
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

## Assinatura

```js
tree([options])
```

### Parâmetros

| parâmetro | tipo | descrição |
|:--------------:|------:|--------|
| options | object | Mais detalhes em [Opções][options-section]. |

### Retorna

Um objeto detalhando a árvore de tarefas registradas, contendo objetos aninhados com propriedades `'label'` e `'nodes'` (os quais são compatíveis com [archy][archy-external]).

Cada objeto pode ter uma propriedades `type` que pode ser usada para determinar se o nó é uma tarefa ou função.

Cada objeto pode ter uma propriedade `branch` que, quando atribuída `true`, indica se o nó foi criado usando `series()` ou `parallel()`.

### Opções

| nome | tipo | padrão | descrição |
|:-------:|:-------:|------------|--------|
| deep | boolean | false | Se for `true`, toda a árvore será retornada. Quando for `false`, só tarefas de topo de nível serão retornadas. |

[options-section]: #opções
[archy-external]: https://www.npmjs.com/package/archy
