const SWAPI_API_BASE_URL = 'https://swapi.dev/api'

export function swapiUrl(
  pathSegments: string[],
  query?: ConstructorParameters<typeof URLSearchParams>[0],
): string {
  const path = pathSegments
    .map((pathSegment) => normalizePathSegment(pathSegment))
    .join('/')

  const baseUrlAndPath = `${SWAPI_API_BASE_URL}/${path}`

  if (query !== undefined) {
    const parameterString = new URLSearchParams(query).toString()
    if (parameterString.length === 0) {
      return new URL(baseUrlAndPath).toString()
    }

    return new URL(`${baseUrlAndPath}?${parameterString}`).toString()
  }

  return new URL(baseUrlAndPath).toString()
}

function normalizePathSegment(value: string): string {
  return value.replace(/^\/+|\/+$/g, '')
}
