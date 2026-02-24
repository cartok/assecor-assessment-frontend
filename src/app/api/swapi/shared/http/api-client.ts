// TODO: Eine singleton klasse aus den inhalten hier machen, das ist zu wüst.

export const SWAPI_API_BASE_URL = 'https://swapi.dev/api'

export function swapiResourceCollectionUrl(resourcePath: string): string {
  return swapiUrl(normalizePathSegment(resourcePath))
}

export function swapiResourceDetailUrl(resourcePath: string, id: string): string {
  const detailUrl = swapiResourceDetailUrlOptional(resourcePath, id)

  if (detailUrl === undefined) {
    throw new Error(
      `Invalid detail url params: resourcePath="${resourcePath}", id="${id}"`,
    )
  }

  return detailUrl
}

export function swapiResourceDetailUrlOptional(
  resourcePath: string,
  id: string | null | undefined,
): string | undefined {
  const normalizedResourcePath = normalizePathSegment(resourcePath)
  const normalizedId = normalizePathSegment(id ?? '')

  if (normalizedId.length === 0) {
    return undefined
  }

  return swapiUrl(normalizedResourcePath, normalizedId)
}

function swapiUrl(...pathSegments: string[]): string {
  const path = pathSegments
    .map((pathSegment) => normalizePathSegment(pathSegment))
    .join('/')

  return new URL(`${SWAPI_API_BASE_URL}/${path}`).toString()
}

function normalizePathSegment(value: string): string {
  return value.replace(/^\/+|\/+$/g, '')
}
