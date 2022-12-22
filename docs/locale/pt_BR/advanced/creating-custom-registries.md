<!-- front-matter
id: creating-custom-registries
title: Creating Custom Registries
hide_title: true
sidebar_label: Creating Custom Registries
-->

# Criando registros personalizados

Permite que registros personalizados sejam plugados ao sistema de tasks, onde podem prover tasks compartilhadas ou funcionalidades expandidas. Registros são realizados usando [`registry()`][registry-api-docs].

## Estrutura

Para que possam ser aceitos pelo gulp, registros personalizados devem seguir um formato específico.

```js
// como uma função
function TestRegistry() {}

TestRegistry.prototype.init = function (gulpInst) {}
TestRegistry.prototype.get = function (name) {}
TestRegistry.prototype.set = function (name, fn) {}
TestRegistry.prototype.tasks = function () {}

// como uma classe
class TestRegistry {
  init(gulpInst) {}

  get(name) {}

  set(name, fn) {}

  tasks() {}
}
```

Se a instância de um registro passado a `registry()` não inclui todos os quatro métodos, um erro será disparado.

## Registro

Se nós queremos registrar o nosso exemplo de registro acima, é necessário passar uma instância da mesma para `registry()`.

```js
const { registry } = require('gulp');

// ... código inicial do TestRegistry

// bom!
registry(new TestRegistry())

// ruim!
registry(TestRegistry())
// Irá disparar um erro: 'Custom registries must be instantiated, but it looks like you passed a constructor'
// Traduzindo: 'Registros personalizados devem ser instanciados, no entanto parece que você passou um construtor'.
```

## Métodos

### `init(gulpInst)`

O método `init()` de um registro é chamado ao fim da função `registry()`. A instância gulp passada como o único argumento (`gulpInst`) pode ser usada para pré-definir tarefas usando `gulpInst.task(taskName, fn)`.

#### Parâmetros

| parameter | type | note |
|:---------:|:----:|------|
| gulpInst | object | Instance of gulp. |

### `get(name)`

O método `get()` recebe uma task `name` para o registro customizado resolver e retornar, ou `undefined` caso nenhuma task com esse nome exista.

#### Parâmetros

| parameter | type | note |
|:---------:|:----:|------|
| name | string | Name of the task to be retrieved. |

### `set(name, fn)`

O método `set()` recebe uma task `name` e `fn`. É chamado internamente por `task()` para prover tasks registradas pelo usuário aos registros personalizados.

#### Parâmetros

| parameter | type | note |
|:---------:|:----:|------|
| name | string | Name of the task to be set. |
| fn | function | Task function to be set. |

### `tasks()`

Deve retornar um objeto listando todas as tasks no registro.

## Casos de uso

### Compartilhando Tasks

Para compartilhar tasks comuns a todos os seus projetos, você pode expor um método `init` no registro e o mesmo irá receber uma instância do gulp como o único argumento. Então, você pode usar `gulpInst.task(name, fn)` para registrar tasks pré-definidas.

Por examplo, você pode querer compartilhar uma task `clean`:

```js
const fs = require('fs');
const util = require('util');

const DefaultRegistry = require('undertaker-registry');
const del = require('del');

function CommonRegistry(opts){
  DefaultRegistry.call(this);

  opts = opts || {};

  this.buildDir = opts.buildDir || './build';
}

util.inherits(CommonRegistry, DefaultRegistry);

CommonRegistry.prototype.init = function(gulpInst) {
  const buildDir = this.buildDir;
  const exists = fs.existsSync(buildDir);

  if(exists){
    throw new Error('Cannot initialize common tasks. ' + buildDir + ' directory exists.');
  }

  gulpInst.task('clean', function(){
    return del([buildDir]);
  });
}

module.exports = CommonRegistry;
```

Entâo, para usá-la em um projeto:

```js
const { registry, series, task } = require('gulp');
const CommonRegistry = require('myorg-common-tasks');

registry(new CommonRegistry({ buildDir: '/dist' }));

task('build', series('clean', function build(cb) {
  // fazer algo
  cb();
}));
```

### Funcionalidade de compartilhamento

Ao controlar como as tasks são adicionadas ao registro, você pode decorá-las.

Por exemplo, se você deseja que todas as tasks compartilhem alguns dados, você pode usar um registro customizado para vinculá-los a esses dados. Não esqueça de retornar a task alterada, seguindo a descrição dos métodos de registro acima:

```js
const { registry, series, task } = require('gulp');
const util = require('util');
const DefaultRegistry = require('undertaker-registry');

// Alguma task, definida em algum lugar
const BuildRegistry = require('./build.js');
const ServeRegistry = require('./serve.js');

function ConfigRegistry(config){
  DefaultRegistry.call(this);
  this.config = config;
}

util.inherits(ConfigRegistry, DefaultRegistry);

ConfigRegistry.prototype.set = function set(name, fn) {
  // O `DefaultRegistry` usa `this._tasks` para armazenamento.
  var task = this._tasks[name] = fn.bind(this.config);
  return task;
};

registry(new BuildRegistry());
registry(new ServeRegistry());

// `registry` irá resetar cada tarefa no registro com
// `ConfigRegistry.prototype.set`, que irá vinculá-los ao objeto de configuração.
registry(new ConfigRegistry({
  src: './src',
  build: './build',
  bindTo: '0.0.0.0:8888'
}));

task('default', series('clean', 'build', 'serve', function(cb) {
  console.log('Server bind to ' + this.bindTo);
  console.log('Serving' + this.build);
  cb();
}));
```

## Exemplos

* [undertaker-registry][undertaker-registry-example]: O registro padrão do Gulp 4.
* [undertaker-common-tasks][undertaker-common-tasks-example]: Um registro customizado (Proof-of-concept) que pré-define tasks.
* [undertaker-task-metadata][undertaker-task-metadata-example]: Um registro customizado (Proof-of-concept) o qual incorpora metadados para cada task.

[registry-api-docs]: ../api/registry.md
[undertaker-registry-example]: https://github.com/gulpjs/undertaker-registry
[undertaker-common-tasks-example]: https://github.com/gulpjs/undertaker-common-tasks
[undertaker-task-metadata-example]: https://github.com/gulpjs/undertaker-task-metadata
