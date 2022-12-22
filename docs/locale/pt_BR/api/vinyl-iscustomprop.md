<!-- front-matter
id: vinyl-iscustomprop
title: Vinyl.isCustomProp()
hide_title: true
sidebar_label: Vinyl.isCustomProp()
-->

# Vinyl.isCustomProp()

Determina se uma propriedade é gerenciada por Vinyl, internamente. É usado por Vinyl, quando configurando valores dentro do construtor ou quando copiando propriedades no método da instância de `clone()`.

Esse método é útil, quando extendemos a classe Vinyl. Mais detalhes, em [Extendendo Vinyl][extending-vinyl-section], abaixo.

## Modo de uso

```js
const Vinyl = require('vinyl');

Vinyl.isCustomProp('sourceMap') === true;
Vinyl.isCustomProp('path') === false;
```

## Assinatura

```js
Vinyl.isCustomProp(property)
```

### Parâmetros

| parâmetro | tipo | descrição |
|:--------------:|:------:|-------|
| property | string | O nome da propriedade a se conferir. |

### Retorno

Retorna `true`, se a propriedade não estiver sendo gerenciada internamente.

## Extendendo Vinyl

Quando propriedades customizadas são gerenciadas internamente, o método estático `isCustomProp` tem que ser extendido e retornar `false` quando um das propriedades customizadas forem requisitadas.

```js
const Vinyl = require('vinyl');

const builtInProps = ['foo', '_foo'];

class SuperFile extends Vinyl {
  constructor(options) {
    super(options);
    this._foo = 'exemplo de valor read-only interno';
  }

  get foo() {
    return this._foo;
  }

  static isCustomProp(name) {
    return super.isCustomProp(name) && builtInProps.indexOf(name) === -1;
  }
}
```

No exemplo acima, `foo` e `_foo` não serão atribuídos ao novo objeto quando clonando ou passados para `options` em `new SuperFile(options)`.

Se suas propriedades customizadas ou lógica requer uma manipulação especial durante a clonagem, sobrescreva o méotodo quando extender Vinyl.

[extending-vinyl-section]: #extending-vinyl
