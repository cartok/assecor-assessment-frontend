# SWAPI Integration Notes

## Purpose

This document captures the technical reality of integrating [SWAPI](https://swapi.dev/) into this project:

- what is reliable
- what is inconsistent
- how those issues are currently handled
- what could be improved later

## Sources

- API docs: <https://swapi.dev/documentation>
- Source repository: <https://github.com/Juriy/swapi>
- JSON schemas: <https://github.com/Juriy/swapi/tree/master/resources/schemas>
- Fixture data: <https://github.com/Juriy/swapi/tree/master/resources/fixtures>

## Scope Used in This Project

Only these resources are integrated for now:

| Resource | Collection endpoint             | Detail endpoint                      |
| -------- | ------------------------------- | ------------------------------------ |
| People   | `https://swapi.dev/api/people`  | `https://swapi.dev/api/people/<id>`  |
| Films    | `https://swapi.dev/api/films`   | `https://swapi.dev/api/films/<id>`   |
| Planets  | `https://swapi.dev/api/planets` | `https://swapi.dev/api/planets/<id>` |

## Why No SWAPI Client Library

Existing SWAPI helper libraries are outdated and not a good fit for a modern typed Angular stack.
This project uses direct HTTP integration with explicit DTO/model mapping instead.

## API Behavior and Data Findings

### Pagination

Not all resources are paginated. Pagination appears only when a resource has more than 10 items.

| Resource     | Paginated |
| ------------ | --------- |
| `/people`    | yes       |
| `/films`     | no        |
| `/starships` | yes       |
| `/vehicles`  | yes       |
| `/species`   | yes       |
| `/planets`   | yes       |

Important detail:

- for non-paginated resources (`<= 10` items), `next` and `previous` may be missing entirely

### Structural and Data Issues

| Topic               | Problem                                      | Current handling                                         |
| ------------------- | -------------------------------------------- | -------------------------------------------------------- |
| Localization        | Data is English only                         | App content is kept in English                           |
| Response shape      | Not JSON:API, custom list envelopes          | Dedicated TypeScript response types                      |
| `/schema` endpoint  | Documented endpoint is not available         | Schemas are taken from GitHub source                     |
| Schema quality      | Array item types are incomplete              | Schemas are adjusted before type generation              |
| Enums               | Not modeled in source schemas                | Added only when required by UI                           |
| Numeric values      | Numbers are often encoded as strings         | Kept as strings unless strict numeric behavior is needed |
| Empty values        | Uses `"n/a"` / `"unknown"` instead of `null` | Normalized case-by-case in mapping                       |
| Text payloads       | Includes control characters like `\r\n`      | Normalized for display where needed                      |
| Date formats        | Domain-specific formats like `ABY`/`BBY`     | Kept as-is unless UI formatting is required              |
| JSON schema version | Very old draft (`draft-04`)                  | No runtime schema validation with modern Ajv setup       |
| Images              | No stable image assets in SWAPI              | Mock image mapping is used in the frontend               |

Legacy image endpoint example (no longer reliable):

```bash
curl 'https://starwars-visualguide.com/assets/img/characters/1.jpg' -IL
```

## Response Model Used

Collection endpoints are handled with a shared response contract:

```ts
export interface ResourceResponse {
  readonly created: Date
  readonly edited: Date
}

export interface ResourceCollectionResponse<T extends ResourceResponse> {
  /**
   * Total amount of entries for this resource.
   */
  count: number
  /**
   * Full URL to next page.
   * Can be missing on non-paginated resources.
   */
  next?: string | null
  /**
   * Full URL to previous page.
   * Can be missing on non-paginated resources.
   */
  previous?: string | null
  results: T[]
}
```

## Error Behavior

- missing single resource: `404` with JSON body, e.g. `{ "detail": "Not found" }`
- missing collection or unknown endpoint: `404` with default Django error page

## Summary

SWAPI is fully usable for this frontend challenge, but it requires defensive integration:

- explicit mapping
- careful typing
- tolerant parsing for inconsistent fields
- local fallback strategy for missing media assets
