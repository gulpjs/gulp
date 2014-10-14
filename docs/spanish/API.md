## gulp API

### gulp.src(globs[, opciones])

Emite los archivos especificados en el glob o vector de globs. Devuelve un [stream](http://nodejs.org/api/stream.html) de [objetos Vinyl](https://github.com/wearefractal/vinyl-fs)
que pueden ser [conectados](http://nodejs.org/api/stream.html#stream_readable_pipe_destination_opciones)
a plugins.

```javascript
gulp.src('client/templates/*.jade')
  .pipe(jade())
  .pipe(minify())
  .pipe(gulp.dest('build/minified_templates'));
```

`glob` se refiere a la [sintaxis de node-glob](https://github.com/isaacs/node-glob) o directamete la ruta a un archivo.

#### globs
Tipo: `String` o `Array`

Glob o vector de globs a utilizar que leer.

#### opciones
Tipo: `Object`

Opciones pasadas a [node-glob] a través de [glob-stream].

gulp añade dos opciones además de las [soportadas por node-glob][node-glob documentation] y [glob-stream]:

#### opciones.buffer
Tipo: `Boolean`
Por defecto: `true`

Poner esta opción a `false` devolverá los `file.contents` como un `stream` y no cargará los archivos en memoria. Útil cuando se está trabajando con archivos grandes.

#### opciones.read
Tipo: `Boolean`
Por defecto: `true`

Poner esta opción a `false` devolverá los `file.contents` como `null`  y no leerá archivo alguno.

#### opciones.base
Tipo: `String`
Por defecto: todo lo anterior al glob (ver [glob2base])

E.g., considera un archivo `somefile.js` en `client/js/somedir`:

```js
gulp.src('client/js/**/*.js') // Iguala a 'client/js/somedir/somefile.js' y resuelve `base` a `client/js/`
  .pipe(minify())
  .pipe(gulp.dest('build'));  // Escribe 'build/somedir/somefile.js'

gulp.src('client/js/**/*.js', { base: 'client' })
  .pipe(minify())
  .pipe(gulp.dest('build'));  // Escribe 'build/js/somedir/somefile.js'
```

### gulp.dest(ruta[, opciones])

Puede ser conectado a un stream y creará archivos. Re-emite todo dato que le pasa de modo que puede conectarse via streams a múltiples directorios. Los directorios que no existan serán creados.

```javascript
gulp.src('./client/templates/*.jade')
  .pipe(jade())
  .pipe(gulp.dest('./build/templates'))
  .pipe(minify())
  .pipe(gulp.dest('./build/minified_templates'));
```

La ruta de escritura es determinada añadiendo al directorio de destino la ruta relativa del archivo. En consecuencia, las rutas relativas se calculan respecto a la base del archivo. Ver `gulp.src` arriba para más información.

#### ruta
Tipo: `String` o `Function`

La ruta (directorio de salida) donde escribir archivos. O una función que devuelve la devuelva, función que será provista de un [objeto `File` de vynil](https://github.com/wearefractal/vinyl).

#### opciones
Tipo: `Object`

#### opciones.cwd
Tipo: `String`
Por defecto: `process.cwd()`

`cwd` para el directorio de salida, solo se tendrá en cuenta si el directorio de salida dado es relativo.

#### opciones.mode
Tipo: `String`
Por defecto: `0777`

[Permiso](http://es.wikipedia.org/wiki/Permisos_de_acceso_a_archivos#Notaci.C3.B3n_octal) en formato octal especificando el modo en el que los directorios necesitan ser creados en el directorio de destino.

### gulp.task(nombre[, deps], fn)

Define una tarea utilizando [Orchestrator].

```js
gulp.task('algunnombre', function() {
  // haz cosas
});
```

#### nombre

Nombre de la tarea. Tareas a ejecutar desde la línea de comandos no deben tener espacios en blanco.

#### deps
Tipo: `Array`

Vector de tareas a ejecutarse y completarse antes de ejecutar `mytask`.

```js
gulp.task('mitarea', ['vector', 'de', 'nombres', 'de', 'tareas'], function() {
  // haz cosas
});
```

**Nota:** ¿Tus tareas se están ejecutando antes de que sus dependencias se completen? Asegurate de que sus depencias sigan las especificaciones asíncronas: tomar una función callback o devolver una promesa o event stream.

#### fn

La función que realiza las operaciones de la tarea. Generalmente de la forma `gulp.src().pipe(someplugin())`.

#### Soporte para tareas asíncronas

Cualquier tarea puede hacerse asíncrona si su `fn` hace alguna de las siguientes:

##### Utiliza una función callback

```javascript
// ejecuta un comando en un terminal
var exec = require('child_process').exec;
gulp.task('jekyll', function(cb) {
  // construye Jekyll
  exec('jekyll build', function(err) {
    if (err) return cb(err); // devuelve error
    cb(); // tarea terminada
  });
});
```

##### Retorna un stream

```js
gulp.task('algunnombre', function() {
  var stream = gulp.src('client/**/*.js')
    .pipe(minify())
    .pipe(gulp.dest('build'));
  return stream;
});
```

##### Devuelve una promesa

```javascript
var Q = require('q');

gulp.task('algunnombre', function() {
  var deferred = Q.defer();

  // hacer cosas asíncronas
  setTimeout(function() {
    deferred.resolve();
  }, 1);

  return deferred.promise;
});
```

**Nota:** Por defecto, las tareas se ejecutadan con máxima concurrencia. Es decir, todas las tareas son iniciadas simultáneamente sin esperar. Si quieres crear una sucesión de tareas en un orden específico, debes hacer dos cosas:

- dar una señal de que la tarea se ha completado,
- y señalar que la tarea depende en que otra se complete.

Para estos ejemplos, vamos suponer que tenemos dos tareas, "uno" y "dos" que quieres ejecutar en el este orden:

1. En la tarea "uno" añades la señal indicando cuando esta se ha completado. Ya sea utilizando una función callback y llamarla cuando hayas acabado o devolver una promesa o stream con los que se deba esperar a resolver o terminar respectivamente.

1. En la tarea "dos" añades una señal indicando al motor de gulp que esta tarea depende de que la primera se complete.

Este ejemplo sería así:

```js
var gulp = require('gulp');

// utiliza función callback a llamar para informar a gulp que ha acabado
gulp.task('uno', function(cb) {
    // hacer cosas -- asíncronas o lo contrario...
    cb(err); // si err ni es null ni undefined, la ejecución se detiene, señalando que esta falló
});

// establece que una tarea dependiente debe completarse antes de que esta se inicie
gulp.task('dos', ['uno'], function() {
    // la tarea 'uno' ha terminado ahora
});

gulp.task('default', ['uno', 'dos']);
```

### gulp.watch(glob [, opciones], tareas) o gulp.watch(glob [, opciones, cb])

Observar archivos y hacer algo cuando un archivo cambia. Éste siempre devuelve un EventEmitter que emite `change` events.

### gulp.watch(glob[, opciones], tareas)

#### glob
Tipo: `String` o `Array`

Un único glob o vector de globs que indiquen en qué archivos se han de observar cambios.

#### opciones
Tipo: `Object`

Opciones, que son pasadas a [`gaze`](https://github.com/shama/gaze).

#### tareas
Tipo: `Array`

Nombres de tarea(s) a ejecutar cuando un archivo cambie, añadidas con `gulp.task()`

```js
var watcher = gulp.watch('js/**/*.js', ['uglify','reload']);
watcher.on('change', function(event) {
  console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
});
```

### gulp.watch(glob[, opciones, cb])

#### glob
Tipo: `String` o `Array`

Un único glob o vector de globs que indiquen en qué archivos se han de observar cambios.

#### opciones
Tipo: `Object`

Opciones, que son pasadas a [`gaze`](https://github.com/shama/gaze).

#### cb(evento)
Tipo: `Function`

Función callback a invocar para cada cambio.

```js
gulp.watch('js/**/*.js', function(event) {
  console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
});
```

La función callback es pasada un objeto `event` que describe la modificación:

##### evento.type
Tipo: `String`

El tipo de cambio ocurrido, `added`, `changed` o `deleted`.

##### evento.path
Tipo: `String`

La ruta al archivo que originó el evento.


[node-glob documentation]: https://github.com/isaacs/node-glob#opciones
[node-glob]: https://github.com/isaacs/node-glob
[glob-stream]: https://github.com/wearefractal/glob-stream
[gulp-if]: https://github.com/robrich/gulp-if
[Orchestrator]: https://github.com/robrich/orchestrator
[glob2base]: https://github.com/wearefractal/glob2base
