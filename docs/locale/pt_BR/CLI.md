## Documentos da CLI do gulp

### Flags

gulp possui poucas flags a se conhecer. A maioria das flags são destinadas a tarefas, quando necessárias.

- `-v` ou `--version` exibe as versões local ou global do gulp.
- `--require <module path>` requisita um módulo antes de rodar o gulpfile. É útil para transpiladores mas também possui outras aplicações. O uso de múltiplas flags `--require` é permitido.
- `--gulpfile <gulpfile path>` define um caminho manualmente para o gulpfile. Útil caso existam múltiplos gulpfiles. A opção também irá definir o CWD para o diretório do gulpfile.
- `--cwd <dir path>` define o CWD manualmente. A busca pelo gulpfile, assim como a relatividade de todas as requisições, serão feitas a partir daqui.
- `-T` ou `--tasks` exibe a árvore de dependências das tarefas para o gulpfile carregado. Ele também inclui o nome das tarefas e suas respectivas [descrições](./API.md#fndescription).
- `--tasks-simple` exibe uma lista de tarefas em texto puro para o gulpfile carregado.
- `--verify` verifica os plugins referenciados no package.json do projeto e os compara com as entradas na lista negra de plugins.
- `--color` força o gulp e seus plugins a exibir cores mesmo quando nenhum suporte de cor for detectado.
- `--no-color` força o gulp e seus plugins a não exibir cores mesmo quando o suporte de cores for detectado.
- `--silent` desabilita todos os logs do gulp.

A CLI adiciona o process.env.INIT_CWD, que é o cwd original usado para sua execução.

#### Flags específicas a tarefas

Recorra a este link do [StackOverflow](https://stackoverflow.com/questions/23023650/is-it-possible-to-pass-a-flag-to-gulp-to-have-it-run-tasks-in-different-ways) para entender como adicionar flags específicas a tarefas.

### Tarefas

Tarefas são executadas ao rodar `gulp <task> <task>...`.

Se mais de uma tarefa for listada, o Gulp as executa simultaneamente,
isto é, como se estivessem listadas como dependências em uma única tarefa.

Gulp não serializa as tarefas listadas na linha de comando. Ao usar outras
ferramentas semelhantes, os usuários podem esperar a possibilidade de executar
algo como `gulp clean build`, usando tarefas nomeadas como `clean` e `build`.
No entanto, isso não gera o resultado desejado, já que as duas tarefas
serão executadas simultaneamente.

Rodar apenas `gulp` executa a tarefa `default`. Caso não exista uma
tarefa `default`, gulp retorna um erro.

### Compiladores

Você consegue encontrar uma lista de linguagens suportadas em [interpret](https://github.com/tkellen/node-interpret#jsvariants). Caso deseje adicionar suporte para uma nova linguagem,
envie uma pull request ou abra uma issue.

### Exemplos

#### Exemplo de gulpfile

```js
gulp.task('one', function(done) {
  // fazer alguma coisa
  done();
});

gulp.task('two', function(done) {
  // fazer alguma coisa
  done();
});

gulp.task('three', three);

function three(done) {
  done();
}
three.description = "Esta é a descrição da tarefa three";

gulp.task('four', gulp.series('one', 'two'));

gulp.task('five',
  gulp.series('four',
    gulp.parallel('three', function(done) {
      // fazer mais coisas
      done();
    })
  )
);
```

### `-T` or `--tasks`

Comando: `gulp -T` or `gulp --tasks`

Saída:
```shell
[20:58:55] Tasks for ~\exampleProject\gulpfile.js
[20:58:55] ├── one
[20:58:55] ├── two
[20:58:55] ├── three                                         Esta é a descrição da tarefa three
[20:58:55] ├─┬ four
[20:58:55] │ └─┬ <series>
[20:58:55] │   ├── one
[20:58:55] │   └── two
[20:58:55] ├─┬ five
[20:58:55] │ └─┬ <series>
[20:58:55] │   ├─┬ four
[20:58:55] │   │ └─┬ <series>
[20:58:55] │   │   ├── one
[20:58:55] │   │   └── two
[20:58:55] │   └─┬ <parallel>
[20:58:55] │     ├── three
[20:58:55] │     └── <anonymous>
```

### `--tasks-simple`

Comando: `gulp --tasks-simple`

Saída:
```shell
one
two
three
four
five
```
