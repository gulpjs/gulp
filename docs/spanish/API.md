## Documentacion del API

### gulp.src(globs[, options])

Emite los archivos especificados en el glob o vector de globs. Retorna un [stream](http://nodejs.org/api/stream.html) de [objetos Vinyl ](https://github.com/wearefractal/vinyl-fs)
que pueden ser [conectados](http://nodejs.org/api/stream.html#stream_readable_pipe_destination_options)
a otros plugins.

**Nota:** [Vinyl](https://github.com/wearefractal/vinyl) es un módulo node que describe un simple formato para archivos vía objetos `File`.

```javascript
gulp.src('client/templates/*.jade')
  .pipe(jade())
  .pipe(minify())
  .pipe(gulp.dest('build/minified_templates'));
```

`glob`, se refiere a [node-glob](https://github.com/isaacs/node-glob) o puede ser simplemente la ruta a un archivo.

#### globs
Tipo: `String` o `Array`

Glob o vector de globs a utilizar para la búsqueda.

#### options
Tipo: `Object`

Opciones que utiliza el [node-glob] vía [glob-stream].

Adicionalmente a las [opciones soportadas por node-glob][node-glob documentation] y [glob-stream], gulp añade:

#### options.buffer
Tipo: `Boolean`
Por defecto: `true`

Si es `false` devuelve `file.contents` como un `stream` en vez de un buffer de archivos. Útil al utilizar archivos grandes.
**Nota:** No es estrictamente necesario implementar el soporte a streams en plugins.

#### options.read
Tipo: `Boolean`
Por defecto: `true`

Si es `false` devuelve `file.contents` como `null`  y no lee el archivo.

#### options.base
Tipo: `String`
Por defecto: ruta completa antes del glob (ver [glob2base])

Por ejemplo, considera un archivo `somefile.js` en `client/js/somedir`:

```js
gulp.src('client/js/**/*.js')
// Iguala a 'client/js/somedir/somefile.js' y hace `base` `client/js/`
  .pipe(minify())
  .pipe(gulp.dest('build'));  
  // Escribe en 'build/somedir/somefile.js'

gulp.src('client/js/**/*.js', { base: 'client' })
  .pipe(minify())
  .pipe(gulp.dest('build'));  
  // Escribe 'build/js/somedir/somefile.js'
```

### gulp.dest(path[, options])

Puede ser conectado y crea / modifica archivos. Re-emite el stream de datos de modo que puede ser conectado a múltiples directorios. Si los directorios no existen serán creados.

```javascript
gulp.src('./client/templates/*.jade')
  .pipe(jade())
  .pipe(gulp.dest('./build/templates'))
  .pipe(minify())
  .pipe(gulp.dest('./build/minified_templates'));
```

La ruta de escritura es determinada añadiendo la ruta relativa del archivo al directorio de destino. Igualmente, rutas relativas son determinadas con respecto la base del archivo. Ver `gulp.src` arriba.

#### path
Tipo: `String` o `Function`

La ruta / directorio al cual archivos serán escritos. O una función que devuelve la ruta. Esta función sera provista de un [objeto `File` de vynil](https://github.com/wearefractal/vinyl).

#### options
Tipo: `Object`

#### options.cwd
Tipo: `String`
Por defecto: `process.cwd()`

`cwd` para el directorio a escribir, solo es efectivo si el directorio especificado es relativo.

#### options.mode
Tipo: `String`
Por defecto: `0777`

[Permisos de acceso](http://es.wikipedia.org/wiki/Permisos_de_acceso_a_archivos#Notaci.C3.B3n_octal) en formato octal especificando el modo de los directorios a crear.

### gulp.task(name[, deps], fn)

Define una tarea utilizando [Orchestrator].

```js
gulp.task('somename', function() {
  // haz algo
});
```

#### name

Nombre de la tarea. Tareas a ejecutar desde la línea de comandos no deben tener espacios en blanco.

#### deps
Tipo: `Array`

Vector de tareas a ejecutarse y completarse antes de ejecutar `mytask`.

```js
gulp.task('mytask', ['vector', 'de', 'tareas'], function() {
  // haz algo
});
```

**Nota:** Si tienes tareas ejecutándose antes de completar subtareas asegúrate de que las subtareas siguen las especificaciones para tareas asíncronas: tomar una función callback o retornar una promesa o event stream.

#### fn

La función que realiza las operaciones de la tarea. Generalmente de la forma `gulp.src().pipe(someplugin())`.

#### Tareas asíncronas

Cualquier tarea puede ejecutarse de manera asíncrona si `fn`:

##### Acepta una función callback

```javascript
// ejecuta un comando en la shell
var exec = require('child_process').exec;
gulp.task('jekyll', function(cb) {
  // ejecuta Jekyll
  exec('jekyll build', function(err) {
    if (err) return cb(err); // devuelve error
    cb(); // tarea completada!
  });
});
```

##### Retorna un stream

```js
gulp.task('somename', function() {
  var stream = gulp.src('client/**/*.js')
    .pipe(minify())
    .pipe(gulp.dest('build'));
  return stream;
});
```

##### Retorna una promesa

```javascript
var Q = require('q');

gulp.task('somename', function() {
  var deferred = Q.defer();

  // operaciones asíncronas
  setTimeout(function() {
    deferred.resolve();
  }, 1);

  return deferred.promise;
});
```

**Nota:** Las tareas son ejecutadas con máxima concurrencia. Es decir, todas las tareas son iniciadas simultáneamente sin esperar. Para crear tareas en un orden específico, es necesario:

- especificar cuando la tarea es completada,
- y especificar que una tarea depende en otra para ejecutarse.

Por ejemplo, para dos tareas, _A_ y _B_ que deben ser ejecutadas en el mismo orden se procede de la siguiente manera:

1. Al crear _A_, la función puede tomar una función callback a invocar al culminar la tarea o retornar una promesa o stream que indica a gulp esperar.

2. Al crear _B_ se especifica un vector con _A_ que establece la dependencia, es decir, para ejecutar _B_, _A_ debe primero culminar.

A continuación una posible implementación del ejemplo anterior:

```js
var gulp = require('gulp');

// toma una función callback a invocar para informar a gulp que la tarea ha culminado
gulp.task('A', function(cb) {
    // operaciones síncronas o asíncronas...
    cb(err);
    // si err no es null o undefined, la ejecución se detiene, anunciando que falló
});

// identifica que la tarea B debe ser ejecutada cuando A es completada. gulp determina que A ha culminado cuando la función callback pasada al crear A es invocada
gulp.task('B', ['A'], function() {
    // ya 'A' ha completado
});

gulp.task('default', ['A', 'two']);
```

### gulp.watch(glob [, opts], tasks) o gulp.watch(glob [, opts, cb])

Vigila modificaciones en archivos y realiza una acción si algún cambio es detectado. Siempre devuelve un EventEmitter que emite eventos.

### gulp.watch(glob[, opts], tasks)

#### glob
Tipo: `String` o `Array`

glob o vector de globs que indican que archivos serán vigilados por cambios.

#### opts
Tipo: `Object`

Opciones pasadas a [`gaze`](https://github.com/shama/gaze).

#### tasks
Tipo: `Array`

Nombres de las tareas (agregadas con `gulp.task()`) a ejecutar cuando un archivo es modificado.

```js
var watcher = gulp.watch('js/**/*.js', ['uglify','reload']);
watcher.on('change', function(event) {
  console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
});
```

### gulp.watch(glob[, opts, cb])

#### glob
Tipo: `String` o `Array`

glob o vector de globs que indican que archivos serán vigilados por cambios.

#### opts
Tipo: `Object`

Opciones pasadas a [`gaze`](https://github.com/shama/gaze).

#### cb(event)
Tipo: `Function`

Función callback a invocar por cada modificación.

```js
gulp.watch('js/**/*.js', function(event) {
  console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
});
```

La función callback es pasada un objeto `event` que describe la modificación:

##### event.type
Tipo: `String`

El tipo de cambio ocurrido, `added`, `changed` o `deleted`.

##### event.path
Tipo: `String`

La ruta al archivo que originó el evento.


[node-glob documentation]: https://github.com/isaacs/node-glob#options
[node-glob]: https://github.com/isaacs/node-glob
[glob-stream]: https://github.com/wearefractal/glob-stream
[gulp-if]: https://github.com/robrich/gulp-if
[Orchestrator]: https://github.com/robrich/orchestrator
[glob2base]: https://github.com/wearefractal/glob2base
