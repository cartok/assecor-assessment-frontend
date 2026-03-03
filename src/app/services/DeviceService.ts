import type { Signal } from '@angular/core'
import { Injectable, signal } from '@angular/core'

@Injectable({ providedIn: 'root' })
export class DeviceService {
  readonly touch: Signal<boolean | undefined> = signal(undefined)
  readonly maxWidth: Signal<number | undefined> = signal(undefined)
  readonly maxHeight: Signal<number | undefined> = signal(undefined)
}

// TOOD: 1. vanilla-extract-css genauer angucken
// TOOD: 2. Lösung für JS-machting rules & CSS rule options bei gemeinsamer definitions-basis (single source of truth für width und height breakpoints). Überlegen ob aliase (desktop, tablet, mobile & <gradiations>, target, min, max) am ende worthy sind.
// TODO: 3. Bevor es Konkreter wird mal überlegen: Ich hab die device prams als Signal angelegt. Wenn ich sie beim window resize updaten würde, wie würde sich das z.b. auf bereits geladene `<img>`s auswirken? Würden sich dann nur die Attribute ändern? Das wäre zwar unnötig, aber nicht schädlich. Schädlich wäre es, wenn sie z.b. neu geladen werden würden, oder die ganze component, die von dem Signal / Input abhängig ist. Bin da noch nicht vertraut genug mit. Man könnte auch zwischen SSR Parametern und dynamischen Parametern unterscheiden, falls nötig, dann hätte man die flexiblen SSR Optimierungen und zuätzlich die Möglichkeit (falls nötig), z. B. unterschiedlichen Content auszuspielen oder ggf. andere JS-basierte Dinge durch resize zu beinflussenm aber gut möglich dass da kein Bedarf ist. Definitiv zu einem sauberen Ergebnis kommen, kein Bug-Beast bauen.
// TOOD: 4. API fertig definieren damit features & constraints klarer sind
// - builder vs config und/oder mehrere utils/methods

// CSS Wise
// - https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/height
// - https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/width
// - https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/aspect-ratio
// - https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/orientation
// - https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/resolution
// - https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/pointer
// - https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/display-mode

// JS Wise
