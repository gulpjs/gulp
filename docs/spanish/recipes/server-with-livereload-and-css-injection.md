# Servidor con live-reloading e inyección CSS

Con [BrowserSync](http://browsersync.io) y gulp puedes crear fácilmente un servidor de desarollo que es accesible a cualquier dispositivo de la misma red WiFi. BrowserSync tambien incluye live-reload, así que no hay nada más que configurar.

Primero instala el módulo:

```sh
$ npm install --save-dev browser-sync
```

Luego considera la siguiente estructura de archivos...

```
gulpfile.js
app/
  styles/
    main.css
  scripts/
    main.js
  index.html
```

... puedes fácilmente servir archivos desde el directorio `app` y refrescar los navegadores si cualquiera de estos directorios cambia con lo siguiente:

```js
var browserSync = require('browser-sync');
var reload = browserSync.reload;

// watch files for changes and reload
gulp.task('serve', function() {
  browserSync({
    server: {
      baseDir: 'app'
    }
  });

  gulp.watch(['*.html', 'styles/**/*.css', 'scripts/**/*.js'], {cwd: 'app'}, reload);
});

```


## + CSS pre-procesadores

Es algo común el recargar los archivos CSS cuando han sido preprocesados. UUsando Sass como ejemplo, así es como puedes instruir a los navegadores a refresar CSS sin hacer un carga completa de la página

```js
var sass = require('gulp-ruby-sass');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

gulp.task('sass', function() {
  return gulp.src('scss/styles.scss')
    .pipe(sass())
    .pipe(gulp.dest('css'))
    .pipe(reload({ stream:true }));
});

// observar los cambios y refrescar
gulp.task('serve', function() {
  browserSync({
    server: {
      baseDir: 'app'
    }
  });

  gulp.watch('scss/*.scss', ['sass']);
});
```


## Extras

- Live reload, inyección CSS y sincronizado de scroll/forms funciona sin problema dentro de las máquinas virtuales de [BrowserStack](http://www.browserstack.com/).
- Fija `tunnel: true` para ver tu sitio local en una URL publica (completa con todas las prestaciones de BrowserSync).
