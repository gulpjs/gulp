## Documentación del CLI

### Flags

gulp tiene muy pocas [flags](http://es.wikipedia.org/wiki/Flag) que conocer. El resto de flags están para el caso en el que las tareas las necesiten.

- `-v` o `--version` muestra la versión global y local de gulp respectivamente.
- `--require <module path>` permite incluir un módulo antes de ejecutar el gulpfile. Esto es útil para [transcompiladores](http://en.wikipedia.org/wiki/Source-to-source_compiler) y también tiene otros usos. Puedes user varias `--require` flags.
- `--gulpfile <gulpfile path>` especifica la ruta del gulpfile manualmente. Útil si tienes múltiples gulpfiles. Esto también cambiará el CWD al directorio del gulpfile.
- `--cwd <dir path>` cambiará el CWD manualmente. Tanto la búsqueda del gulpfile, como la relatividad de todos los requires se tomará desde este directorio.
- `-T` o `--tasks` muestra el árbol de dependencias de tareas del gulpfile cargado.
- `--tasks-simple` muestra una lista de las tareas en texto plano para el gulpfile cargado.
- `--color` forzará a gulp y plugins a utilizar colores, incluso cuando no exista soporte.
- `--no-color` fuerza a gulp y plugins a no utilizar colores, incluso cuando exista soporte.
- `--silent` desactivará todo el logging de gulp.

La CLI agrega `process.env.INIT_CWD`, la ruta original del CWD desde el que gulp fue ejecutado.

### Tareas

Tareas específicas pueden ser ejecutadas vía `gulp <task>`. Si sólo es escribe `gulp` se ejecutará la tarea que registraste como `default`. Y si `default` no existe gulp dará error.

### Compiladores

Puedes encontrar una lista de los lenguajes soportados en [interpret](https://github.com/tkellen/node-interpret#jsvariants). Si quieres añadir soporte para un nuevo lenguaje, abre allí una incidencia o pull request.
