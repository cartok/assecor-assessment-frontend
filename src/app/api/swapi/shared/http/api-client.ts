export const SWAPI_API_BASE_URL = 'https://swapi.dev/api'

export function swapiUrl(...pathSegments: string[]): string {
  const path = pathSegments
    .map((pathSegment) => normalizePathSegment(pathSegment))
    .join('/')

  return new URL(`${SWAPI_API_BASE_URL}/${path}`).toString()
}

function normalizePathSegment(value: string): string {
  return value.replace(/^\/+|\/+$/g, '')
}
