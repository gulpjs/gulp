# Vue projects builds with browserify, vueify and watchify

[Vue.js](https://vuejs.org/) has a [browserify](https://github.com/browserify/browserify)
transform, know as [vueify](https://github.com/vuejs/vueify) that allows to
process Vue projects, including VUE component files. Also, we can combine with
[envify](https://github.com/hughsk/envify) and [babelify](https://github.com/babel/babelify)
transforms to generate cross-browser production ready bundle files.

This recipe is based on a
[Fishrock123 gist](https://gist.github.com/Fishrock123/8ea81dad3197c2f84366)

``` javascript
'use strict';

const gulp = require('gulp');
const util = require('gulp-util');
const browserify = require('browserify');
const envify = require('envify');
const watchify = require('watchify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const sourcemaps = require('gulp-sourcemaps');


const browserifyOpts = {
  'entries': './src/index.js',
  'debug': process.env.NODE_ENV != 'production'
};

gulp.task('build', function() {
  const bundler = browserify(browserifyOpts)
    .transform({global: true}, envify, {NODE_ENV: 'production'})
    .transform('vueify')
    .transform('babelify');
  return bundle_js(bundler);
});

gulp.task('watchify', function() {
  const bundler = watchify(browserify(browserifyOpts))
    .transform({global: true}, envify, {NODE_ENV: 'production'})
    .transform('vueify')
    .transform('babelify')
    .plugin('browserify-hmr');
  bundle_js(bundler);

  bundler.on('update', function(){
    bundle_js(bundler);
  });

});

function bundle_js(bundler) {
  util.log('This build is for', process.env.NODE_ENV , 'environment.');
  return bundler
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
//    .pipe(sourcemaps.init({loadMaps: true}))
    // Add transformation tasks to the pipeline here
//    .pipe(sourcemaps.write('./')) // writes .map file
    .pipe(gulp.dest('./dist'));
}

```

