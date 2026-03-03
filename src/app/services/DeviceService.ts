import type { Signal } from '@angular/core'
import { Injectable, signal } from '@angular/core'

export type Breakpoint = 's' | 'm' | 'l'

@Injectable({ providedIn: 'root' })
export class DeviceService {
  // TODO: Noch mal überlegen: Ich hab die Parameter hier als Signal angelegt. Wenn ich sie beim window resize updaten würde, wie würde sich das z.b. auf bereits geladene `<img>`s auswirken? Würden sich dann nur die Attribute ändern? Das wäre zwar unnötig, aber nicht schädlich. Schädlich wäre es, wenn sie z.b. neu geladen werden würden, oder die ganze component, die von dem Signal / Input abhängig ist. Bin da noch nicht vertraut genug mit. Man könnte auch zwischen SSR Parametern und dynamischen Parametern unterscheiden, falls nötig, dann hätte man die flexiblen SSR Optimierungen und zuätzlich die Möglichkeit (falls nötig), z. B. unterschiedlichen Content auszuspielen oder ggf. andere JS-basierte Dinge durch resize zu beinflussenm aber gut möglich dass da kein Bedarf ist. Definitiv zu einem sauberen Ergebnis kommen, kein Bug-Beast bauen.
  readonly touch: Signal<boolean | undefined> = signal(undefined)
  readonly breakpoint: Signal<Breakpoint | undefined> = signal(undefined)
}
