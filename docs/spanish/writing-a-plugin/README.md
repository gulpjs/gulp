# Creando un plugin

Si vas crear un tu propio plugin para gulp, te ahorrás tiempo leyendo la documentación

* [Guía](guidelines.md) (lectura RECOMENDADA)
* [Utilizando buffers](using-buffers.md)
* [Trabajando con streams](dealing-with-streams.md)
* [Tests](testing.md)

## Qué hace

### Streaming

Los plugins de gulp siempre devuelven un stream en [modo objeto](http://nodejs.org/api/stream.html#stream_object_mode) que hace lo siguiente:

1. Recibe [objetos File de vinyl](http://github.com/wearefractal/vinyl)
2. Produce [objetos File de vinyl](http://github.com/wearefractal/vinyl)

Estos se conocen como [transform streams](http://nodejs.org/api/stream.html#stream_class_stream_transform_1) (también algunas veces denominados through streams). Transform streams son streams de lectura y escritura que manipulan los objetos que pasan a través de ellos.

### Modificando contenido de archivos

Los archivos de vinyl pueden tener 3 formas posibles, dependiendo su atributo _contents_:

- [Streams](dealing-with-streams.md)
- [Buffers](using-buffers.md)
- Vacío (null) - Útil para cosas como [rimraf](https://www.npmjs.org/package/rimraf), clean, etc., donde el contenido no es necesario.

## Recursos útiles

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

Si no estás familiarizado con los streams, te será útil leer acerca de ellos:

* https://github.com/substack/stream-handbook (lectura RECOMENDADA)
* http://nodejs.org/api/stream.html

* [Streams](http://nodejs-es.github.io/api/all.html#all_es_streams) - Documentación de Node en Español.
* [Tuberías](http://es.wikipedia.org/wiki/Tuber%C3%ADa_(inform%C3%A1tica). (Wikipedia)

Otras librerías, que no manipulan archivos a través de streams, pero están hechas para usarlas con gulp se etiquetan la palabra clave [gulpfriendly](https://npmjs.org/browse/keyword/gulpfriendly) en npm.
