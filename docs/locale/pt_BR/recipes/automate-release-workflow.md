# Automatize o workflow de release

Se seu projeto possui versionamento semântico, pode ser legal automatizar o processo de release.

Abaixo, você encontra uma receita para fazer upgrade da versão do projeto, _commitar_ as alterações e criar uma nova tag.

``` javascript

var gulp = require('gulp');
var conventionalChangelog = require('gulp-conventional-changelog');
var conventionalGithubReleaser = require('conventional-github-releaser');
var bump = require('gulp-bump');
var log = require('gulplog');
var git = require('gulp-git');
var fs = require('fs');

gulp.task('changelog', function () {
  return gulp.src('CHANGELOG.md', {
    buffer: false
  })
    .pipe(conventionalChangelog({
      preset: 'angular' // ou mude para qualquer outra convenção de mensagem de commit que voce gosta
    }))
    .pipe(gulp.dest('./'));
});

gulp.task('github-release', function(done) {
  conventionalGithubReleaser({
    type: "oauth",
    token: 'abcdefghijklmnopqrstuvwxyz1234567890' // troque isso por seu próprio token GitHub ou use uma variável de ambiente
  }, {
    preset: 'angular' // ou mude para qualquer outra convenção de mensagem de commit que voce gosta
  }, done);
});

gulp.task('bump-version', function () {
/* Nós fizemos com que os upgrades de versões sejam 
 * do tipo 'patch', mas pode ser uma boa ideia usar
 * minimist (https://www.npmjs.com/package/minimist).
 * 
 * Usando um argumento junto ao comando, esse pacote 
 * ajuda a determinar se o upgrade é do tipo 'major',
 * 'minor' ou 'patch'. */
  return gulp.src(['./bower.json', './package.json'])
    .pipe(bump({type: "patch"}).on('error', log.error))
    .pipe(gulp.dest('./'));
});

gulp.task('commit-changes', function () {
  return gulp.src('.')
    .pipe(git.add())
    .pipe(git.commit('[Prerelease] Bumped version number'));
});

gulp.task('push-changes', function (done) {
  git.push('origin', 'master', done);
});

gulp.task('create-new-tag', function (done) {
  var version = getPackageJsonVersion();
  git.tag(version, 'Created Tag for version: ' + version, function (error) {
    if (error) {
      return done(error);
    }
    git.push('origin', 'master', {args: '--tags'}, done);
  });

  function getPackageJsonVersion () {
    /* Invés de usar require, nós usamos parse porque 
     * require usa cache quando há múltiplas invocações, 
     * oquê evitaria atualizar o número da versão. */
    return JSON.parse(fs.readFileSync('./package.json', 'utf8')).version;
  };
});

gulp.task('release', gulp.series(
  'bump-version',
  'changelog',
  'commit-changes',
  'push-changes',
  'create-new-tag',
  'github-release'
));

```
