# Especificando un nuevo cwd (current working directory)

Esto es útil para proyectos que tienen una estructura anidada como:

```
/project
  /layer1
  /layer2
```

Puedes usar la opción `--cwd` desde el terminal.

Desde el directorio `project/`:

```sh
gulp --cwd layer1
```

Si solo necesitas especificar un cwd para un cierto glob puedes usar la opción `cwd` option en un [glob-stream](https://github.com/wearefractal/glob-stream):

```js
gulp.src('./some/dir/**/*.js', { cwd: 'public' });
```
