<!-- front-matter
id: vinyl-iscustomprop
title: Vinyl.isCustomProp()
hide_title: true
sidebar_label: Vinyl.isCustomProp()
-->

# Vinyl.isCustomProp()

Determines if a property is internally managed by Vinyl. Used by Vinyl when setting values inside the constructor or when copying properties in the `clone()` instance method.

This method is useful when extending the Vinyl class. Detailed in [Extending Vinyl][extending-vinyl-section] below.

## Usage

```js
const Vinyl = require('vinyl');

Vinyl.isCustomProp('sourceMap') === true;
Vinyl.isCustomProp('path') === false;
```

## Signature

```js
Vinyl.isCustomProp(property)
```

### Parameters

| parameter | type | note |
|:--------------:|:------:|-------|
| property | string | The property name to check. |

### Returns

True if the property is not internally managed.

## Extending Vinyl

When custom properties are managed internally, the static `isCustomProp` method must be extended and return false when one of the custom properties is queried.

```js
const Vinyl = require('vinyl');

const builtInProps = ['foo', '_foo'];

class SuperFile extends Vinyl {
  constructor(options) {
    super(options);
    this._foo = 'example internal read-only value';
  }

  get foo() {
    return this._foo;
  }

  static isCustomProp(name) {
    return super.isCustomProp(name) && builtInProps.indexOf(name) === -1;
  }
}
```

In the example above, `foo` and `_foo` will not be assigned to the new object when cloning or passed in `options` to `new SuperFile(options)`.

If your custom properties or logic require special handling during cloning, override the `clone` method while extending Vinyl.

[extending-vinyl-section]: #extending-vinyl
