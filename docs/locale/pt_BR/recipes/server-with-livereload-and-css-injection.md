# Sevidor com live-reloading e injeção de CSS

Com [BrowserSync](https://browsersync.io) e Gulp, você pode facilmente criar um servidor de desenvolvimento acessível à qualquer dispositivo disponível na rede WiFi.

BrowserSync também possui _live-reloading_ integrado, para que não haja mais nada para configurar.

Primeiro, instale os módulos:

```sh
$ npm install --save-dev gulp browser-sync
```

Depois, considerando a seguinte estrutura de arquivos...

```
gulpfile.js
app/
  styles/
    main.css
  scripts/
    main.js
  index.html
```

...você pode facilmente servir arquivos à partir do diretório `app` e ter todos os navegadores atualizando por conta própria, quando algum desses arquivos alterarem.

Para isso, use o seguinte `gulpfile.js`:

```js
var gulp = require('gulp');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

// observa alterações em arquivos e atualiza o navegador
gulp.task('serve', function() {
  browserSync({
    server: {
      baseDir: 'app'
    }
  });

  gulp.watch(['*.html', 'styles/**/*.css', 'scripts/**/*.js'], {cwd: 'app'}, reload);
});

```

Também é preciso incluir o CSS, em `index.html`:

```html
<html>
  <head>
    ...
    <link rel="stylesheet" href="styles/main.css">
    ...

```

Para servir seus arquivos e abrir o navegador na URL padrão, execute:

```bash
gulp serve
```


## + Pré-processadores CSS

Um caso de uso comum é recarregar arquivos CSS, depois que eles forem pré-processados.

Usando Sass como exemplo, é assim que você pode instruir os navegadores à recarregar o CSS, sem fazer _full-page refresh_.

Considerando esta estrutura de arquivos atualizada...

```
gulpfile.js
app/
  scss/
    main.scss
  scripts/
    main.js
  index.html
```

...você pode facilmente observar arquivos Sass do diretório `scss` e ter todos os navegadores atualizando, quando algum desses arquivos alterarem.

Para isso, use o seguinte `gulpfile.js`:

```js
var gulp = require('gulp');
var sass = require('gulp-ruby-sass');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

gulp.task('sass', function() {
  return sass('scss/styles.scss')
    .pipe(gulp.dest('app/css'))
    .pipe(reload({ stream:true }));
});

/* observa alterações em arquivos Sass, executa o 
 * pré-processador Sass usando a tarefa 'sass' e 
 * recarrega a página. */
gulp.task('serve', gulp.series('sass', function() {
  browserSync({
    server: {
      baseDir: 'app'
    }
  });

  gulp.watch('scss/*.scss', gulp.series('sass'));
}));
```

Também é preciso incluir o CSS, em `index.html`:

```html
<html>
  <head>
    ...
    <link rel="stylesheet" href="css/main.css">
    ...

```

Para servir seus arquivos e abrir o navegador na URL padrão, execute:

```bash
gulp serve
```

## Bônus

- Live reload, injeção de CSS e sincronização de scroll/formulário funciona muito bem em máquinas virtuais [BrowserStack](https://www.browserstack.com/).
- Use `tunnel: true` para ver seu site local em uma URL pública (completo com todos os recursos do BrowserSync).
