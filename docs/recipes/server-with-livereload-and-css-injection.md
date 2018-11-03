# Server with live-reloading and CSS injection

With [BrowserSync](https://browsersync.io) and gulp, you can easily create a development server that is accessible to any device on the same WiFi network. BrowserSync also has live-reload built in, so there's nothing else to configure.

First install the modules:

```sh
$ npm install --save-dev gulp@next browser-sync
```

Then, considering the following file structure...

```
gulpfile.js
app/
  styles/
    main.css
  scripts/
    main.js
  index.html
```

... you can easily serve files from the `app` directory and have all browsers reload when any of them change with the following in `gulpfile.js`:

```js
var gulp = require('gulp');
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

and including the CSS in `index.html`:

```html
<html>
  <head>
    ...
    <link rel="stylesheet" href="styles/main.css">
    ...

```

to serve your files and launch a browser window pointing to the default URL (http://localhost:3000) run:

```bash
gulp serve
```


## + CSS pre-processors

A common use-case is to reload CSS files after they've been pre-processed. Using Sass as an example, this is how you can instruct browsers to reload the CSS without doing a full-page refresh.

Considering this updated file structure...

```
gulpfile.js
app/
  scss/
    main.scss
  scripts/
    main.js
  index.html
```
... you can easily watch Sass files from the `scss` directory and have all browsers reload when any of them change with the following in `gulpfile.js`:

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

// watch Sass files for changes, run the Sass preprocessor with the 'sass' task and reload
gulp.task('serve', gulp.series('sass', function() {
  browserSync({
    server: {
      baseDir: 'app'
    }
  });

  gulp.watch('scss/*.scss', gulp.series('sass'));
}));
```

and including the pre-processed CSS in `index.html`:

```html
<html>
  <head>
    ...
    <link rel="stylesheet" href="css/main.css">
    ...

```

to serve your files and launch a browser window pointing to the default URL (http://localhost:3000) run:

```bash
gulp serve
```

## Extras

- Live reload, CSS injection and scroll/form syncing works seamlessly inside of [BrowserStack](https://www.browserstack.com/) virtual machines.
- Set `tunnel: true` to view your local site at a public URL (complete with all BrowserSync features).
