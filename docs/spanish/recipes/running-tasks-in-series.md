# Ejectuar tareas en serie, i.e. Dependencia de Tareas

Por defecto, las tareas se ejecutan con máxima concurrencia -- e.g. se ejecutan todas a la vez y sin esperar a que nada. Si quieres crear una serie de tareas que se ejecuten en serie con un orden determinado, necesitas hacer dso cosas:

- indicar cuando la tarea a terminado,
- y señalar que esta depende de que otras se hallan completado.

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
// alternativamente: gulp.task('default', ['two']);
```

Otro ejemplo, el cual devuelve un stream en lugar de usar una función callback:

```js
var gulp = require('gulp');
var del = require('del'); // rm -rf

gulp.task('clean', function(cb) {
    del(['output'], cb);
});

gulp.task('templates', ['clean'], function() {
    var stream = gulp.src(['src/templates/*.hbs'])
        // concatenar, minificar, etc.
        .pipe(gulp.dest('output/templates/'));
    return stream; // devolver el stream como señal completado

});

gulp.task('styles', ['clean'], function() {
    var stream = gulp.src(['src/styles/app.less'])
        // lint, minificar, etc.
        .pipe(gulp.dest('output/css/app.css'));
    return stream;
});

gulp.task('build', ['templates', 'styles']);

// plantillas and estilos se llevarán a cabo en paralelo.
// 'clean' será completada antes de que cualquiera de las dos empiezen
// 'clean' no se ejecutará dos veces, incluso si se llama dos veces como dependencia

gulp.task('default', ['build']);
```
