# FAQ

## Porquê gulp? Porquê não ____?

Veja o [Slideshow introdutório de Gulp] para um resumo de como o gulp veio a surgir.

## Escreve-se "gulp" ou "Gulp"?

gulp é sempre escrito em caixa baixa. A única exceção é a logo do gulp, onde gulp é escrito com maiúsculo.

## Onde posso encontrar uma lista de plugins gulp?

Plugins gulp sempre incluem a palavra-chave `gulpplugin`. [Procure plugins gulp][search-gulp-plugins] or [veja todos os plugins][npm plugin search].

## Eu quero escrever um plugin gulp, como posso começar?

Leia a página [Escrevendo um plugin gulp] na wiki para diretrizes e um exemplo de como iniciar.

## Meu plugin faz ____, ele está fazendo demais?

Provavelmente. Pergunte a si:

1. Meu plugin faz algo que outros plugins possam precisar fazer?
- Caso sim, essa fatia de funcionalidade deveria ser um plugin à parte. [Verifique se ele já existe no npm][npm plugin search].

2. Meu plugin está fazendo duas coisas completamente diferentes, baseadas em uma opção de configuração?
  - Caso esteja, ele pode servir melhor à comunidade ao lançá-lo como dois plugins separados.
  - Se as duas tarefas forem diferentes, no entanto, muito relacionadas, provavelmente é aceitável.

## Como novas linhas devem ser representadas na saída do plugin?

Sempre use `\n` para evitar problemas de diferenciação entre sistemas operacionais.

## Eu instalei o gulp como dependência a partir de um arquivo package.json ao rodar `npm install`, mas eu continuo recebendo a mensagem `command not found` toda vez que eu rodo um comando gulp, porque isso não funciona?

Ao instalar gulp como uma dependência de projeto, você precisa adicioná-lo à sua variável de ambiente PATH, para que quando você rode um comando, o sistema possa encontrá-lo. Um solução fácil é instalar gulp globalmente, para que seus binários sejam inclusos na sua variável de desenvolvimento PATH. Para instalar gulp globalmente, rode o comando `npm install gulp-cli -g`.

## Onde posso acompanhar atualizações do gulp?

Atualizações do gulp podem ser encontrados nos perfis do twitter a seguir:

- [@wearefractal](https://twitter.com/wearefractal)
- [@eschoff](https://twitter.com/eschoff)
- [@gulpjs](https://twitter.com/gulpjs)

## O gulp possui um canal de chat?

Sim, venha conversar conosco no [Gitter](https://gitter.im/gulpjs/gulp).

[Escrevendo um plugin gulp]: writing-a-plugin/README.md
[Slideshow introdutório ao gulp]: https://slid.es/contra/gulp
[Freenode]: https://freenode.net/
[search-gulp-plugins]: https://gulpjs.com/plugins/
[npm plugin search]: https://npmjs.org/browse/keyword/gulpplugin
