import type { FilmDto } from '@/api/swapi/resources/films/films.dto'
import type { Film } from '@/api/swapi/resources/films/films.model'
import {
  extractSwapiId,
  extractSwapiIds,
  toMandatoryString,
  toOptionalDate,
  toOptionalString,
  toRomanNumber,
} from '@/api/swapi/shared/utils/mapping'

export function mapFilmDtoToModel(dto: FilmDto): Film {
  const filmId = extractSwapiId(dto.url)

  return {
    id: filmId,
    characterIds: extractSwapiIds(dto.characters),
    director: toOptionalString(dto.director),
    episodeId: toOptionalString(toRomanNumber(dto.episode_id)),
    openingCrawl: toOptionalString(dto.opening_crawl),
    planetIds: extractSwapiIds(dto.planets),
    producer: toOptionalString(dto.producer),
    releaseDate: toOptionalDate(dto.release_date),
    speciesIds: extractSwapiIds(dto.species),
    starshipIds: extractSwapiIds(dto.starships),
    title: toMandatoryString(dto.title, 'title'),
    vehicleIds: extractSwapiIds(dto.vehicles),
    images: createMockFilmImages(filmId),
  }
}

function createMockFilmImages(filmId: string): string[] {
  return [
    `https://picsum.photos/seed/swapi-film-${filmId}-1/1280/720`,
    `https://picsum.photos/seed/swapi-film-${filmId}-2/1280/720`,
    `https://picsum.photos/seed/swapi-film-${filmId}-3/1280/720`,
  ]
}
