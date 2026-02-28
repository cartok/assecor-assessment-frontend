# Technische Entscheidungen

## Kontext

Die Umsetzung wurde bewusst iterativ aufgebaut: erst eine belastbare technische Basis, dann schrittweise funktionale und nicht-funktionale Vertiefung.

Ausgangslage für diese Aufgabe:

- Seit November 2024 kein klassisches Web-Frontend mit DOM/CSS entwickelt
- Von Februar 2025 bis August 2025 primar React Native genutzt
- Kein dauerhaft gepflegter "One-size-fits-all"-Frontend-Stack

Das Ziel war daher, nachvollziehbare Architekturentscheidungen zu treffen, die schnell zu einem sauberen, erweiterbaren Ergebnis führen.

## 1. Angular als Framework

Warum:

- Sehr gute Trennung von Verantwortlichkeiten
- Reifer, stabiler Stack mit klaren Konventionen
- Passt fachlich und technisch zur Aufgabenstellung
- Durch offene API ohne Auth war kein zusätzliches Backend für Secret-Handling notwendig, wodurch rein CSR kein Problem war. 

Alternativen:

- Vue (+ Nuxt), bin gespannt auf vapor
- Solid (+ SolidStart) 
- React (+ Next/Remix) 

Trade-off:

- Nicht der absolute Benchmark-Spitzenreiter bei Rendering-Performance, in diesem Kontext aber mehr als ausreichend

Status:

- Grundarchitektur läuft stabil

Nächster Schritt:

- Siehe unten in README

## 2. Angular CLI statt Nx oder Analog

Warum:

- Möglichst niedrige Einstiegskomplexität
- Schneller Projektstart mit minimaler Tooling-Reibung

Alternativen:

- Nx
- Analog

Trade-off:

- Einzelne Tooling-Details mussten manuell ergänzt werden

Status:

- Für den Aufgabenkontext passend und DX-seitig stabil

Nächster Schritt:

- Keine kurzfristige Änderung geplant

## 3. State und Rendering: Signals + Zoneless + CSR

Warum:

- Signals für lokalen Zustand sind direkt, einfach und performant
- Zoneless reduziert unnötige Change-Detection-Kosten
- CSR war für den Projektkontext die schnellste und angemessene Basis

Alternativen:

- RxJS-fokussierter Ansatz
- zusätzlich SSR/SSG/Hybrid

Trade-off:

- Ohne SSR sind SEO und initiales Rendering nicht maximal optimiert
- Route-spezifisches Prefetching bleibt ohne zusätzliche Infrastruktur begrenzt

Status:

- Architektur funktioniert gut und bleibt bewusst einfach

Nächster Schritt:

- SSR/Hybrid optional später evaluieren, wenn alle Kernanforderungen abgeschlossen sind

## 4. Styling mit nativem CSS statt Tailwind/SCSS

Warum:

- Fokus auf Einfachheit und Lesbarkeit
- Moderne CSS-Features reichen für den aktuellen Umfang weitgehend aus
- Vermeidet zusätzliche Tooling-Komplexität in früher Projektphase

Alternativen:

- Tailwind
- SCSS
- PostCSS

Trade-off:

- Bei Media-Query-Organisation und bestimmten Kompatibilitätsdetails wäre ein Preprocessing-Layer hilfreich
- Die bereitgestellten Mockups waren für die Umsetzung ausreichend, Detailabstände und Feinabstimmung ließen sich im vorhandenen Inspect-Workflow aber teils nur mit manueller Annäherung übernehmen

Status:

- Funktioniert für den aktuellen Umfang, aber mit erkennbaren Grenzen

Nächster Schritt:

- Siehe unten in README

## 5. SVG-Asset-Strategie mit manuell gepflegtem Sprite-Sheet

Warum:

- SVG-Sprites sind flexibel, cachebar und technisch sauber
- Für den Projektumfang war ein manuelles Sheet schneller als die Einführung neuer Build-Werkzeuge

Alternativen:

- `jannicz/ng-svg-icon-sprite`
- `ngneat/svg-icon`

Trade-off:

- Weniger Automatisierung und etwas schlechtere Developer Experience

Status:

- Für den Scope ausreichend

Nächster Schritt:

- Bei Projektfortführung: automatisierte Sprite-Generierung einführen

## 6. Store-Strategie: Signals und einfache Singleton-Services

Warum:

- API-Domain und Scope sind überschaubar
- Direkte, leicht wartbare Lösung ohne zusätzliche Store-Abstraktion

Alternative:

- `@ngrx/signals`

Trade-off:

- Bei stark wachsender Komplexität wäre ein formaler Store ggf. vorteilhaft

Status:

- Für den Umfang passend

Nächster Schritt:

- Erst bei klarer Komplexitätszunahme neu bewerten

## 7. Testing-Ansatz

Aktueller Stand:

- Es gibt nur wenig Unit-Test-Abdeckung

Begründung:

- Für den Umfang dieser Bewerbungsaufgabe lag der Fokus auf Architektur, Funktionalität und sauberer Integrationsbasis
- Ein hohes Unit-Test-Volumen wäre in dieser Phase unverhältnismässig

Geplanter Ansatz:

- Unit-Tests gezielt für isolierbare, kritische Logik mit klaren In-/Outputs
- E2E-Tests für kritische User-Flows (Navigation, Kern-Use-Cases)
- Keine redundanten Assertions über mehrere Testebenen hinweg
- Ergänzend Integration-, Deployment- und bei Bedarf Contract-Tests in sinnvollem Umfang

## 8. Accessibility-Strategie und offene Punkte

Aktueller Stand:

- Accessibility ist teilweise umgesetzt, aber noch nicht abgeschlossen
- Es bestehen offene funktionale und nicht-funktionale Punkte in mehreren Komponenten

Priorisierte Weiterentwicklung:

1. Tastatur-Navigation und Fokusführung manuell prüfen und korrigieren
2. Semantik, ARIA-Attribute und textuelle Metadaten systematisch verfeinern
3. Manuelle Checks mit Browser-Tools/Plugins ergänzen
4. Danach automatisierte Accessibility-Prüfungen in E2E-Pipeline aufnehmen

Hinweis:

- Die SWAPI-spezifischen Integrationsrisiken und Datenprobleme sind separat in [swapi.md](./swapi.md) dokumentiert.
