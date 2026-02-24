import type { SwapiResource } from '@/api/swapi/shared/types/model'

/**
 * A person within the Star Wars universe
 */
export interface Person extends SwapiResource {
  /**
   * The birth year of this person. BBY (Before the Battle of Yavin) or ABY (After the Battle
   * of Yavin).
   */
  readonly birthYear?: string
  /**
   * The eye color of this person.
   */
  readonly eyeColor?: string
  /**
   * The film resources URLs that this person has been in.
   */
  readonly films: string[]
  /**
   * The gender of this person (if known).
   */
  readonly gender?: string
  /**
   * The hair color of this person.
   */
  readonly hairColor?: string
  /**
   * The height of this person in meters.
   */
  readonly height?: string
  /**
   * The URL of the planet resource that this person was born on.
   */
  readonly homeworld?: string
  /**
   * The mass of this person in kilograms.
   */
  readonly mass?: string
  /**
   * The name of this person.
   */
  readonly name: string
  /**
   * The skin color of this person.
   */
  readonly skinColor?: string
  /**
   * The species resource URLs of that this person is.
   */
  readonly species: string[]
  /**
   * The starship resource URLs that this person has piloted
   */
  readonly starships: string[]
  /**
   * The vehicle resource URLs that this person has piloted
   */
  readonly vehicles: string[]
}
