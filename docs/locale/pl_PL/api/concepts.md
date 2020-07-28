# Pojęcia

Poniższe pojęcia są niezbędne do zrozumienia dokumentacji API. Będą się do nich odwoływać w całości, wróć do tej strony, aby uzyskać szczegółowe wyjaśnienia.

Jeśli jesteś tu nowy, zacznij od [Poradnik wprowadzający][quick-start-docs].

## Vinyl

Vinyl to obiekt metadanych opisujący plik. Główne właściwości instancji Vinyl to `path` i `contents` - podstawowe aspekty pliku w systemie plików. Obiekty Vinyl mogą być używane do opisywania plików z wielu źródeł - w lokalnym systemie plików lub dowolnej opcji zdalnego przechowywania.

## Adaptery Vinyl

Chociaż Vinyl zapewnia sposób na opisanie pliku, potrzebny jest sposób na dostęp do tych plików. Każde źródło pliku jest dostępne za pomocą adaptera Vinyl.

Adapter udostępnia:
* Metoda z podpisem `src (globs, [opcje])` i zwraca strumień, który produkuje obiekty Vinyl.
* Metoda z podpisem `dest (folder, [opcje])` i zwraca strumień, który zużywa obiekty Vinyl.
* Wszelkie dodatkowe metody specyficzne dla ich nośnika wejścia / wyjścia - takie jak metoda `symlink`, którą zapewnia `winyl-fs`. Powinny zawsze zwracać strumienie, które produkują i / lub zużywają obiekty Vinyl.

## Zadania

Każde zadanie gulp to asynchroniczna funkcja JavaScript, która albo przyjmuje wywołanie zwrotne z pierwszym błędem, albo zwraca strumień, obietnicę, emiter zdarzeń, proces podrzędny lub observable. Z powodu pewnych ograniczeń platformy zadania synchroniczne nie są obsługiwane.

Aby uzyskać bardziej szczegółowe wyjaśnienie, patrz [Tworzenie zadań][creating-tasks-doc].

## Globs

Glob jest ciągiem literałów i / lub symboli wieloznacznych, takich jak `*`, `**` lub `!`, używanych do dopasowania ścieżek plików. Globbing to czynność polegająca na lokalizowaniu plików w systemie plików przy użyciu co najmniej jednego globu.

Jeśli nie masz doświadczenia z globami, zobacz [Wyjaśnianie Globs][explaining-globs-docs].

## Glob base

Glob base - czasami nazywany globem parent - to segment ścieżki przed znakami specjalnymi w ciągu globu. Jako taka, globalną bazą `/src /js/**. Js` jest `/src/js/`. Wszystkie ścieżki pasujące do globu mają tę samą bazę globalną - ten segment ścieżki nie może być zmienny.

Instancje Vinyl generowane przez `src ()` są konstruowane z ustawieniem glob base jako ich właściwości `base`. Po zapisaniu do systemu plików za pomocą `dest ()`, `base` zostanie usunięte ze ścieżki wyjściowej, aby zachować struktury katalogów.

Aby uzyskać więcej szczegółowych informacji, zobacz [glob-parent][glob-parent-external] repository.

## File system stats

Metadane pliku są dostarczane jako instancja węzła [`fs.Stats`][fs-stats-external]. Jest dostępny jako właściwość `stat` w twoich instancjach Vinyl i używany wewnętrznie do ustalenia, czy obiekt Vinyl reprezentuje katalog lub dowiązanie symboliczne. Po zapisaniu w systemie plików uprawnienia i wartości czasu są synchronizowane z właściwością `stat` obiektu Vinyl.

## File system modes

Tryby systemu plików określają, jakie uprawnienia istnieją dla pliku. Większość plików i katalogów w twoim systemie plików będzie miała dość permisywny tryb, pozwalający gulpowi na odczyt / zapis / aktualizację plików w twoim imieniu. Domyślnie gulp tworzy pliki z tymi samymi uprawnieniami, co uruchomiony proces, ale możesz skonfigurować tryby za pomocą opcji w `src ()`, `dest ()` itp. Jeśli masz problemy z uprawnieniami (EPERM), sprawdź tryby plików.

## Moduły

Gulp składa się z wielu małych modułów połączonych ze sobą w celu zapewnienia spójnej pracy. Używając [semver][semver-external] w małych modułach, możemy wydać poprawki błędów i funkcje bez publikowania nowych wersji gulp. Często, gdy nie widać postępu w głównym repozytorium, praca jest wykonywana w jednym z tych modułów.

Jeśli masz problemy, sprawdź, czy bieżące moduły zostały zaktualizowane za pomocą polecenia `npm update`. Jeśli problem będzie się powtarzał, otwórz problem w indywidualnym repozytorium projektu.

* [undertaker][undertaker-external] - the task registration system
* [vinyl][vinyl-external] - the virtual file objects
* [vinyl-fs][vinyl-fs-external] - a vinyl adapter to your local file system
* [glob-watcher][glob-watcher-external] - the file watcher
* [bach][bach-external] - task orchestration using `series()` and `parallel()`
* [last-run][last-run-external] - tracks the last run time of a task
* [vinyl-sourcemap][vinyl-sourcemap-external] - built-in sourcemap support
* [gulp-cli][gulp-cli-external] - the command line interface for interacting with gulp


[quick-start-docs]: ../getting-started/1-quick-start.md
[creating-tasks-doc]: ../getting-started/3-creating-tasks.md
[explaining-globs-docs]: ../getting-started/6-explaining-globs.md
[undertaker-external]: https://github.com/gulpjs/undertaker
[vinyl-external]: https://github.com/gulpjs/vinyl
[vinyl-fs-external]: https://github.com/gulpjs/vinyl-fs
[glob-watcher-external]: https://github.com/gulpjs/glob-watcher
[bach-external]: https://github.com/gulpjs/bach
[last-run-external]: https://github.com/gulpjs/last-run
[vinyl-sourcemap-external]: https://github.com/gulpjs/vinyl-sourcemap
[gulp-cli-external]: https://github.com/gulpjs/gulp-cli
[semver-external]: https://semver.org
[fs-stats-external]: https://nodejs.org/api/fs.html#fs_class_fs_stats
[glob-parent-external]: https://github.com/es128/glob-parent
