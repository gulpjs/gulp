# Sólo archivos modificados

Archivos que pasan por toda la cadena del proceso por defecto. Usando [gulp-changed](https://github.com/sindresorhus/gulp-changed) sólo los que han cambiado llegarán al otro lado. Esto puede acelerar ejecuciones consecutivas de una forma considerable.


```js
// npm install --save-dev gulp gulp-changed gulp-jscs gulp-uglify

var gulp = require('gulp');
var changed = require('gulp-changed');
var jscs = require('gulp-jscs');
var uglify = require('gulp-uglify');

// Definamos algunas constantes que puedan reusarse
var SRC = 'src/*.js';
var DEST = 'dist';

gulp.task('default', function() {
	return gulp.src(SRC)
		// La tarea `cambiado` necesita conocer el directorio de destino
		// por adelantado y así poder averiguar qué archivos han cambiado
		.pipe(changed(DEST))
		// sólo los archivos que han cambiado pasarán
		.pipe(jscs())
		.pipe(uglify())
		.pipe(gulp.dest(DEST));
});
```
