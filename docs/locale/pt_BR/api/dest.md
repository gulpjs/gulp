<!-- front-matter
id: dest
title: dest()
hide_title: true
sidebar_label: dest()
-->

# dest()

Cria uma _stream_ para escrever objetos [Vinyl][vinyl-concepts] no sistema de arquivos.

## Modo de Uso

```js
const { src, dest } = require('gulp');

function copy() {
  return src('input/*.js')
    .pipe(dest('output/'));
}

exports.copy = copy;
```

## Assinatura

```js
dest(directory, [options])
```

### Parâmetros

| parâmetro | tipo | descrição |
|:--------------:|:-----:|--------|
| directory<br />**(obrigatório)** | string<br />function | O caminho do diretório de output de arquivos. Se usar uma função, ela será invocada com cada objeto Vinyl e tem que retornar uma _string_ com o caminho do diretório. |
| options | object | Mais detalhes em [Opções][options-section]. |

### Retorno

Uma stream que pode ser usada no meio ou final de uma pipeline, para criar arquivos no sistema de arquivos.

Sempre que um objeto Vinyl passa pela _stream_, ele escreve o conteúdo e outros detalhes no sistema de arquivos, no diretório passado. Se o objeto Vinyl tiver a propriedade `symlink`, um link simbólico será criado, invés de escrever conteúdos.

Depois do arquivo ser criado, seus [metadados serão atualizados][metadata-updates-section] para combinar com o objeto Vinyl.

Sempre que um arquivo é criado no sistema de arquivos, o objeto Vinyl será modificado:

* As propriedades `cwd`, `base` e `path` serão atualizadas para combinar com o arquivo criado;
* A propriedades `stat` será atualizada para combinar com o arquivo no sistema de arquivos.
* Se a propriedade `contents` for uma _stream_, ela será resetada para que possa ser lida novamente.

### Erros

Quando `directory` for uma _stream_ vazia, um erro será lançado com a seguinte mensagem:

> Invalid dest() folder argument. Please specify a non-empty string or a function.

Quando `directory` não for um _string_ ou _function_, um erro será lançado com a seguinte mensagem:

> Invalid dest() folder argument. Please specify a non-empty string or a function.

Quando `directory` for uma função que retorna uma _string_ vazia ou `undefined`, um erro será emitido com a seguinte mensage:

> Invalid output folder

### Opções

**Sobre opções que aceitam funções: a função passada será invocada com cada objeto Vinyl e tem que retornar um valor de um outro tipo listado.**

| nome | tipo | padrão | descrição |
|:-------:|:------:|-----------|-------|
| cwd | string<br />function | `process.cwd()` | O diretório que será combinado com algum caminho relativo, para formar um caminho absoluto. Será ignorado em caminhos absolutos. Use para evitar combinar `directory` com `path.join()`. |
| mode | number<br />function | `stat.mode` do objeto Vinyl | O modo a ser usado para criar arquivos. Invés disso: se não usar este parâmetro e `stat.mode` não existir, o modo do processo será usado. |
| dirMode | number<br />function | | O modo usado para criar diretórios. Se o parâmetro não for usado, o modo do processo será usado. |
| overwrite | boolean<br />function | true | Quando for `true`, sobrescreve arquivos existentes com o mesmo caminho. |
| append | boolean<br />function | false | Se for `true`, adiciona conteúdo ao final do arquivo, invés de substituir arquivos existentes. |
| sourcemaps | boolean<br />string<br />function | false | Se for `true`, cria _inline sourcemaps_ no arquivo de output. Já se você especificar uma `string` com um caminho: cria [sourcemaps][sourcemaps-section] externos, neste caminho. |
| relativeSymlinks | boolean<br />function | false | Quando `false`, qualquer link simbólico criado será absoluto. <br />**Observação**: é ignorado se uma junção está sendo criada, já que devem ser absolutas. |
| useJunctions | boolean<br />function | true | Esta opção só é relevante no Windows e ignorada em outros sistemas operacionais. Quando for `true`, cria link simbólico de diretório como uma junção. Mais detalhes em [Links simbólicos no Windows][symbolic-links-section]. |

## Atualização de Metadados

Sempre que a stream de `dest()` cria um arquivo, o modo do objeto Vinyl, `mtime` e `atime` são comparados ao arquivo criado. Se forem diferentes, o arquivo criado será atualizado para combinar com os metadados do objeto Vinyl. Se estas propriedades forem iguais ou Gulp não tiver permissões para fazer alterações, a comparação é evitada silenciosamente.

Esta funcionalidade está desativada no Windows e outros sistemas operacionais que não suportam os métodos `process.getuid()` e `process.geteuid()` do Node. Isso acontece porque o Windows possui resultados inesperados, quando usa `fs.fchmod()` e `fs.futimes()`.

**Observação**: o método `fs.futimes()` converte as timestamps `mtime` e `atime` para segundos, internamente. Essa divisão por 1000 pode causar perca de precisão em sistemas operacionais 32-bit.

## Sourcemaps

O suporte a _sourcemaps_ foi criado diretamente em `src()` e `dest()`, mas é desativado por padrão. Ative-o para produzir _sourcemaps inline_ ou externos.

Sourcemaps inline:
```js
const { src, dest } = require('gulp');
const uglify = require('gulp-uglify');

src('input/**/*.js', { sourcemaps: true })
  .pipe(uglify())
  .pipe(dest('output/', { sourcemaps: true }));
```

Sourcemaps externos:
```js
const { src, dest } = require('gulp');
const uglify = require('gulp-uglify');

src('input/**/*.js', { sourcemaps: true })
  .pipe(uglify())
  .pipe(dest('output/', { sourcemaps: '.' }));
```

## Links simbólicos no Windows


Quando for criar links simbólicos no Windows, um argumento `type` é passado para o método `fs.symlink()` do Node, o qual especifica o tipo do alvo sendo _linkado_.

O tipo do link é configurado como:

* `'file'`, quando o alvo for um arquivo comum;
* `'junction'`, quando o alvo for um diretório;
* `'dir'`, quando o alvo for um diretório e o usuário desativa a opção `useJunctions`.

Se você tentar criar um _dangling link_ (apontando para um alvo inexistente), o tipo do link não pode ser determinado, automaticamente. Nestes casos, o comportamento varia dependendo se o _dangling link_ está sendo criado via `symlink()` ou via `dest()`.

No caso de _dangling links_ criados via `symlink()`, o objeto Vinyl recebido representa o alvo, então, seus status determinarão o tipo de link desejado. Se `isDirectory()` retornar `false`, então, um link de tipo `'file'` é criado. Caso contrário, um link do tipo `'junction'` ou `'dir'` é criado, dependendo do valor da opção `useJunctions`.

Já quando falamos de _dangling links_ criados via `dest()`: o objeto Vinyl recebido representa o link (normalmente, carregado do disco usando `src(..., { resolveSymlinks: false })`). Neste caso, o tipo do link não pode ser determinado razoavelmente e acaba sendo `'file'`. Isso pode causar comportamentos inesperados, se você estiver criando um _dangling link_ em um diretório. **Evite este tipo de situação!**

[sourcemaps-section]: #sourcemaps
[symbolic-links-section]: #symbolic-links-on-windows
[options-section]: #options
[metadata-updates-section]: #metadata-updates
[vinyl-concepts]: ../api/concepts.md#vinyl
