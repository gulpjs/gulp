# Primeros Pasos

#### 1. Instalación global de gulp:

```sh
$ npm install --global gulp
```

#### 2. Instalar gulp en las devDependencies de tu proyecto:

```sh
$ npm install --save-dev gulp
```

#### 3. Crear un archivo `gulpfile.js` en el directorio raíz:

```js
var gulp = require('gulp');

gulp.task('default', function() {
  // aquí escribes el código de la tarea por defecto
});
```

#### 4. Correr gulp:

```sh
$ gulp
```

Ejecuta la tarea `default`. (Sin producir ningún efecto en el ejemplo anterior.)

Para correr tareas individualmente, usar `gulp <tarea> <otra_tarea>`.


## ¿Y ahora?

Ya tienes un archivo gulp en blanco y todo está instalado, pero ¿cómo empiezo a usar gulp realmente?. Visita la página de [recetas](recipes) o la [lista de artículos](README.md#articles) para saber.

## .src, .watch, .dest, CLI args - ¿Qué es todo esto?

Para ver detalles específicos del API ver la [documentación aquí](API.md).

## Plugins Disponibles

La comunidad de gulp está creciendo, con nuevos plugins a diario. Visita la [página oficial](http://gulpjs.com/plugins/) para ver la lista completa.
