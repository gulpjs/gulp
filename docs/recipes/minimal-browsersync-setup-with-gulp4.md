# Minimal BrowserSync setup with Gulp 4

[BrowserSync](https://www.browsersync.io/) is a great tool to streamline
the development process with the ability to reflect code changes instantaneously
in the browser through live-reloading. Setting up a live-reloading
BrowserSync server with Gulp 4 is very clean and easy.

## Step 1: Install the dependencies

```
npm install --save-dev browser-sync
```

## Step 2: Setup the project structure

```
src/
  scripts/
    |__ index.js
dist/
  scripts/
index.html
gulpfile.babel.js
```

The goal here is to be able to:
- Build the source script file in `src/scripts/`, e.g. compiling with babel, minifying, etc.
- Put the compiled version in `dist/scripts` for use in `index.html`
- Watch for changes in the source file and rebuild the `dist` package
- With each rebuild of the `dist` package, reload the browser to immediately reflect the changes

## Step 3: Write the gulpfile

The gulpfile could be broken in 3 parts.

### 1. Write the task to prepare the dist package as usual

Refer to the main [README](https://github.com/gulpjs/gulp/blob/4.0/README.md#use-last-javascript-version-in-your-gulpfile)
for more information.

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

### 2. Setup the BrowserSync server

And write the tasks to serve and reload the server accordingly.

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

### 3. Watch for source change, rebuild the scripts and reload the server

This is trivially accomplished with `gulp.series`

```javascript
const watch = () => gulp.watch(paths.scripts.src, gulp.series(scripts, reload));
```

## Step 4: Bring it all together

The last step is to expose the default task

```javascript
const dev = gulp.series(clean, scripts, serve, watch);
export default dev;
```

And profit

```bash
$ gulp
```

Now if you go to [http://localhost:3000](http://localhost:3000), which is the default address of the
BrowserSync server, you will see that the end result in the browser is updated everytime you change
the content of the source file. Here is the whole gulpfile:

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
