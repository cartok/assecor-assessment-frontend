# SWAPI

The Star Wars API

## General Info

The API is unprotected, no authentication is necessary and therefore for this project it's just fine to implement it fully in the frontend.

- Documentation: https://swapi.dev/documentation
- Source: https://github.com/Juriy/swapi
- Schemas from source: https://github.com/Juriy/swapi/tree/master/resources/schemas
- Data from source: https://github.com/Juriy/swapi/tree/master/resources/fixtures

## Implementation Scope

I will, for now, only target to implement three of the resources:

- [People/Characters](https://swapi.dev/documentation#people) i. e. `https://swapi.dev/api/people` & `https://swapi.dev/api/people/<id>`
- [Movies/Films](https://swapi.dev/documentation#films) i. e. `https://swapi.dev/api/films` & `https://swapi.dev/api/films/<id>`
- [Planets](https://swapi.dev/documentation#planets) i. e. `https://swapi.dev/api/planets` & `https://swapi.dev/api/planets/<id>`

## Helper libraries

There helper libraries for several languages to abstact doing the API requests. They are all many years old. The TypesScript package uses lodash and the results are bad.

> I won't use them.

## Data Analysis

The data basis can be found on [github](https://github.com/Juriy/swapi/tree/master/resources/fixtures) on github.

There are many issues with the API functionallity, schemas and data structures. More infos in sections below.

### Pagination

Not all resources are paginated. Pagination happens if a resource has more than 10 entries.
The pagination can be accessed done via `next` and `previous` fields. There are no `first` and `last` fields.

| Resource   | Paged |
| ---------- | ----- |
| /people    | yes   |
| /films     | no    |
| /starships | yes   |
| /vehicles  | yes   |
| /species   | yes   |
| /planets   | yes   |

### General Issues & Solutions

#### Language

- There are no translations, language is english.
  > I will therefore use englisch for the whole application.

#### Schema

- The API only uses JSON Schemas for the resource entries, it is not JSON:API conform. Example response (paginated):
  ```json
  {
    "count": 37,
    "next": "https://swapi.dev/api/species/?page=2",
    "previous": null,
    "results": []
  }
  ```
  Here `count` is the total amount of results, so in this example there are 4 pages.
  > I can define a type for this respons format. Thereby I should be aware that for pages which are not paginated cause they have less than 11 entries (i.e. /films), the `next` and `previous` properties do not exist at all.
- The documented `/<resource>/schema` endpoints are not working but schemas can be found on [github](https://github.com/Juriy/swapi/tree/master/resources/schemas).
  > I use the schemas as basis for type definition using [quicktype](https://github.com/glideapps/quicktype).
- The schemas do not specify the item type of arrays.
  > I fix that before generating API definition.
- There are **no enums** defined
  > I might define some but only if neccessary for rendering.
- There are often comma-space-separated lists in string values.
  > It's bad but unless I need to render each entry separately, I leave it as is.
- Numbers are often stored as strings but it is not clear if parsing the strings to number works without loosing information in every case. For example in the `/species` resource the `average_lifespan` field which is usually a integer string, can also be `"indefinite"`.
  > It's bad but unless I need to do calculation or comparison, I leave it as is.
- Empty fields are **mostly** not given a `null` value, instead their value is `"n/a"` or `"unknown"`.
  > Could be mapped to `null`
- Birth dates are only given in years.
  > Just bad or non-existing data but ok, no issue for me.
- Birth dates are defined in the [
  'ABY-BBY' dating system](https://starwars.fandom.com/wiki/%27ABY-BBY%27_dating_system)
  > I might format those strings to add a space before `ABY|BBY`.
- Texts include `\r\n` to separate lines.
  > I might split them if it looks well, otherwise i'd just remove the control characters.
- The search functionality is not working at all:
  - input:
    ```shell
    curl 'https://swapi.dev/api/people/?name=Annakin' | jq '.results_count = (.results | length) | .results |= map({name})' | bat --language=json
    ```
  - output:
    ```json
    {
      "count": 82,
      "next": "https://swapi.dev/api/people/?name=Annakin&page=2",
      "previous": null,
      "results": [
        {
          "name": "Luke Skywalker"
        },
        {
          "name": "C-3PO"
        },
        {
          "name": "R2-D2"
        },
        {
          "name": "Darth Vader"
        },
        {
          "name": "Leia Organa"
        },
        {
          "name": "Owen Lars"
        },
        {
          "name": "Beru Whitesun lars"
        },
        {
          "name": "R5-D4"
        },
        {
          "name": "Biggs Darklighter"
        },
        {
          "name": "Obi-Wan Kenobi"
        }
      ],
      "results_count": 10
    }
    ```
    > I could only implement the search UI in the page header by requesting all resources and search for results on my own. Nothing I would want to do in the frontend, so I'll not implement it.
- The JSON Schema version is very old (`draft-04`). Validation via [Ajv](https://ajv.js.org/guide/typescript.html) would not make sense cause Draft-04 is only supported in [very old non-TypeScript version](https://github.com/ajv-validator/ajv/releases/tag/v6.0.0) as of the [documentation](https://ajv.js.org/guide/schema-language.html#draft-04)
  > Won't make use of it. Might create unit-test instead. Mapping code will be custom and types will be derived from roughly improved schema via [quicktype](https://github.com/glideapps/quicktype) & manual work.

### Payload

The collection endpoints (e.g. `/https://swapi.dev/api/<resource>`) have a common response structure of this type for successful requests:

```ts
export interface ResourceResponse {
  /**
   * The ISO 8601 date format of the time that this resource was created.
   */
  readonly created: Date
  /**
   * the ISO 8601 date format of the time that this resource was edited.
   */
  readonly edited: Date
}

export interface ResourceCollectionResponse<T extends ResourceResponse> {
  /**
   * Total entries (page size = 10).
   * This value does not represent the number of resources in the actual payload / is the same for every page.
   */
  count: number
  /**
   * Full URL to the next page, if any.
   * Property does not exist at all, if there is only one page (<= 10 resources).
   */
  next?: string | null
  /**
   * Full URL to the previous page, if any.
   * Property does not exist at all, if there is only one page (<= 10 resources).
   */
  previous?: string | null
  results: T[]
}
```

Requesting a non existing resouce directly results in 404 with body of:

```json
{ "detail": "Not found" }
```

Requesting a non existing collection or any non-existing endpoint results in 404 with a standard Django error page, but that should not matter for the integration.
