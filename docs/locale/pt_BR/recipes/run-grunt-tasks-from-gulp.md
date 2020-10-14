# Executar tarefas Grunt no Gulp

É possível executar tarefas ou plugins Grunt, dentro do Gulp.

Isso pode ser útil durante uma migração gradual do Grunt para o Gulp ou se houver algum plugin especial que você precisa.

Com a abordagem descrita, não é necessário ter Grunt CLI ou Gruntfile.

**Esta abordagem requer Grunt >=1.0.0**

Um exemplo bem simples de `gulpfile.js`:

```js
// npm install gulp grunt grunt-contrib-copy --save-dev

var gulp = require('gulp');
var grunt = require('grunt');

grunt.initConfig({
    copy: {
        main: {
            src: 'src/*',
            dest: 'dest/'
        }
    }
});
grunt.loadNpmTasks('grunt-contrib-copy');

gulp.task('copy', function (done) {
    grunt.tasks(
        // você pode adicionar mais tarefas grunt, nessa array
        ['copy:main'],
        // não precisa procurar por um Gruntfile,
        // já que ele não existe :-)
        {gruntfile: false},
        function () {done();}
    );
});

```

Agora, inicie a tarefa com: `gulp copy`

Com a abordagem mostrada, as tarefas Grunt são registradas dentro do sistema de tarefas do Gulp. 

**Mantenha em mente que tarefas Grunt travam a execução (diferente do Gulp). Por isso, nenhuma outra tarefa conseguirá rodar (incluindo tarefas Gulp), até que a tarefa Grunt em questão finalize.**


### Um resumo sobre outras alternativas

Existe um módulo *gulpfriendly* chamado [gulp-grunt](https://www.npmjs.org/package/gulp-grunt) e que possui uma abordagem diferente.

Esse módulo gera processos filhos e dentro deles as tarefas Grunt são executadas.

No entando, a forma como isso funciona traz algumas limitações:

* No momento, não é possível passar opções e argumentos via CLI para as tarefas Grunt;
* Todas as tarefas Grunt precisam ser definidas, em um Gruntfile separado;
* Você precisa ter o Grunt CLI instalado;
* O output de algumas tarefas Grunt é mal formatado.
  * Por exemplo: código de cores.
