<!-- front-matter
id: vinyl-isvinyl
title: Vinyl.isVinyl()
hide_title: true
sidebar_label: Vinyl.isVinyl()
-->

# Vinyl.isVinyl()

Determina se um objeto é uma instância Vinyl. Use esse método, invés de `instanceof`.

**Nota**: este método usa uma propriedade interna que algumas versões antigas do Vinyl não tinha exposto, oquê resulta em _falsos negativos_ se usarmos uma versão desatualizada.

## Modo de uso

```js
const Vinyl = require('vinyl');

const file = new Vinyl();
const notAFile = {};

Vinyl.isVinyl(file) === true;
Vinyl.isVinyl(notAFile) === false;
```

## Assinatura

```js
Vinyl.isVinyl(file);
```

### Parâmetros

| paâmetro | tipo | descrição |
|:--------------:|:------:|-------|
| file | object | O objeto para se conferir. |

### Retorno

Retorna `true`, se o objeto `file` for uma instância Vinyl.

