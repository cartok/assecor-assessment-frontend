import type { SwapiResource } from '@/api/swapi/shared/types/model'

/**
 * A Star Wars film
 */
export interface Film extends SwapiResource {
  /**
   * The people resource URLs featured within this film.
   */
  readonly characters: string[]
  /**
   * The director of this film.
   */
  readonly director: string
  /**
   * the ISO 8601 date format of the time that this resource was edited.
   */
  readonly edited: Date
  /**
   * The episode number of this film.
   */
  readonly episodeId: number
  /**
   * The opening crawl text at the beginning of this film.
   */
  readonly openingCrawl: string
  /**
   * The planet resource URLs featured within this film.
   */
  readonly planets: string[]
  /**
   * The producer(s) of this film.
   */
  readonly producer: string
  /**
   * The release date at original creator country.
   */
  readonly releaseDate: Date
  /**
   * The species resource URLs featured within this film.
   */
  readonly species: string[]
  /**
   * The starship resource URLs featured within this film.
   */
  readonly starships: string[]
  /**
   * The title of this film.
   */
  readonly title: string
  /**
   * The vehicle resource URLs featured within this film.
   */
  readonly vehicles: string[]
}
