# Server with live-reloading and CSS injection

With [BrowserSync](http://browsersync.io) and gulp, you can easily create a development server that is accessible to any device on the same WiFi network. BrowserSync also has live-reload built in, so there's nothing else to configure.

First install the module:

```sh
$ npm install --save-dev browser-sync
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

... you can easily serve files from the `app` directory and have all browsers reload when any of them change with the following:

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


## + CSS pre-processors

A common use-case is to reload CSS files after they've been pre-processed. Using Sass as an example, this is how you can instruct browsers to reload the CSS without doing a full-page refresh.

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

// watch files for changes and reload
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

- Live reload, CSS injection and scroll/form syncing works seamlessly inside of [BrowserStack](http://www.browserstack.com/) virtual machines.
- Set `tunnel: true` to view your local site at a public URL (complete with all BrowserSync features).
