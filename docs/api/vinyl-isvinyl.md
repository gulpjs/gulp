<!-- front-matter
id: vinyl-isvinyl
title: Vinyl.isVinyl()
hide_title: true
sidebar_label: Vinyl.isVinyl()
-->

# Vinyl.isVinyl()

Determines if an object is a Vinyl instance. Use this method instead of `instanceof`.

**Note**: This method uses an internal property that some older versions of Vinyl didn't expose resulting in a false negative if using an outdated version.

## Usage

```js
const Vinyl = require('vinyl');

const file = new Vinyl();
const notAFile = {};

Vinyl.isVinyl(file) === true;
Vinyl.isVinyl(notAFile) === false;
```

## Signature

```js
Vinyl.isVinyl(file);
```

### Parameters

| parameter | type | note |
|:--------------:|:------:|-------|
| file | object | The object to check. |

### Returns

True if the `file` object is a Vinyl instance.

