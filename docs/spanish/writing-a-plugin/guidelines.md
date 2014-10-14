# Lineamientos

> Aunque los lineamientos de esta guía son totalmente opcionales, el equipo de gulp **recomienda** acatar estos principios a todos los autores de plugin. Nadie quiere un plugin de pobre calidad. Los principios delineados en esta guía tienen el propósito de simplificar tu vida al garantizarte que tu plugin es adecuado para gulp.

[Crear un plugin](README.md) > Lineamientos

1. Plugins no deben duplicar funcionalidad que pueda ser fácilmente realizada a través de otros módulos node
  - Por ejemplo: eliminar un directorio no es un buen plugin para gulp. Es preferible utilizar directamente un módulo como [del](https://github.com/sindresorhus/del) dentro de la tarea.
  - Incluir cada función imaginable en plugins solo consigue corromper el ecosistema de plugins y no es adecuado con el paradigma de gulp, muy similar a la [filosofía de Unix](http://en.wikipedia.org/wiki/Unix_philosophy).
  - Los plugins son para realizar operaciones con archivos. Si estás creando un plugin que lleva a cabo operaciones demasiado complejas con streams considera abstraer esa funcionalidad a un módulo de node en su lugar.
  - Un ejemplo apropiado para un plugin gulp podría ser gulp-coffee. Ya que el módulo coffee-script no reconoce Vynil por defecto, es una buena idea implementar la funcionalidad de comunicar coffee-script con Vynil en un plugin propio para gulp.
2. Plugins deberían llevar a cabo una y solo una operación.
  - Evitar crear plugins con opciones configurables que realizen operaciones diferentes.
  - Por ejemplo: Un plugin para minificar JavaScript no debería permitir adicionalmente añadir títulos o cabeceras al objeto generado.
3. Plugins no deben duplicar o incluir operaciones que otros plugins ya hacen,
  - En vez de concatenar en tu plugin, utiliza [gulp-concat](https://github.com/wearefractal/gulp-concat) en tu tarea.
  - En vez de añadir una cabecera en tu plugin, mejor utiliza [gulp-header](https://github.com/godaddy/gulp-header) en tu tarea.
  - No añadas un pie de página, mejor utiliza [gulp-footer](https://github.com/godaddy/gulp-footer) en tu tarea.
  - Si su uso es de carácter opcional pero suele ser el caso que tu plugin emplea a otro, asegúrate dejarlo bien documentado.
  - En la medida de lo posible, utiliza otros módulos en tu plugin para evitar duplicación de código y contribuir a la estabilidad y sintropía del ecosistema.
4. **Siempre** prueba tus plugins.
  - Añadir pruebas a tu plugin es simple, ni siquiera necesitas gulp para esto.
  - Revisa otros plugins para ver ejemplos.
5. Incluye la etiqueta `gulpplugin` en el `package.json` de tu plugin para que pueda ser visualizado en nuestro registro oficial.
6. No generes excepciones dentro de streams
  - En su lugar, emite un evento de **error**.
  - Si descubres un error **externo** al stream, por ejemplo, una configuración invalida mientras el stream es creado, es aceptable generar la excepción.
7. Prefija errores con el nombre del plugin
  - Por ejemplo: `gulp-replace: Cannot do regexp replace on a stream`
  - Utilizar la clase [PluginError](https://github.com/gulpjs/gulp-util#new-pluginerrorpluginname-message-options) del módulo gulp-util para facilitar esto.
8. El tipo de `file.contents` de salida debe ser siempre igual al de entrada
  - Si `file.contents` es null (no-lectura) simplemente ignora el archivo y pásalo
  - Si `file.contents` es un stream que no soportas simplemente emite un error.
    - No aloques buffers para streams con la intención de que tu plugin soporte streams o atraerás a la peste negra.
9. No pases el objeto `File` en el _downstream_ o salida hasta que hayas completado la transformación u operación de tu plugin.
10. Utiliza [`file.clone()`](https://github.com/wearefractal/vinyl#clone) al momento de clonar un archivo o crear uno nuevo en base a otro.
11. Utiliza módulos de nuestra lista curada de [módulos recomendados](recommended-modules.md) y simplifica tu trabajo.
12. Por favor **NO** requerir `gulp` como dependencia o `peerDependency` en plugins.
  - Es fenomenal que uses gulp para automatizar el workflow de tu plugin, pero asegúrate que lo incluyes como `devDependency`.
  - Incluir gulp como dependencia de tu plugin significa que todo aquel que instale tu plugin también reinstalará gulp, y todo su árbol de módulos dependientes consigo.
  - No debería haber razón alguna de utilizar gulp dentro de la implementación de tu plugin. Si te hallas en un caso similar [abre un nuevo asunto](https://github.com/gulpjs/gulp/issues) y solicita ayuda.

### ¿Porqué reglas tan estrictas?

gulp intenta ser simple de usar. Gracias a los lineamientos estrictos descritos en esta guía es posible brindar un ecosistema consistente y robusto a toda la comunidad. Como resultado la carga de trabajo y esfuerzo de creadores de plugins se ve incrementada, pero al mismo tiempo esta iniciativa garantiza eliminar algunos problemas en el futuro.

### ¿Qué ocurre si no sigo los lineamientos?

npm es libre para todos y por supuesto que tienes la libertad de hacer como gustes, pero esta guía tiene una razón de ser. Está pautado integrar un sistema de validación de pruebas en el registro oficial de plugins. Si tu plugin falla el test, esta información será visible de manera pública vía un sistema de puntuación. Evidentemente, la comunidad va a preferir plugins que adoptan _la filosofía de gulp_.

### Ejemplo concreto de plugin.

```js
// through2 es un módulo que facilita trabajar con transform streams en node
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

// función para manejar archivos
function gulpPrefixer(prefixText) {
  if (!prefixText) {
    throw new PluginError(PLUGIN_NAME, 'Missing prefix text!');
  }

  prefixText = new Buffer(prefixText);
  // alocar memoria por adelantado

  // crear un stream through por el que cada archivo pase
  var stream = through.obj(function(file, enc, cb) {
    if (file.isNull()) {
       // ignorar si no hay contenido
    }

    if (file.isBuffer()) {
        file.contents = Buffer.concat([prefixText, file.contents]);
    }

    if (file.isStream()) {
        file.contents = file.contents.pipe(prefixStream(prefixText));
    }

    this.push(file);

    return cb();
  });

  // devuelve el stream del archivo
  return stream;
};

// exporta la función principal del plugin
module.exports = gulpPrefixer;
```
