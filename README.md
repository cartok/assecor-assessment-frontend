# Angular Signals-based SWAPI Frontend

Live Demo (GitHub Pages):

- [https://cartok.github.io/assecor-assessment-frontend/](https://cartok.github.io/assecor-assessment-frontend/)

Frontend-Implementierung der Assecor-Bewerbungsaufgabe auf Basis von Angular mit Fokus auf klare Architektur, schnelle Iteration und solide Erweiterbarkeit.

## Original Aufgabenstellung

Die Aufgabenstellung bleibt unverändert und ist hier einsehbar:

- [Assecor Assessment Frontend README](https://github.com/Assecor-GmbH/assecor-assessment-frontend/blob/master/README.md)
- [UI Mockups / Design](https://xd.adobe.com/view/b3c98134-11a8-44c2-5dd2-477b8550307f-c5f8/)

## Projektstatus

Die Abgabe ist ein belastbarer Zwischenstand:

- Die Kernstruktur (Routing, Datenzugriff, Komponentenaufbau, Styling-Basis) steht.
- Einzelne Komponenten sind funktional und nicht-funktional noch nicht vollständig ausgebaut.
- Es gibt eine klare Roadmap für Weiterentwicklung, insbesondere bei Accessibility und Testing.

## Aktueller Funktionsumfang

- SPA mit lazy geladenen Routen
- Seiten für `movies`, `movie/:id`, `characters`, `character/:id`, `planets`, `planet/:id`
- API-Integration für SWAPI-Ressourcen (Films, People, Planets)
- Robustes DTO-zu-Model-Mapping und Retry-Interception auf HTTP-Ebene
- Eigene UI-Bausteine und Layouts für Listen- und Detailseiten

## Tech-Stack

- Angular 21 (standalone, lazy routing, zoneless change detection)
- TypeScript 5
- Bun als Paketmanager und Script-Runner
- ESLint + Prettier für Codequalität
- Native CSS (ohne Tailwind/SCSS)

## Setup

Voraussetzungen:

- Node.js `22.22.0` (siehe `.node-version`)
- Bun `1.3.9` oder kompatibel

Installation und Start:

```bash
bun install
bun run start
```

App lokal:

- `http://localhost:4200`

## Verfügbare Scripts

- `bun run start` startet den Dev-Server
- `bun run build` erstellt den Production-Build
- `bun run test` startet Unit-Tests
- `bun run lint` führt Typecheck, Angular-Lint und Prettier-Check aus
- `bun run fix` führt Lint-Fixes und Formatierung aus

## Dokumentation

- [Technische Entscheidungen und Trade-offs](docs/entscheidungen.md)
- [SWAPI-Analyse, API-Probleme und Integrationsnotizen](docs/swapi.md)

## Nächste Ziele

Sicherlich wäre ein Service Worker sinnvoll, wenn man die schlechte Architektur der SWAPI noch besser als nur mit Runtime Cache behandeln wollte. Es würde sich aber falsch anfühlen nicht erst das Backend zu verbessern, aber eventuell konfiguriere ich später doch mal einen, einfach des Templates wegen.

1. ~~CSS~~
   - ~~Präprozessor geziehlt wählen und einbauen~~
     - ~~Verwendung globaler CSS Klassen in .html Templates ersetzen~~
     - ~~Wiederverwendung der definierten CSS Variablen in Media Queries~~

   > Ich habe mich dafür entschieden die globalen Klassen beizubehalten, aber die Media Queries per PostCSS zu reusen.

2. SSR + Device Detection + CSS
   - Grundlegend SSR per Elysia implementieren
   - Clientseitige device detection (infos: `{ touch: boolean, width: number, height: number }`) mit redirect per `location.replace()`
   - Appweite Nutzung der device infos für SSR basiertes responsive rendering
     - Auf JavaScript Seite ...
     - Auf CSS Seite ...
   - Image loading & preloading mit den dann vorhandenen Mitteln optimieren
   - Die sub resource Listen mit den dann vorhandenen Mitteln abschließen

3. Erweiterungen für SSR + Device Detection + CSS
   - Cookie erstellen zum caching der device detection infos
     - Fallback falls Cookie erstellen nicht möglich ist
   - Fallback für device detection, falls JS nicht aktiviert ist

4. Lösung zur automatisierten Generierung und Verwendung von SVG Spritesheet(s) mit guter DX

5. Aria
   - Angular Aria
   - AI Scan
   - Browser Tools
   - Automations

6. Sonstiges
   - Ggf. die Device Detection durch Nutzen von Sec-CH-UA-Mobile, Sec-CH-UA-Form-Factors, Sec-CH-UA-Model, Sec-CH-UA-Platform macht
