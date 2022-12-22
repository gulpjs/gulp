<!-- front-matter
id: explaining-globs
title: Explaining Globs
hide_title: true
sidebar_label: Explaining Globs
-->

# Explicando os Globs

Um glob é uma _string_ de caracteres literais e/ou _wildcard_.

_Globbing_ é o ato de localizar arquivos em um sistem de arquivos, usando um ou mais globs.

O método `src()` recebe um único glob ou uma array de globs, para determinar quais arquivos sua _pipeline_ vai usar. Seus globs devem _dar match_ em, pelo menos, um arquivo. Caso contrário, `src()` irá falhar.

Quando uma array de globs é usada, os globs _dão match_ de acordo com a ordem da array. Isso é, especialmente, útil com o uso de globs de negação.

## Segmentos e separadores

Um segmento é qualquer coisa, entre separadores.

O separador de um glob é sempre o caractere `/`, independente do sistema operacional (até no Windows, onde o separador de caminhos é `\\`).

Em um glob, `\\` é reservado como o caractere de escape.

Aqui, por exemplo, o asterisco é escapado. Por isso, ele é tratado como um caractere literal, invés de um _wildcard_.
```js
'glob_com_caractere_\\*_incomum.js'
```

Evite usar os métodos da API Node `path`, tipo: `path.join`; para criar globs. No Windows, isso produz um glob inválido porque Node usa `\\` como separador.

Além disso, pelo mesmo motivo, evite as variáveis globais `__dirname`, `__filename` e o método `process.cwd()`.

```js
const globInvalido = path.join(__dirname, 'src/*.js');
```

## Caractere especial: * (single-star)

_Dá match_ em qualquer quantidade de caracteres (incluindo zero), dentro de um único segmento. É útil para achar arquivos dentro de um único diretório.

No exemplo, o glob vai _dar match_ em arquivos como `index.js`, mas não: `scripts/index.js` ou `scripts/aninhados/index.js`.
```js
'*.js'
```

## Caractere especial: ** (double-star)

_Dá match_ em qualquer quantidade de caracteres (incluindo zero), nos segmentos. É útil para achar arquivos em diretórios aninhados.

Se assegure de restringir seus globs _double star_ direito, para evitar _dar match_ em algum diretório gigante, sem querer.

Aqui, por exemplo, o glob está restrito somente ao diretório `scripts/`. Isso vai _dar match_ em arquivos como: `scripts/index.js`, `scripts/aninhados/index.js` e `scripts/aninhados/denovo/index.js`.

```js
'scripts/**/*.js'
```

<small>No exemplo anterior, se `scripts/` não fosse usado como prefixo, todas dependências em `node_modules` e outros diretórios também _dariam match_.</small>

## Caractere especial: ! (negação)

Já que globs _dão match_ de acordo com a ordem da array: globs de negação devem suceder, pelo menos, um glob que não seja de negação.

O primeiro glob vai _dar match_ em um conjunto de arquivos, depois o glob de negação remove os _matches_ correspondentes.

Quando quiser execluir todos os arquivos dentro de um diretório, você deve adicionar `/**` depois do nome do diretório.

```js
['scripts/**/*.js', '!scripts/vendor/**']
```

Se algum glob que não é de negação sucede outro de negação, nada vai ser removido do conjunto de _matches_ anterior.

```js
['scripts/**/*.js', '!scripts/vendor/**', 'scripts/vendor/react.js']
```

Globs de negação também podem ser utilizados como uma solução para restringir globs _double star_.

```js
['**/*.js', '!node_modules/**']
```

<small>No exemplo anterior, se o glob de negação fosse `!node_modules/**/*.js`, a biblioteca de globs não otimizaria a negação e todo _match_ teria de ser comparado com o glob de negação, oquê seria muito lento. Para ignorar todos arquivos em um diretório, basta adicionar o glob `/**` depois do nome do diretório.</small>

## Sobreposição de globs

Quando dois globs (ou mais) _dão match_ no mesmo arquivo, dizemos que houve uma sobreposição.

Quando globs que se sobrepõem são usados dentro de um único `src()`, gulp tenta fazer o seu melhor para remover as duplicatas. No entanto, não faz o mesmo com duplicatas em diferentes invocações do método `src()`.

## Conteúdo avançado

A maior parte do conteúdo (sobre globs) necessário para trabalhar com gulp, você aprendeu aqui. Se quiser mais profundidade, aqui estão algumas fontes:

* [Documentação do Micromatch][micromatch-docs];
* [Documentação do Glob Primer, by node-glob][glob-primer-docs];
* [Documentação sobre Globbing, by Begin][begin-globbing-docs];
* [A página do Wikipédia sobre globs][wikipedia-glob].

[micromatch-docs]: https://github.com/micromatch/micromatch
[glob-primer-docs]: https://github.com/isaacs/node-glob#glob-primer
[begin-globbing-docs]: https://github.com/begin/globbing#what-is-globbing
[wikipedia-glob]: https://pt.wikipedia.org/wiki/Glob
