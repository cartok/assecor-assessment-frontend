# Technische Entscheidungen

## Kontext

Die Umsetzung wurde bewusst iterativ aufgebaut: erst eine belastbare technische Basis, dann schrittweise funktionale und nicht-funktionale Vertiefung.

Ausgangslage fuer diese Aufgabe:

- Seit November 2024 kein klassisches Web-Frontend mit DOM/CSS entwickelt
- Von Februar 2025 bis August 2025 primar React Native genutzt
- Kein dauerhaft gepflegter "One-size-fits-all"-Frontend-Stack

Das Ziel war daher, nachvollziehbare Architekturentscheidungen zu treffen, die schnell zu einem sauberen, erweiterbaren Ergebnis fuehren.

## 1. Angular als Framework

Warum:

- Sehr gute Trennung von Verantwortlichkeiten
- Reifer, stabiler Stack mit klaren Konventionen
- Passt fachlich und technisch zur Aufgabenstellung
- Durch offene API ohne Auth war kein zusaetzliches Backend fuer Secret-Handling notwendig

Alternativen:

- Vue + Nuxt
- React + Next
- Solid + SolidStart

Trade-off:

- Nicht der absolute Benchmark-Spitzenreiter bei Rendering-Performance, in diesem Kontext aber mehr als ausreichend

Status:

- Grundarchitektur laeuft stabil

Naechster Schritt:

- Optionale Erweiterung um SSR/Hybrid-Rendering nach funktionaler Vervollstaendigung

## 2. Angular CLI statt Nx oder Analog

Warum:

- Moeglichst niedrige Einstiegskomplexitaet
- Schneller Projektstart mit minimaler Tooling-Reibung

Alternativen:

- Nx
- Analog

Trade-off:

- Einzelne Tooling-Details mussten manuell ergaenzt werden

Status:

- Fuer den Aufgabenkontext passend und DX-seitig stabil

Naechster Schritt:

- Keine kurzfristige Aenderung geplant

## 3. State und Rendering: Signals + Zoneless + CSR

Warum:

- Signals fuer lokalen Zustand sind direkt, einfach und performant
- Zoneless reduziert unnoetige Change-Detection-Kosten
- CSR war fuer den Projektkontext die schnellste und angemessene Basis

Alternativen:

- RxJS-fokussierter Ansatz
- zusaetzlich SSR/SSG/Hybrid

Trade-off:

- Ohne SSR sind SEO und initiales Rendering nicht maximal optimiert
- Route-spezifisches Prefetching bleibt ohne zusaetzliche Infrastruktur begrenzt

Status:

- Architektur funktioniert gut und bleibt bewusst einfach

Naechster Schritt:

- SSR/Hybrid optional spaeter evaluieren, wenn alle Kernanforderungen abgeschlossen sind

## 4. Styling mit nativem CSS statt Tailwind/SCSS

Warum:

- Fokus auf Einfachheit und Lesbarkeit
- Moderne CSS-Features reichen fuer den aktuellen Umfang weitgehend aus
- Vermeidet zusaetzliche Tooling-Komplexitaet in frueher Projektphase

Alternativen:

- Tailwind
- SCSS
- PostCSS

Trade-off:

- Bei Media-Query-Organisation und bestimmten Kompatibilitaetsdetails waere ein Preprocessing-Layer hilfreich
- Die bereitgestellten Mockups waren fuer die Umsetzung ausreichend, Detailabstaende und Feinabstimmung liessen sich im vorhandenen Inspect-Workflow aber teils nur mit manueller Annaeherung uebernehmen

Status:

- Funktioniert fuer den aktuellen Umfang, aber mit erkennbaren Grenzen

Naechster Schritt:

- Pruefen, ob ein leichter PostCSS/SCSS-Einsatz die Wartbarkeit verbessert, ohne die Einfachheit zu verlieren

## 5. SVG-Asset-Strategie mit manuell gepflegtem Sprite-Sheet

Warum:

- SVG-Sprites sind flexibel, cachebar und technisch sauber
- Fuer den Projektumfang war ein manuelles Sheet schneller als die Einfuehrung neuer Build-Werkzeuge

Alternativen:

- `jannicz/ng-svg-icon-sprite`
- `ngneat/svg-icon`

Trade-off:

- Weniger Automatisierung und etwas schlechtere Developer Experience

Status:

- Fuer den Scope ausreichend

Naechster Schritt:

- Bei Projektfortfuehrung: automatisierte Sprite-Generierung einfuehren

## 6. Store-Strategie: Signals und einfache Singleton-Services

Warum:

- API-Domain und Scope sind ueberschaubar
- Direkte, leicht wartbare Loesung ohne zusaetzliche Store-Abstraktion

Alternative:

- `@ngrx/signals`

Trade-off:

- Bei stark wachsender Komplexitaet waere ein formaler Store ggf. vorteilhaft

Status:

- Fuer den Umfang passend

Naechster Schritt:

- Erst bei klarer Komplexitaetszunahme neu bewerten

## 7. Testing-Ansatz

Aktueller Stand:

- Es gibt nur wenig Unit-Test-Abdeckung

Begruendung:

- Fuer den Umfang dieser Bewerbungsaufgabe lag der Fokus auf Architektur, Funktionalitaet und sauberer Integrationsbasis
- Ein hohes Unit-Test-Volumen waere in dieser Phase unverhaeltnismaessig

Geplanter Ansatz:

- Unit-Tests gezielt fuer isolierbare, kritische Logik mit klaren In-/Outputs
- E2E-Tests fuer kritische User-Flows (Navigation, Kern-Use-Cases)
- Keine redundanten Assertions ueber mehrere Testebenen hinweg
- Ergaenzend Integration-, Deployment- und bei Bedarf Contract-Tests in sinnvollem Umfang

## 8. Accessibility-Strategie und offene Punkte

Aktueller Stand:

- Accessibility ist teilweise umgesetzt, aber noch nicht abgeschlossen
- Es bestehen offene funktionale und nicht-funktionale Punkte in mehreren Komponenten

Priorisierte Weiterentwicklung:

1. Tastatur-Navigation und Fokusfuehrung manuell pruefen und korrigieren
2. Semantik, ARIA-Attribute und textuelle Metadaten systematisch verfeinern
3. Manuelle Checks mit Browser-Tools/Plugins ergaenzen
4. Danach automatisierte Accessibility-Pruefungen in E2E-Pipeline aufnehmen

Hinweis:

- Die SWAPI-spezifischen Integrationsrisiken und Datenprobleme sind separat in [swapi.md](./swapi.md) dokumentiert.
