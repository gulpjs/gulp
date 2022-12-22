# Dividir tarefas em vários arquivos

Se seu `gulpfile.js` começar a crescer muito, você pode dividir as tarefas em diferentes arquivos, usando o módulo [gulp-hub](https://github.com/frankwallis/gulp-hub/tree/4.0)
como um [registro customizado](https://github.com/phated/undertaker#registryregistryinstance).

Para isso, imagine a seguinte estrutura de arquivos:

```
gulpfile.js
tasks/
├── dev.js
├── release.js
└── test.js
```

Instale o módulo `gulp-hub`:

```sh
npm install --save-dev gulp gulp-hub
```

Adicione as seguintes linhas, em seu arquivo `gulpfile.js`:

```js
'use strict';

var gulp = require('gulp');
var HubRegistry = require('gulp-hub');

/* carrega alguns arquivos, adentro do registro */
var hub = new HubRegistry(['tasks/*.js']);

/* fala para o gulp usar as tarefas que acabaram de ser carregadas */
gulp.registry(hub);
```

Essa receita também pode ser encontrada em https://github.com/frankwallis/gulp-hub/tree/4.0/examples/recipe
