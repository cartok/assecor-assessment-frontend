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

> **Aktuelle grobe Richtung:** Vermutlich später komplett auf static css-in-js umsteigen, jetzt maximal ausprobieren aber erstmal bei postcss bleiben, revalidieren und kein komplettes css refactoring noch mit rein bringen in dieses experiment.

## SEC-CH Headers

### Low-entropy headers

Werden direkt mitgesended, sofern nicht blockiert.
https://wicg.github.io/client-hints-infrastructure/#low-entropy-hint-table

**Auswahl:**

- Sec-CH-UA-Mobile: ?1, ?0
  Bezieht sich auf den Formfaktor des Geräts, nicht auf Browser Eigenschaften, unterscheidet aber nicht zwischen Mobile und Tablet, daher kann ?0 auch Tablet sein.

### High-entropy headers

Kann der Server bei Antwort per Accept-CH Header anfragen und werden dann beim nächsten Request mitgesendet, sofern nicht blockiert.

**Auswahl:**

- Sec-CH-Form-Factors: "Desktop", "Automotive", "Mobile", "Tablet", "XR", "EInk", "Watch"
  Keine Breite Unterstüztung, aber sofern unterstüzt kann man es vor allem für die Evaluierung, ob es Tablet ist hinzunehmen.
- Sec-CH-Viewport-Width
- Sec-CH-Viewport-Height

## Kein caching der device infos bei Desktop (resizeable)

Optionen zum recht genauen Feststellen:

1. Media Query im Browser: `(pointer: fine) AND (hover: hover)`
2. Low-entropy hint: `Sec-CH-UA-Mobile = ?0`

In der Praxis startet ein Browser auf Tablets fast immer fullscreen. Daher kann für Tablet ruhig die device info gecached werden.

### Pointer und Hover Browser Features

| pointer | hover | Gerätetyp        |
| ------- | ----- | ---------------- |
| fine    | hover | Desktop / Laptop |
| coarse  | none  | Smartphone       |
| coarse  | hover | selten (Hybrid)  |

TODO: Orientation parameter nicht vergessen im redirect zu generieren? Bzw evtl doch unnötig aber mal durchchecken wie es sich z.b bei landscape smartphone verhält
TODO: Wie kann ich zuverlässig von Desktop / Laptop Geräte die einen Touchscreen verwenden unterscheiden?

### Browser Features zur potentiellen Gerätetyp-Identifkation

- https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/height
- https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/width
- https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/aspect-ratio
- https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/orientation
- https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/resolution
- https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/pointer
- https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/display-mode
- https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/hover

# TODO Sammel Liste

- Clientseitige Cookie updates behandeln
- Prüfen: Ich hab die device prams als Signal angelegt. Wenn ich sie beim window resize updaten würde, wie würde sich das z.b. auf bereits geladene `<img>`s auswirken? Würden sich dann nur die Attribute ändern? Das wäre zwar unnötig, aber nicht schädlich. Schädlich wäre es, wenn sie z.b. neu geladen werden würden, oder die ganze component, die von dem Signal / Input abhängig ist. Bin da noch nicht vertraut genug mit. Man könnte auch zwischen SSR Parametern und dynamischen Parametern unterscheiden, falls nötig, dann hätte man die flexiblen SSR Optimierungen und zuätzlich die Möglichkeit (falls nötig), z. B. unterschiedlichen Content auszuspielen oder ggf. andere JS-basierte Dinge durch resize zu beinflussenm aber gut möglich dass da kein Bedarf ist. Definitiv zu einem sauberen Ergebnis kommen, kein Bug-Beast bauen.
- Sollte für touch prüfung js touchpoints check hinzugenommen werden?
  ```js
  const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0
  ```

```

```
