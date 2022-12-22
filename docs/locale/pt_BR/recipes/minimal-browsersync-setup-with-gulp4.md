# Configuração mínima para usar BrowserSync com Gulp 4

[BrowserSync](https://www.browsersync.io/) é uma ótima ferramenta para simplificar o processo de desenvolvimento com a habilidade de refletir alterações no código, instantaneamente, no browser (usando _live-reloading_).

Configurar um servidor BrowserSync com _live-reloading_ usando Gulp 4 é bem fácil e claro.

## Passo 1: instale as dependências

```
npm install --save-dev browser-sync
```

## Passo 2: configure a estrutura do projeto

```
src/
  scripts/
    |__ index.js
dist/
  scripts/
index.html
gulpfile.babel.js
```

O objetivo aqui é conseguir:

- Fazer build do código fonte em `src/scripts/`;
  - Por exemplo: compilar com Babel, minimizar e etc.
- Colocar a versão compilada em `dist/scripts`, para usar no `index.html`;
- Observar alterações no código fonte e refazer a build no diretório `dist`;
- Toda vez que refizermos a build em `dist`, atualizar o navegador para refletir as mudanças, imediatamente.

## Passo 3: criar o gulpfile

O gulpfile pode ser dividido, em três partes.

### 1. Crie a tarefa para preparar a pasta dist

Para mais informações, leia noss [README](https://github.com/gulpjs/gulp/blob/4.0/README.md#use-last-javascript-version-in-your-gulpfile) principal.

```javascript
import babel from 'gulp-babel';
import concat from 'gulp-concat';
import del from 'del';
import gulp from 'gulp';
import uglify from 'gulp-uglify';

const paths = {
  scripts: {
    src: 'src/scripts/*.js',
    dest: 'dist/scripts/'
  }
};

const clean = () => del(['dist']);

function scripts() {
  return gulp.src(paths.scripts.src, { sourcemaps: true })
    .pipe(babel())
    .pipe(uglify())
    .pipe(concat('index.min.js'))
    .pipe(gulp.dest(paths.scripts.dest));
}
```

### 2. Configurar o servidor BrowserSync

Crie as tarefas para servir e recarregar o servidor.

```javascript
import browserSync from 'browser-sync';
const server = browserSync.create();

function reload(done) {
  server.reload();
  done();
}

function serve(done) {
  server.init({
    server: {
      baseDir: './'
    }
  });
  done();
}
```

### 3. Observar mudanças no código fonte, refazer build dos scripts e recarregar o servidor

Isso é facilmente feito com `gulp.series`.

```javascript
const watch = () => gulp.watch(paths.scripts.src, gulp.series(scripts, reload));
```

## Passo 4: juntar tudo

O último passo é: exportar a tarefa padrão e...

```javascript
const dev = gulp.series(clean, scripts, serve, watch);
export default dev;
```

...aproveitar.

```bash
$ gulp
```

Agora, se você for até [http://localhost:3000](http://localhost:3000), que é o endereço padrão do servidor BrowserSync, verá que o resultado final no navegador é atualizado toda vez que você altera o conteúdo do código fonte.

Assim que ficou, todo o gulpfile:

```javascript
import babel from 'gulp-babel';
import concat from 'gulp-concat';
import del from 'del';
import gulp from 'gulp';
import uglify from 'gulp-uglify';
import browserSync from 'browser-sync';

const server = browserSync.create();

const paths = {
  scripts: {
    src: 'src/scripts/*.js',
    dest: 'dist/scripts/'
  }
};

const clean = () => del(['dist']);

function scripts() {
  return gulp.src(paths.scripts.src, { sourcemaps: true })
    .pipe(babel())
    .pipe(uglify())
    .pipe(concat('index.min.js'))
    .pipe(gulp.dest(paths.scripts.dest));
}

function reload(done) {
  server.reload();
  done();
}

function serve(done) {
  server.init({
    server: {
      baseDir: './'
    }
  });
  done();
}

const watch = () => gulp.watch(paths.scripts.src, gulp.series(scripts, reload));

const dev = gulp.series(clean, scripts, serve, watch);
export default dev;
```
