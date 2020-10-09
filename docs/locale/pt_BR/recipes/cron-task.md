# Execute tarefas via con job

Se você estiver logado em um usuário que possui privilégios para executar `gulp`, execute o seguinte:

    crontab -e

Isso vai editar seu arquivo "[crontab](https://en.wikipedia.org/wiki/Cron)" atual.

Normalmente, dentro de um cron job, você roda binários usando caminhos absolutos. Então, um pontapé inicial para rodar `gulp build` a cada minuto, poderia ser algo assim:

    * * * * * cd /your/dir/to/run/in && /usr/local/bin/gulp build

No entanto, você vai acabar vendo esse erro, nos logs:

> `/usr/bin/env: node: No such file or directory`

Para corrigir isso, nós precisamos criar um [link symbolico](https://en.wikipedia.org/wiki/Ln_\(Unix\)), dentro de `/usr/bin` e ele tem que apontar para o caminho do nosso binário.

Se certifique de fazer login com **sudo** e, então, cole o seguinte comando no seu terminal:

    sudo ln -s $(which node) /usr/bin/node

Uma vez que o link for criado, sua _cron task_ vai rodar tranquilamente.
