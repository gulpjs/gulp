# JavaScript oraz Gulpfiles

Gulp umożliwia wykorzystanie istniejącej wiedzy o języku JavaScript do pisania plików gulpfiles lub wykorzystanie doświadczenia z plikami gulpfiles do pisania zwykłego kodu JavaScript. Chociaż dostępnych jest kilka narzędzi upraszczających pracę z systemem plików i wierszem poleceń, wszystko, co piszesz, to czysty JavaScript.

## Gulpfile wytłumaczony

Plik gulpfile to plik w katalogu projektu o nazwie `gulpfile.js` (lub pisany wielkimi literami jako `Gulpfile.js`, jak Makefile), który automatycznie ładuje się po uruchomieniu polecenia `gulp`. W tym pliku często zobaczysz interfejsy API gulp, takie jak `src ()`, `dest ()`, `series ()` lub `parallel ()`, ale można użyć dowolnego standardowego modułu JavaScript lub Node. Wszelkie wyeksportowane funkcje zostaną zarejestrowane w systemie zadań gulp.

## Transpilacja

Możesz napisać plik gulpfile przy użyciu języka wymagającego transpilacji, takiego jak TypeScript lub Babel, zmieniając rozszerzenie w swoim `gulpfile.js` aby wskazać język i zainstalować odpowiedni moduł transpilatora.

* Dla TypeScript, zmień nazwę `gulpfile.ts` i zaintaluj moduł [ts-node][ts-node-module].
* Dla Babel, zmień nazwę na `gulpfile.babel.js` i zainstaluj moduł [@babel/register][babel-register-module].

__Większość nowych wersji node obsługuje większość funkcji udostępnianych przez TypeScript lub Babel, z wyjątkiem składni `import`/`export`. Jeśli pożądana jest tylko ta składnia, zmień nazwę na `gulpfile.esm.js` i zainstaluj moduł [esm][esm-module].__

Aby uzyskać bardziej zaawansowane informacje na ten temat i pełną listę obsługiwanych rozszerzeń, zobacz naszą dokumentację [gulpfile transpilation][gulpfile-transpilation-advanced].

##  Dzielenie pliku gulpfile

Wielu użytkowników zaczyna od dodania całej logiki do pliku gulpfile. Jeśli kiedykolwiek stanie się zbyt duży, można go przekształcić w osobne pliki.

Każde zadanie można podzielić na własny plik, a następnie zaimportować do pliku gulp w celu złożenia. Pozwala to nie tylko utrzymać porządek, ale umożliwia testowanie każdego zadania niezależnie lub różnicowanie składu w zależności od warunków.

Moduł Node'a pozwala zastąpić twój plik `gulpfile.js` z katalogiem o nazwie `gulpfile.js` który zawiera plik `index.js` który jest traktowany jako `gulpfile.js`. Ten katalog może następnie zawierać poszczególne moduły zadań. Jeśli używasz transpilatora, odpowiednio nazwij folder i plik.

[gulpfile-transpilation-advanced]: ../documentation-missing.md
[ts-node-module]: https://www.npmjs.com/package/ts-node
[babel-register-module]: https://www.npmjs.com/package/@babel/register
[esm-module]: https://www.npmjs.com/package/esm
