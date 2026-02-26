# Assecor Assessment Frontend

Frontend-Implementierung der Assecor-Bewerbungsaufgabe auf Basis von Angular mit Fokus auf klare Architektur, schnelle Iteration und solide Erweiterbarkeit.

## Original Aufgabenstellung

Die Aufgabenstellung bleibt unveraendert und ist hier einsehbar:

- [Assecor Assessment Frontend README](https://github.com/Assecor-GmbH/assecor-assessment-frontend/blob/master/README.md)

## Projektstatus

Die Abgabe ist ein belastbarer Zwischenstand:

- Die Kernstruktur (Routing, Datenzugriff, Komponentenaufbau, Styling-Basis) steht.
- Einzelne Komponenten sind funktional und nicht-funktional noch nicht vollstaendig ausgebaut.
- Es gibt eine klare Roadmap fuer Weiterentwicklung, insbesondere bei Accessibility und Testing.

## Aktueller Funktionsumfang

- SPA mit lazy geladenen Routen
- Seiten fuer `movies`, `movie/:id`, `characters`, `character/:id`, `planets`, `planet/:id`
- API-Integration fuer SWAPI-Ressourcen (Films, People, Planets)
- Robustes DTO-zu-Model-Mapping und Retry-Interception auf HTTP-Ebene
- Eigene UI-Bausteine und Layouts fuer Listen- und Detailseiten

## Tech-Stack

- Angular 21 (standalone, lazy routing, zoneless change detection)
- TypeScript 5
- Bun als Paketmanager und Script-Runner
- ESLint + Prettier fuer Codequalitaet
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

## Verfuegbare Scripts

- `bun run start` startet den Dev-Server
- `bun run build` erstellt den Production-Build
- `bun run test` startet Unit-Tests
- `bun run lint` fuehrt Typecheck, Angular-Lint und Prettier-Check aus
- `bun run fix` fuehrt Lint-Fixes und Formatierung aus

## Dokumentation

- [Technische Entscheidungen und Trade-offs](docs/entscheidungen.md)
- [SWAPI-Analyse, API-Probleme und Integrationsnotizen](docs/swapi.md)

Kurz zu `docs/swapi.md`:
Die Datei dokumentiert die technischen Schwachstellen der SWAPI (Schema, Datenqualitaet, Pagination, fehlende Assets) und beschreibt den gewaehlten Umgang damit in dieser Implementierung.
