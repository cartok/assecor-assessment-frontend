export function extractSwapiIds(value: unknown): string[] {
  if (!isStringArray(value)) {
    return []
  }

  const ids: string[] = []

  for (const url of value) {
    try {
      ids.push(extractSwapiId(url))
    } catch {
      // ignore invalid related resource urls in collections
    }
  }

  return ids
}

export function extractSwapiId(url: string): string {
  const trimmedUrl = url.trim()

  if (trimmedUrl.length === 0) {
    throw new Error('SWAPI id extraction failed: empty url')
  }

  const path = getPathFromUrl(trimmedUrl)
  const match = path.match(/\/(\d+)\/?$/)
  const id = match?.[1]

  if (id === undefined) {
    throw new Error(`SWAPI id extraction failed for url: ${url}`)
  }

  return id
}

export function extractSwapiIdOptional(url: unknown): string | undefined {
  const value = toOptionalString(url)

  if (value === undefined) {
    return undefined
  }

  try {
    return extractSwapiId(value)
  } catch {
    return undefined
  }
}

export function toOptionalString(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined
}

export function toUndefinedIfNullish<T>(value: T | null | undefined): T | undefined {
  return value ?? undefined
}

export function toMandatoryString(value: unknown, fieldName: string): string {
  if (typeof value === 'string') {
    return value
  }

  throw new Error(`Mandatory string field "${fieldName}" is missing`)
}

export function toOptionalNumber(value: unknown): number | undefined {
  return typeof value === 'number' ? value : undefined
}

export function toOptionalDate(value: unknown): Date | undefined {
  if (typeof value !== 'string') {
    return undefined
  }

  const parsedDate = new Date(value)
  return Number.isNaN(parsedDate.valueOf()) ? undefined : parsedDate
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string')
}

function getPathFromUrl(url: string): string {
  try {
    return new URL(url).pathname
  } catch {
    return url.split('?')[0]?.split('#')[0] ?? url
  }
}
