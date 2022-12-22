<!-- front-matter
id: registry
title: registry()
hide_title: true
sidebar_label: registry()
-->

# registry()

Permite que registros customizados se conectem ao sistema de tarefas, os quais podem disponibilizar tarefas compartilhadas ou melhorar funcionalidades.

**Observação:** somente tarefas registradas com `task()` ficarão disponíveis neste registro customizado. As tarefas passadas diretamente para `series()` ou `parallel()`, não ficam disponíveis. Se você precisar customizar o comportamento do registro, faça uma composição de tarefas usando _string references_.

Quando for adicionar um novo registro: cada tarefa do atual registro será transferida e o atual registro será substituído pelo novo. Isso permite adicionar vários registros customizados, em ordem de sequência.

Leia: [Criando registros personalizados][creating-custom-registries], para mais detalhes.

## Modo de Uso

```js
const { registry, task, series } = require('gulp');
const FwdRef = require('undertaker-forward-reference');

registry(FwdRef());

task('default', series('forward-ref'));

task('forward-ref', function(cb) {
  // código omitido
  cb();
});
```

## Assinatura

```js
registry([registryInstance])
```

### Parâmetros

| parâmetro | tipo | descrição |
|:--------------:|:-----:|--------|
| registryInstance | object | A instância de um registro customizado. (não é a classe!) |

### Retorno

Se o argumento `registryInstance` for passado: nada será retornado. Se nenhum argumento for passado: retorna a instância do atual registro.

### Erros

Quando um construtor é passado como `registryInstance` (invés de uma instância), um erro será lançado com a seguinte mensagem:

> Custom registries must be instantiated, but it looks like you passed a constructor.

Quando um registro sem algum método `get` é passado como `registryInstance`, um erro será lançado com a seguinte mensagem:

> Custom registry must have `get` function.

Quando um registro sem algum método `set` é passado como `registryInstance`, um erro será lançado com a seguinte mensagem:

> Custom registry must have `set` function.

Quando um registro sem algum método `init` é passado como `registryInstance`, um erro será lançado com a seguinte mensagem:

> Custom registry must have `init` function.

Quando um registro sem algum método `tasks` é passado como `registryInstance`, um erro será lançado com a seguinte mensagem:

> Custom registry must have `tasks` function.

[creating-custom-registries]: ../advanced/creating-custom-registries.md
