# Crear un plugin

Si estás pensando en crear un plugin para gulp, te ahorrás un buen tiempo al leer la documentación en su totalidad.

* [Lineamientos](guidelines.md) (lectura obligada)
* [Uso de buffers](using-buffers.md)
* [Uso de streams](dealing-with-streams.md)
* [Pruebas](testing.md)

## Lo que hace.

### Streams o _Canales_

Los plugins de gulp siempre devuelven un stream en [modo objeto](http://nodejs.org/api/stream.html#stream_object_mode) que hace lo siguiente:

1. Recibe [objetos File de vynil](http://github.com/wearefractal/vinyl)
2. Produce [objetos File de vynil](http://github.com/wearefractal/vinyl)

También conocidos como [transform streams](http://nodejs.org/api/stream.html#stream_class_stream_transform_1) (algunas veces también denominados _through streams_).  Transform streams son streams bidireccionales  capaces de leer y modificar objetos que los atraviesan. Piensa en un filtro de agua conectado a una tubería o manguera.

### Modificando archivos

Archivos de vynil disponen de 3 tipos de atributos de contenido:

- [Streams](dealing-with-streams.md)
- [Buffers](using-buffers.md)
- Vacío (null) - Útil por ejemplo para rimraf Useful for things like [rimraf](https://www.npmjs.org/package/rimraf), clean, etc., donde el contenido no es necesario.

## Otros recursos

* [objeto File](https://github.com/wearefractal/gulp-util/#new-fileobj)
* [PluginError](https://github.com/gulpjs/gulp-util#new-pluginerrorpluginname-message-options)
* [event-stream](https://github.com/dominictarr/event-stream)
* [BufferStream](https://github.com/nfroidure/BufferStream)
* [gulp-util](https://github.com/wearefractal/gulp-util)


## Plugins de ejemplo

* [sindresorhus' gulp plugins](https://github.com/search?q=%40sindresorhus+gulp-)
* [Fractal's gulp plugins](https://github.com/search?q=%40wearefractal+gulp-)
* [gulp-replace](https://github.com/lazd/gulp-replace)


## Acerca de streams

Si no estás familiarizado con streams, sería útil repasar el tema:

* https://github.com/substack/stream-handbook (lectura obligada)
* http://nodejs.org/api/stream.html
* [Streams](http://nodejs-es.github.io/api/all.html#all_es_streams) - Documentación de Node en Español.
* [Tuberías](http://es.wikipedia.org/wiki/Tuber%C3%ADa_(inform%C3%A1tica). (Wikipedia)

Librerías para gulp que no manipulan streams son generalmente etiquetadas [gulpfriendly](https://npmjs.org/browse/keyword/gulpfriendly) en npm.
