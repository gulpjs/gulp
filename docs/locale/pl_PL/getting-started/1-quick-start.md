# Szybki start

Jeśli wcześniej instalowałeś gulp globalnie, uruchom `npm rm --global gulp` przed wykonaniem tych instrukcji. Aby uzyskać więcej informacji, przeczytaj to [Sip][sip-article].

## Sprawdź dla node, npm, oraz npx
```sh
node --version
```
![Output: v8.11.1][img-node-version-command]
```sh
npm --version
```
![Output: 5.6.0][img-npm-version-command]
```sh
npx --version
```
![Output: 9.7.1][img-npx-version-command]

If they are not installed, follow the instructions [here][node-install].

## Zainstaluj narzędzie wiersza poleceń gulp
```sh
npm install --global gulp-cli
```


## Utwórz katalog projektu i przejdź do niego
```sh
npx mkdirp my-project
```
```sh
cd my-project
```

## Utwórz plik package.json w katalogu projektu
```sh
npm init
```

To poprowadzi cię przez nadanie projektowi nazwy, wersji, opisu itp.

## Zainstaluj pakiet gulp w swoich devDependencies
```sh
npm install --save-dev gulp
```

## Sprawdź swoje wersje gulp

```sh
gulp --version
```

Upewnij się, że dane wyjściowe odpowiadają zrzutowi ekranu poniżej, w przeciwnym razie może być konieczne ponowne uruchomienie kroków opisanych w tym przewodniku.

![Output: CLI version 2.0.1 & Local version 4.0.0][img-gulp-version-command]

## Stwórz gulpfile
Za pomocą edytora tekstu utwórz plik o nazwie gulpfile.js w katalogu głównym projektu z następującymi treściami:
```js
function defaultTask(cb) {
  // place code for your default task here
  cb();
}

exports.default = defaultTask
```

## Przetestuj to
Uruchom polecenie gulp w katalogu projektu:
```sh
gulp
```
Aby uruchomić wiele zadań, możesz użyć `gulp <task> <othertask>`.

## Wynik
Zadanie domyślne zostanie uruchomione i nic nie zrobi.
![Output: Starting default & Finished default][img-gulp-command]

[sip-article]: https://medium.com/gulpjs/gulp-sips-command-line-interface-e53411d4467
[node-install]: https://nodejs.org/en/
[img-node-version-command]: https://gulpjs.com/img/docs-node-version-command.png
[img-npm-version-command]: https://gulpjs.com/img/docs-npm-version-command.png
[img-npx-version-command]: https://gulpjs.com/img/docs-npx-version-command.png
[img-gulp-version-command]: https://gulpjs.com/img/docs-gulp-version-command.png
[img-gulp-command]: https://gulpjs.com/img/docs-gulp-command.png
