# Separar tareas en multiples archivos

Si tu `gulpfile.js` empieza a hacerse muy grande, puedes separar las tareas
en archivos diferentes usando el módulo [require-dir](https://github.com/aseemk/requireDir).

Imagina la siguiente estructura

```sh
gulpfile.js
tasks/
├── dev.js
├── release.js
└── test.js
```

Instala el módulo `require-dir`:

```sh
npm install --save-dev require-dir
```

Añade las siguientes líneas a tu `gulpfile.js` file:

```js
var requireDir = require('require-dir');
var dir = requireDir('./tasks');
```
