<!-- TODO: Auf eine Bezeichnung festlegen. Kontext Worte: `device, bootstrap, responsive, ssr, device service, cookie, redirect` -->

## Entscheidungen

### Warum sollten die Breakpoints in einem allgemeinen Datenformat (JSON/YAML) definiert werden?

> Weil man dadurch den SSR Server besser vom Frontend trennen kann. In production könnte das etwas anderes als der Node Server sein/werden.

### Über vanilla-extract zum erzeugen der CSS Media Queries versus PostCSS `@custom-media` queries generiert per Script (.zsh oder .ts)

Im Falle von PostCSS: Warum die Generierung?

> Weil die Breakpoints zumindest in der JS Nutzung über den `DeviceService` typesafe sein sollten.
> Weil die Breakpoints nicht an zwei Stellen (CSS & JS) definiert werden sollten

#### vanilla-extract

#### Pro (WIP)

- CSS & JS wäre beides typesafe
- Kein extra Tooling nötig, aber bringt ja wiederum Tooling mit (siehe Kontra)

##### Kontra (WIP)

- `ng update|(add)`: Man müsste für die Intergration auf Angular version updates via Angular CLI verzichten, siehe: https://angular.dev/ecosystem/custom-build-pipeline#what-are-the-options
- Extra `<component>.css.ts` files, sofern man die Struktur nicht brechen will, indem man den CSS-in-JS code über die Component Classes in `<component>.ts` packt. Daraus ergibt sich so ein workflow: Man bearbeitet, nachdem man die styles in `<component>.ts` importiert hat `<component>.css.ts` idr. parallel mit `<component>.css` und dann `<component>.html`
- Bietet mehr Optionen.
  - Andere Entwickler könnten damit CSS und CSS-in-JS definieren
  - Andere Entwickler könnten Media Queries in CSS und CSS-in-JS definieren

#### PostCSS

##### Pro (WIP)

- `ng update|(add)`: Ginge grundlegend ohne ejecting (@analogjs/vite-plugin-angular)
  - Wenn auch ohne automatischen rebuild bei Änderungen an der Breakpoint-Basis-Datei, wäre aber total ausreichend.
- Styles wären, wie gehabt, möglichst nah beieinander

##### Kontra (WIP)

- Zumindets in VSCode gibt es kein gescheites PostCSS Plugin. Man muss bei den media queries auf auto-completion verzichten und unknown @-rule per project settings.json erlauben.
- Zumindest per default (ggf. gibts Lösungen, Scripten könnte man es ohne viel Aufwand extern von Linting-Tools. Vermutlich könnte man auch stylelint verwenden oder ähnliches, ist aber wiederum mehr tooling, würde aber wiederum auch mehr optionen bieten wie z. B. automatische sortierung von CSS Properties) gibt es in CSS kein Linting bzgl. vorhandener properties (variablen). D. h. dass zum Beispiel nach dem Entfernen eines Breakpoints kein Linter warnt, wenn man noch den alten verwendet.
