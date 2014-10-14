# Guía

> Aunque esta guía es totalmente opcional, recomendamos **ALTAMENTE** que todo el mundo las siga. Nadie quiere usar un plugin malo. Esta guía te hará la vida más fácil asegurándote que tu plugin se acomoda bien con gulp.

[Creando un Plugin](README.md) > Guías

1. Tu plugin no deben hacer algo que pueda hacerse fácilmente con módulos ya existentes para node
  - Por ejemplo: eliminar un directorio no necesita ser un plugin para gulp. Usa [del](https://github.com/sindresorhus/del) en una tarea.
  - Envolver cada función imaginable en plugins sólo consigue contaminar el ecosistema con plugins de baja calidad que no tiene sentido con el paradigma de gulp.
  - ¡gulp plugins están para hacer operaciones con archivos! Si te ves ofuscado creando un plugin complejo con streams simplemente haz un módulo normal para node en su lugar.
  - Un buen ejemplo para un gulp plugin sería algo como gulp-coffee. El módulo coffee-script no funciona con Vinyl por defecto, así que es una buena idea envolver esta funcionalidad y abstraer los puntos molestos para hacerlo funcionar bien con gulp.
1. Tu plugin sólo debería hacer **una cosa**, y hacerla bien.
  - Evita opciones de configuración que hagan a tu plugin hacer cosas totalmente diferentes.
  - Por ejemplo: un plugin para minificar JavaScript no debería tener una opción para añadir cabeceras también.
1. Tu plugin no debe hacer cosas que otros plugins se responsables
  - No debe concatenar, [gulp-concat](https://github.com/wearefractal/gulp-concat) hace eso.
  - No debe añadir cabeceras, [gulp-header](https://github.com/godaddy/gulp-header) hace eso.
  - No debe añadir pies de página, [gulp-footer](https://github.com/godaddy/gulp-footer) hace eso.
  - Si es algo común pero un caso de uso opcional, documenta que tu plugin se suele usar con otro plugin
  - ¡Usa otros plugins en tu plugin! Esto reduce la cantidad de código que tendrás que escribir y asegura un ecosistema estable.
1. Tu plugin  **debe estar testeado**.
  - Testear un plugin es fácil, ni siquiera necesitas gulp para hacerlo.
  - Mira cómo otros plugins testean para ver ejemplos.
1. Añade `gulpplugin` como palabra clave en tu `package.json` así aparecerás en nuestra búsqueda.
1. No generes excepciones en un stream
  - En su lugar, debes emitirlas como un evento **error**.
  - Si encuentras un error **externo** al stream, por ejemplo, una configuración invalida mientras el stream es creado, podrías generarlo.
1. Prefija errores con el nombre del plugin
  - Por ejemplo: `gulp-replace: Cannot do regexp replace on a stream`
  - Utilizar la clase [PluginError](https://github.com/gulpjs/gulp-util#new-pluginerrorpluginname-message-options) del módulo gulp-util te hará esto más fácil.
1. El tipo de `file.contents` de salida debe ser siempre igual al de entrada
  - Si file.contents es null (no-lectura) ignora el archivo y pásalo
  - Si file.contents es un Stream y no es algo a lo que des soporte emite un error.
    - No carges en memoria streams, en un buffer, con la intención de que tu plugin soporte streams o atraerás a la peste negra.
1. No pases el objeto `file` downstream hasta que hayas terminado.
1. Usa [`file.clone()`](https://github.com/wearefractal/vinyl#clone) para clonar un archivo o crear uno nuevo en base a otro archivo.
1. Usa módulos de nuestra lista de [módulos recomendados](recommended-modules.md) harán tu vida más fácil.
1. **NO** depender de `gulp` ya sea en como dependencia o peerDependency en tu plugin.
  - Usar gulp para testear o automatizar el workflow de tu plugin es completamente aceptable. Pero asegúrate que lo incluyes como devDependency.
  - Incluir gulp como dependencia de tu plugin significa que todo aquel que instale tu plugin instalará un nuevo gulp, y también todas su dependencias.
  - No debería haber razón alguna en utilizar gulp para el código de tu plugin. Si te ves por este camino [abre una incidencia](https://github.com/gulpjs/gulp/issues) y te ayudaremos.

### ¿Porqué estas reglas tan estrictas?

gulp intenta ser simple para los usuarios. Gracias a estas estrictas guías estamos produciendo un ecosistema de alta calidad y consistente para todo el mundo. Y aunque añade un poco más de trabajo y esfuerzo a los autores de plugins, elimina problemas en un futuro.

### ¿Qué ocurre si no las sigo?

npm es abierto para todo el mundo, y eres libre de hacer lo que quieras per pero estas guías se prescriben por una razón. Pronto habrá tests de aceptáción que se integrarán para la búsqueda de plugins. Si tu plugin falla el test, esta información será públicamente visible/ordenable por medio de sistema puntuación. La gente siempre preferirá usar plugins que se asemejen a "las formas de gulp".

### ¿Qué apariencia tiene un buen plugin?

```js
var through = require('through2');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;

// constantes
const PLUGIN_NAME = 'gulp-prefixer';

function prefixStream(prefixText) {
  var stream = through();
  stream.write(prefixText);
  return stream;
}

// función principal del plugin (manejando archivos)
function gulpPrefixer(prefixText) {
  if (!prefixText) {
    throw new PluginError(PLUGIN_NAME, 'Missing prefix text!');
  }

  prefixText = new Buffer(prefixText); // cargar en memoria por adelantado

  // creando un stream por el que cada archivo pasará
  var stream = through.obj(function(file, enc, cb) {
    if (file.isNull()) {
      // no hacer nada si no hay contenido
    }

    if(file.isBuffer()){
      file.contents = Buffer.concat([prefixText, file.contents]);
    }

    if (file.isStream()) {
      file.contents = file.contents.pipe(prefixStream(prefixText));
    }

    this.push(file);

    return cb();
  });

  // devolver el stream de archivos
  return stream;
};

// exportando la función principal del plugin
module.exports = gulpPrefixer;
```
