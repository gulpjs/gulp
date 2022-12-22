# Especificando um novo cwd (current working directory)

Isso é útil para projetos que usam uma estrutura de diretórios aninhada, como essa:

```
/project
  /layer1
  /layer2
```

Para isso você pode usar a opção do gulp CLI: `--cwd`.

Dentro de um diretório chamado `project/`, seria assim:

```sh
gulp --cwd layer1
```

Se você precisa especificar um cwd para um glob em específico, você pode usar a opção `cwd` em uma [glob-stream](https://github.com/gulpjs/glob-stream):

```js
gulp.src('./some/dir/**/*.js', { cwd: 'public' });
```
