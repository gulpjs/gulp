<!-- front-matter
id: quick-start
title: Quick Start
hide_title: true
sidebar_label: Quick Start
-->

# Introdução

Se você tem o gulp instalado globalmente, execute `npm rm --global gulp` antes de continuar com esse tutorial. Para mais informações, leia este [Sip][sip-article].

## Veja se já tem o node, npm e npx
```sh
node --version
```
![Output: v8.11.1][img-node-version-command]
```sh
npm --version
```
![Output: 5.6.0][img-npm-version-command]
```sh
npx --version
```
![Output: 9.7.1][img-npx-version-command]

Se não estiverem instalados, siga [estas][node-install] instruções.

## Instale a ferramenta de linha de comando do gulp
```sh
npm install --global gulp-cli
```

## Crie uma pasta para o projeto e entre nela
```sh
npx mkdirp my-project
```
```sh
cd my-project
```

## Criando o package.json
```sh
npm init
```

Esse comando vai te ajudar a dar nome, versão e descrição ao projeto, por exemplo.

## Instale o gulp como uma dependência de desenvolvimento
```sh
npm install --save-dev gulp
```

## Confira se está tudo certo

```sh
gulp --version
```

Certifique-se de que o _output_ é parecido com o da imagem abaixo, senão vai ser preciso reiniciar este tutorial.

![Output: CLI version 2.0.1 & Local version 4.0.0][img-gulp-version-command]

## Criando o gulpfile
Usando o seu editor de textos, crie um arquivo chamado "gulpfile.js", na raíz do projeto. Coloque isso, dentro do arquivo:
```js
function tarefaPadrao(cb) {
  // coloque o código da sua tarefa padrão, aqui.
  cb();
}

exports.default = tarefaPadrao
```

## Testando
Execute o commando `gulp`:
```sh
gulp
```
Para rodar multiplas tarefas, você pode usar:
```sh
gulp <umaTarefa> <outraTarefa>
```

## O resultado
A tarefa padrão será executada, apesar de não fazer nada.
![Output: Starting default & Finished default][img-gulp-command]

[sip-article]: https://medium.com/gulpjs/gulp-sips-command-line-interface-e53411d4467
[node-install]: https://nodejs.org/en/
[img-node-version-command]: https://gulpjs.com/img/docs-node-version-command.png
[img-npm-version-command]: https://gulpjs.com/img/docs-npm-version-command.png
[img-npx-version-command]: https://gulpjs.com/img/docs-npx-version-command.png
[img-gulp-version-command]: https://gulpjs.com/img/docs-gulp-version-command.png
[img-gulp-command]: https://gulpjs.com/img/docs-gulp-command.png
