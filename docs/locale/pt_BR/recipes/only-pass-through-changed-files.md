# Só fazer pipe de arquivos alterados

Arquivos são passados por toda cadeia de pipe, em toda execução, por padrão. Usando [gulp-changed](https://github.com/sindresorhus/gulp-changed), só arquivos alterados serão passados. Isso pode aumentar a velocidade das próximas execuções, consideravelmente.


```js
// npm install --save-dev gulp gulp-changed gulp-jscs gulp-uglify

var gulp = require('gulp');
var changed = require('gulp-changed');
var jscs = require('gulp-jscs');
var uglify = require('gulp-uglify');

/* definimos algumas constantes, aqui,
 * para que possam ser reutilizadas. */
var SRC = 'src/*.js';
var DEST = 'dist';

gulp.task('default', function() {
	return gulp.src(SRC)
    /* as tarefa `changed` precisa precisa saber o 
     * diretório de destino com antecedência, 
     * para conseguir entender quais arquivos alteraram */
		.pipe(changed(DEST))
    // só arquivos alterados vão passar por aqui
		.pipe(jscs())
		.pipe(uglify())
		.pipe(gulp.dest(DEST));
});
```
