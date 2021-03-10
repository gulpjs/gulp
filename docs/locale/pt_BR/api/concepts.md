<!-- front-matter
id: concepts
title: API Concepts
hide_title: true
sidebar_label: Concepts
-->

# Conceitos

Os conceitos a seguir são pré-requisitos para o entendimento dos docs da API. Eles serão referenciados ao longo dos mesmos, refira à esta página para explicações detalhadas.

Caso você seja novo por aqui, comece com o [Início Rápido][quick-start-docs].

## Vinyl

Um Vinyl é um objeto de metadado que descreve um arquivo. As propriedades principais de uma instância Vinyl são `path` e `contents` - aspectos centrais de um arquivo no seu sistema
de arquivos. Objetos Vinyl podem ser usados para descrever arquivos de muitas fontes - em um sistema de arquivos local ou qualquer opção de armazenamento remoto.

## Adaptador Vinyl

Já que Vinyl fornece uma maneira de descrever um arquivo, um meio de acessar esses arquivos é necessário. Cada arquivo fonte é acessado usando um Adaptador Vinyl.

Um adaptador expôe:
* Um método com a assinatura `src(globs, [options])` e retorna uma stream que produz objetos Vinyl.
* Um método com a assinatura `dest(folder, [options])` e retorna uma stream que consome objetos Vinyl.
* Quaisquer métodos extras específicos aos seus meios de entrada/saída - tais como o método `symlink` fornece com o `vinyl-fs`. Eles devem sempre retornar streams que produzem e/ou consumem objetos Vinyl.

## Tarefas

Cada tarefa no gulp é uma função Javascript assíncrona que ambos aceita uma callback para tratamento de erros ou retorna uma stream, promise, emissor de eventos, processo filho ou observable. Devido à algumas limitações na plataforma, tarefas síncronas não são suportadas.

Para uma explicação mais detalhada, leia [Criando tarefas][creating-tasks-doc].

## Globs

Um glob é uma string de caracteres literais ou curingas, como `*`, `**`, ou `!`, usados para verificar caminhos de arquivo. Globbing é a ação de localizar arquivos em um sistema de arquivos usando um ou mais globs.

Caso você não possua experiência com globs, leia [Explicando Globs][explaining-globs-docs].

## Glob base

Uma glob base - às vezes chamada de pai do glob - é um segmento de caminho antes de quaisquer caracteres especiais em uma glob string. Assim, o glob base de `/src/js/**.js` é `/src/js/`. Todos os caminhos que batem com o glob são garantidos a compartilhar a glob base - esse segmento de caminho não pode ser variável.

Instâncias Vinyl geradas por `src()` são construídas com o glob base definido como sua propriedade `base`. Quando escrito para o sistema de arquivos com `dest()`, o `base` será removido do caminho de saída para preservar estruturas de diretório.

Para mais informações a fundo, veja o repositório [glob-parent][glob-parent-external].

## Estado no sistema de arquivos

Metadados de arquivos são provenientes de uma instância do [`fs.Stats`][fs-stats-external], existente no Node. Ele está disponível como a propriedade `stat` nas suas instâncias Vinyl e são usadas internamento para determinar se um objeto Vinyl representa um diretório ou um link simbólico. Quando escrito para o sistema de arquivos, permissões e valores temporais são sincronizados a partir da propriedade `stat`, proveniente do objeto Vinyl.

## Modos no sistema de arquivos

Os modos no sistema de arquivos determinam quais permissões existem para um arquivo. A maioria dos arquivos e diretórios no seu sistema de arquivos possuem um modo bastante permissivo, permitindo que o gulp leia/escreve/atualize arquivos em seu nome. Por padrão, o gulp irá criar arquivos com as mesmas permissões que o processo em execução, mas você pode configurar os modos através das opções em `src()`, `dest()`, etc. Caso você passe por problemas de permissão (EPERM), reveja os modos de seus arquivos.

## Módulos

gulp é composto de múltiplos módulos menores que são unidos para trabalhar de forma coesiva. Ao utilizar [semver][semver-external] no interior dos módulos pequenos, nós podemos liberar correções de bugs e features sem publicar novas versões do gulp. Frequentemente, quando você não ver progresso no repositório principal, o trabalho está sendo feito em um desses módulos.

Caso você esteja passando por problemas, certifique-se de que seus módulos atuais são atualizados usando o comando `npm update`. Se o problema persistir, abra uma issue no repositório individual do projeto.

* [undertaker][undertaker-external] - o sistema para registro de tarefas
* [vinyl][vinyl-external] - os objetos do arquivo virtual
* [vinyl-fs][vinyl-fs-external] - um adaptador vinyl para seu sistema local de arquivos
* [glob-watcher][glob-watcher-external] - o vigia de arquivos
* [bach][bach-external] - orquestração de tarefas usando `series()` e `parallel()`
* [last-run][last-run-external] - acompanha o último período de execução de uma tarefa
* [vinyl-sourcemap][vinyl-sourcemap-external] - suporte nativo de sourcemap
* [gulp-cli][gulp-cli-external] - a interface de linha de comando para interações com o gulp

[quick-start-docs]: ../getting-started/1-quick-start.md
[creating-tasks-doc]: ../getting-started/3-creating-tasks.md
[explaining-globs-docs]: ../getting-started/6-explaining-globs.md
[undertaker-external]: https://github.com/gulpjs/undertaker
[vinyl-external]: https://github.com/gulpjs/vinyl
[vinyl-fs-external]: https://github.com/gulpjs/vinyl-fs
[glob-watcher-external]: https://github.com/gulpjs/glob-watcher
[bach-external]: https://github.com/gulpjs/bach
[last-run-external]: https://github.com/gulpjs/last-run
[vinyl-sourcemap-external]: https://github.com/gulpjs/vinyl-sourcemap
[gulp-cli-external]: https://github.com/gulpjs/gulp-cli
[semver-external]: https://semver.org
[fs-stats-external]: https://nodejs.org/api/fs.html#fs_class_fs_stats
[glob-parent-external]: https://github.com/es128/glob-parent
