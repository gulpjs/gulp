## Documentación del CLI

### Flags o parámetros

No necesitas conocer muchos parámetros para utilizar gulp en la terminal. Muchas de las opciones son especialmente útil para tareas.

- `-v` o `--version` muestra la versión global y local de gulp respectivamente.
- `--require <module path>` permite incluir algún módulo antes de ejecutar el gulpfile. Especialmente útil, pero no limitado, para [transcompiladores](http://en.wikipedia.org/wiki/Source-to-source_compiler). Puedes utilizar varios `--require` también.
- `--gulpfile <gulpfile path>` permite especificar la ruta del gulpfile manualmente. Útil si estás utilizando múltiples gulpfiles. También establece el directorio actual (CWD) al directorio del gulpfile.
- `--cwd <dir path>` permite establecer el directorio actual (CWD) manualmente. gulp intentará acceder al gulpfile y posibles módulos incluídos, en relación al directorio especificado.
- `-T` o `--tasks` muestra el árbol de dependencias de tareas del gulpfile.
- `--tasks-simple` muestra la lista de tareas del gulpfile.
- `--color` fuerza a gulp y plugins a utilizar colores, incluso si **no** existe soporte de colores.
- `--no-color` fuerza a gulp y plugins a no utilizar colores, incluso si existe soporte de colores.
- `--silent` desactiva completamente el logging al correr el gulpfile.

El CLI agrega `process.env.INIT_CWD`, es decir, el directorio actual (CWD) desde el que fue ejecutado.

### Tareas

Tareas específicas pueden ser ejecutadas vía `gulp <task>`. Solo `gulp` ejecuta la tarea registrada como `default`. gulp genera un error si la tarea `default` no existe.

### Compilers

Puedes conseguir una lista de los lenguajes con soporte en [interpret](https://github.com/tkellen/node-interpret#jsvariants). Si deseas añadir soporte a otro lenguaje, sigue el enlace y envía un pull request o abre un nuevo asunto en el proyecto.
