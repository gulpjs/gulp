# FAQ

## ¿Porqué Gulp y no otro?

Consulta la [presentación introductoria] a gulp para un resumen de las motivaciones que originaron a gulp.

## gulp o Gulp?

Siempre **g**ulp. La única excepción es en el logo donde Gulp aparece en mayúsculas.

## ¿Dónde puedo conseguir una lista de plugins para gulp?

Plugins para gulp siempre incluyen la etiqueta `gulpplugin`. [Busca gulp plugins][search-gulp-plugins] aquí o mira la lista de [todos los plugins][npm plugin search].

## Quiero escribir un plugin para gulp. ¿Cómo empiezo?

Consulta la documentación en [Crear un plugin] con ejemplos de como empezar.

## Creo que mi plugin hace demasiado. ¿Cómo saber?

Considera las siguientes posibilidades.

1. Si tu plugin incluye funcionalidad que otro plugin pudiese requerir considera llevar esa funcionalidad a otro plugin. Primero [confirma si aun no existe en npm][npm plugin search].

2. Si tu plugin realiza dos o más tareas diferentes, ajustables via configuración:
  - Considera publicar cada caso de uso como un nuevo plugin y así beneficiar mejor a la comunidad.
  - Si las funciones están lo suficientemente relacionadas, entonces es aceptable.

## ¿Qué código de nueva línea es recomendable en el output de mi plugin?

Utiliza siempre `\n` para evitar problemas con diff en diferentes sistemas operativos.

## ¿Cómo puedo mantenerme actualizado con gulp?

Puedes estar al corriente de todo sobre gulp  a través de los siguientes enlaces de Twitter:

- [@wearefractal](https://twitter.com/wearefractal)
- [@eschoff](https://twitter.com/eschoff)
- [@gulpjs](https://twitter.com/gulpjs)

## ¿Cuál es el canal IRC de gulp?

Eres bienvenido a visitar el #gulpjs en [Freenode] y chatear con nosotros. Algunos de nosotros también hablamos Español.

[Crear un plugin]: writing-a-plugin/README.md
[presentación introductoria]: http://slid.es/contra/gulp
[Freenode]: http://freenode.net/
[search-gulp-plugins]: http://gulpjs.com/plugins/
[npm plugin search]: https://npmjs.org/browse/keyword/gulpplugin
