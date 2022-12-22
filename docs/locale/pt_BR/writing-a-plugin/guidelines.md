# Diretrizes

> Embora essas diretrizes sejam totalmente opcionais, nós **ALTAMENTE** recomendamos que todos as sigam. Ninguém quer usar um plugin mal-feito. As diretrizes irão ajudar a tornar sua vida mais fácil, garantindo que seu plugin irá se encaixar bem com o gulp.

[Escrevendo um Plugin](README.md) > Diretrizes

1. Seu plugin não deve realizar algo que já é cumprido por um módulo node existente.
   - Por exemplo: deletar uma pasta não precisa ser um plugin gulp. Ao invés disso, use um módulo como [del](https://github.com/sindresorhus/del) dentro de uma tarefa.
   - Encapsular cada detalhe possível exageradamente irá poluir o ecossistema com plugins de baixa qualidade que não fazem sentido no paradigma gulp.
   - Plugins gulp são destinados a operações com arquivos! Caso você se encontre forçando um processo complexo em stream onde não se encaixa, faça um módulo node normal.
   - Um bom exemplo de um plugin gulp seria o gulp-coffee. O módulo coffee-script não funciona com Vinyl por padrão, então nós o encapsulamos para incluir essa funcionalidade e abstrair pontos críticos para que funcione corretamente no contexto gulp.

2. Seu plugin deve realizar apenas **uma ação**, e cumprí-la bem.
   - Evite opções de configuração que façam seu plugin realizar tarefas completamente diferentes do seu propósito.
   - Por exemplo: Um plugin de minificação JS não deve possuir uma opção de incluir um header.

3. Seu plugin não deve fazer coisas que outros plugins são responsáveis.
   - Ele não deve concatenar, [gulp-concat](https://github.com/contra/gulp-concat) cuida disso.
   - Ele não deve adicionar cabeçalhos, [gulp-header](https://www.npmjs.com/package/gulp-header) cuida disso.
   - Ele não deve adicionar rodapés, [gulp-footer](https://www.npmjs.com/package/gulp-footer) cuida disso.
   - Caso exista um caso de uso comum (mas opcional), documente que seu plugin é frequentemente usado com outro plugin.
   - Use outros plugins dentro do seu próprio plugin! Isso irá reduzir a quantidade de texto que você precisa escrever e garante um ecossistema estável.

4. Seu plugin **deve ser testado**.
   - Testar um plugin gulp é fácil, nem mesmo o gulp é necessário para isso.
   - Veja outros plugins como exemplos.

5. Inclua `gulpplugin` como uma palavra-chave em seu `package.json`, para que seja exibido em nossa busca.

6. A API de seu plugin deve ser uma função que retorna uma stream.
   - Se você precisa armazenar estado em algum lugar, faça-o internamente.
   - Se precisa passar estado/opções entre plugins, inclua no objeto do arquivo.

7. Não dispare erros dentro de uma stream.
   - Ao invés disso, você deve emití-lo como um evento de **erro**.
   - Se você encontrar um erro **fora** da stream, como uma configuração inválida durante a sua criação, você pode dispará-lo.

8. Prefixe quaisquer erros com o nome de seu plugin.
   - Por exemplo: `gulp-replace: Não é possível realizar o replace do regexp em uma stream`
   - Use o módulo [PluginError](https://github.com/gulpjs/plugin-error) para facilitar.

9. Nomeie seu plugin apropriadamente: ele deve usar o prefixo com "gulp-" caso seja um plugin gulp.
   - Se não for um plugin gulp, ele não deve começar com "gulp-".

10. O tipo de `file.contents` não deve sofrer alteração durante qualquer operação.
   - Se file.contents for nulo (não-legível) e isso for algo que você não suporta, apenas ignore o arquivo e passe-o para frente.
   - Caso file.contents seja uma Stream e você não suporte isso, emita um erro.
     - Não prepare uma stream para forçar seu plugin a trabalhar com streams. Isso irá causar péssimas consequências.

11. Não passe o objeto `file` pela stream até que você encerre seu uso.

12. Use [`file.clone()`](https://github.com/gulpjs/vinyl#clone) ao clonar um arquivo ou criar um novo usando um arquivo existente como base.

13. Use módulos de nossa [página de módulos recomendados](recommended-modules.md) para facilitar sua vida.

14. NÃO requira `gulp` como uma dependência ou peerDependency em seu plugin.
   - Usar gulp para testar ou automatizar seu workflow de plugins é perfeitamente aceitável, apenas tenha certeza que ele foi definido como uma devDependency.
   - Requerer gulp como uma dependência de seu plugin significa que qualquer um que instalar seu plugin também está instalando um novo gulp e sua árvore de dependências.
   - Não existe uma razão para que você use gulp dentro do código de seu plugin. Caso precise fazer isso, abra uma issue para que possamos lhe ajudar.

## Porque essas diretrizes são tão estritas?

gulp almeja simplicidade aos usuários. Ao fornecer diretrizes estritas, nós somos capazes de oferer um ecossistema consistente e de alta qualidade para todos. Embora isso leve a um pouco mais de trabalho e esforço para os autores de plugins, isso também evita muitos problemas no futuro.

### O que acontece se eu não seguí-las?

O npm é aberto para todos, e você é livre para fazer o que quiser, mas essas diretrizes existem por um motivo. Em breve, haverão testes de aceitação que serão integrados à busca por plugins. Caso você falhe a aderir às diretrizes de plugin, você será ordenado via um sistema de pontuação público. As pessoas sempre irão
preferir usar plugins que se encaixam com a "maneira gulp".

### Na prática, como seria um bom plugin?

```js
// through2 é um container fino ao redor das streams de node transform
var through = require('through2');
var PluginError = require('plugin-error');

// Consts
const PLUGIN_NAME = 'gulp-prefixer';

function prefixStream(prefixText) {
  var stream = through();
  stream.write(prefixText);
  return stream;
}

// Função básica do plugin (lidando com os arquivos)
function gulpPrefixer(prefixText) {

  if (!prefixText) {
    throw new PluginError(PLUGIN_NAME, 'Missing prefix text!');
  }
  prefixText = new Buffer(prefixText); // alocando antecipadamente

  // Criando uma stream por onde cada arquivo irá passar
  return through.obj(function(file, enc, cb) {
    if (file.isNull()) {
      // retorna arquivo vazio
      return cb(null, file);
    }
    if (file.isBuffer()) {
      file.contents = Buffer.concat([prefixText, file.contents]);
    }
    if (file.isStream()) {
      file.contents = file.contents.pipe(prefixStream(prefixText));
    }

    cb(null, file);

  });

}

// exportando a função principal do plugin
module.exports = gulpPrefixer;
```
