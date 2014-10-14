# Eliminar archivos y carpetas

Puede que quieras eliminar archivos y carpetas en tu proceso. Ya que eliminar archivos no necesita del contenido de los archivos no hay razón para usar gulp. Esta es una oportunidad excelente para simplemente usar modulo de node

Utilicemos el módulo [`del`](https://github.com/sindresorhus/del) para este ejemplo ya que soporta múltiples archivos y [globbing](https://github.com/sindresorhus/multimatch#globbing-patterns):

```sh
$ npm install --save-dev gulp del
```

Imagina esta estructura de archivos:

```
.
├── dist
│   ├── report.csv
│   ├── desktop
│   └── mobile
│       ├── app.js
│       ├── deploy.json
│       └── index.html
└── src
```

En el gulpfile queremos limpiar los contenidos de la carpeta `mobile` folder antes de ejecutar nuestro proceso:

```js
var gulp = require('gulp');
var del = require('del');

gulp.task('clean:mobile', function (cb) {
  del([
    'dist/report.csv',
    // usemos globbing para marcar todo dentro de la carpeta `mobile`
    'dist/mobile/**',
    // no queremos limpiar este archivo, así que lo negamos
    '!dist/mobile/deploy.json'
  ], cb);
});

gulp.task('default', ['clean:mobile']);
```
