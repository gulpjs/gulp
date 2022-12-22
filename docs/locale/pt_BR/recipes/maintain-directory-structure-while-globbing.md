# Manter Estrutura Original do Diretório Enquanto usa Globs

Se você está planejando ler alguns arquivos/pastas de algum diretório, enquanto mantém os caminhos relativos: você precisa passar `{base: '.'}` como o segundo argumento de `gulp.src()`.

Por exemplo, se você tem uma estrutura de diretório como essa...

![Dev setup](https://cloud.githubusercontent.com/assets/2562992/3178498/bedf75b4-ec1a-11e3-8a71-a150ad94b450.png)

...e só quer ler alguns arquivos, como esses...

```js
[ 'index.html',
 'css/**',
 'js/**',
 'lib/**',
 'images/**',
 'plugin/**'
 ]
```

...Gulp vai ler todos os sub-diretórios da pasta (digamos) `css` e organizá-los em relação ao seu diretório raíz, fazendo com que eles não sejam mais sub-diretórios de `css`.

O output, depois de usar globs, seria algo como isso:

![Zipped-Unzipped](https://cloud.githubusercontent.com/assets/2562992/3178614/27208c52-ec1c-11e3-852e-8bbb8e420c7f.png)

Agora, se você quiser manter a estrutura original, é preciso passar `{base: '.'}` para `gulp.src()`:

```js
gulp.task('task', function () {
   return gulp.src(['index.html',
             'css/**',
             'js/**',
             'lib/**',
             'images/**',
             'plugin/**'
             ], {base: '.'})
       .pipe(operation1())
       .pipe(operation2());
});
```
Dessa forma, o input de `operation1()` vai criar uma estrutura como essa:

![with-base](https://cloud.githubusercontent.com/assets/2562992/3178607/053d6722-ec1c-11e3-9ba8-7ce39e1a480e.png)
