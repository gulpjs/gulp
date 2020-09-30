<!-- front-matter
id: javascript-and-gulpfiles
title: JavaScript and Gulpfiles
hide_title: true
sidebar_label: JavaScript and Gulpfiles
-->

# Javascript e Gulpfiles

Gulp permite que você use seu conhecimento em JavaScript para escrever gulpfiles. No entanto, ainda assim, alguns utilitários estão disponíveis para simplificar o trabalho com filesystem e linha de comando. Todo o resto, você escreve em JavaScript, mesmo.

## Gulpfile: explicado

O gulpfile é um arquivo no seu projeto, chamado `gulpfile.js` (ou de forma capitalizada: `Gulpfile.js`, como em _Makefile_). Esse arquivo é carregado automaticamente, quando o comando `gulp` é executado. 

Dentro deste arquivo, frequentemente, você vai usar APIs do gulp, como: `src()`, `dest()`, `series()` ou `parallel()`. No entanto, também é possível usar qualquer módulo Node ou _vanilla_ JavaScript.

Qualquer função exportada por ele será registrada como uma tarefa, no sistema de tarefas do gulp.

## Transpilação

Você pode escrever o gulpfile usando uma linguagem que requer transpilação, como: TypeScript ou Babel. Basta alterar a extensão em seu `gulpfile.js`, para indicar a linguagem e instalar o transpilador correspondente.

* No caso de TypeScript, renomeie o arquivo para `gulpfile.ts` e instale o módulo [ts-node][ts-node-module];
* Já com Babel, você precisa renomear para `gulpfile.babel.js` e instalar o módulo [@babel/register][babel-register-module].

__Versões mais recentes do node suportam recursos que TypeScript e Babel provém, com excessão da sintaxe `import`/`export`. Por isso, se você só quiser usar essa sintaxe, renomeie o arquivo para `gulpfile.esm.js` e instale o módulo [esm][esm-module].__

Para se aprofundar mais nesse assunto e conferir a lista completa de extensões suportadas, veja nossa documentação sobre [transpilação do gulpfile][gulpfile-transpilation-advanced].

## Modularizando o gulpfile

Muitos usuários começam colocando toda a lógica só no gulpfile. No entanto, quando ele cresce muito, é bom dividir o código em vários outros arquivos.

Cada tarefa pode ser isolada em seu próprio arquivo e depois importada em seu gulpfile, de forma a atingir uma composição.

Isso não só mantém as coisas organizadas, mas também permite que você teste cada tarefa independentemente ou varie a composição de acordo com alguma condição.

Além disso: a resolução de módulos do node permite que você substitua seu arquivo `gulpfile.js` por uma pasta de mesmo nome, mas que contém um arquivo `index.js` que é tratado como um gulpfile. Este diretório poderia, então, conter os arquivos de suas tarefas.

Se você estiver usando um transpilador, basta nomear a pasta e o `index.js` de acordo com a linguagem.

[gulpfile-transpilation-advanced]: ../documentation-missing.md
[ts-node-module]: https://www.npmjs.com/package/ts-node
[babel-register-module]: https://www.npmjs.com/package/@babel/register
[esm-module]: https://www.npmjs.com/package/esm
