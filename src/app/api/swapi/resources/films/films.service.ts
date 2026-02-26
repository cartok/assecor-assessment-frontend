import { httpResource } from '@angular/common/http'
import { computed, Injectable, type ResourceStatus, type Signal } from '@angular/core'

import type { FilmDto } from '@/api/swapi/resources/films/films.dto'
import { mapFilmDtoToModel } from '@/api/swapi/resources/films/films.mapper'
import type { Film } from '@/api/swapi/resources/films/films.model'
import { swapiUrl } from '@/api/swapi/shared/http/api-client'
import {
  MINIMAL_HTTP_RETRY_POLICY,
  type RetryableHttpResourceMethodOptions,
  retryableHttpResourceRequest,
} from '@/api/swapi/shared/http/http-retry.interceptor'
import type { SwapiResourceCollectionDto } from '@/api/swapi/shared/types/dto'
import type { SwapiResourceCollection } from '@/api/swapi/shared/types/model'
import { extractSwapiIdOptional } from '@/api/swapi/shared/utils/mapping'

interface SwapiServiceResult<T> {
  status: Signal<ResourceStatus>
  data: Signal<T>
  errors: Signal<Error[] | undefined>
  reload: () => boolean
}

interface FilmCacheEntry {
  resource?: SwapiServiceResult<Film | undefined>
  item?: Film
  expiresAt: number
}

@Injectable({
  providedIn: 'root',
})
export class FilmsService {
  private readonly resourcePath = 'films'
  private readonly itemCacheTtlMs = 5 * 60 * 1000
  private readonly itemCache = new Map<string, FilmCacheEntry>()

  getCollection(
    page: Signal<string>,
    options?: RetryableHttpResourceMethodOptions,
  ): SwapiServiceResult<SwapiResourceCollection<Film>> {
    const resource = httpResource<SwapiResourceCollectionDto<FilmDto>>(
      retryableHttpResourceRequest(
        () => swapiUrl([this.resourcePath], { page: page() }),
        options?.retryPolicy,
      ),
    )
    const data = computed<SwapiResourceCollection<Film>>(() => {
      if (!resource.hasValue()) {
        return { items: [] }
      }

      const response = resource.value()
      const items: Film[] = []

      for (const dto of response.results ?? []) {
        try {
          const item = mapFilmDtoToModel(dto)
          items.push(item)
          this.setCacheEntry(item.id, { item })
        } catch {
          // skip invalid items in collection responses
        }
      }

      return {
        count: response.count,
        next: extractSwapiIdOptional(response.next),
        previous: extractSwapiIdOptional(response.previous),
        items,
      }
    })

    return {
      data,
      status: resource.status,
      errors: computed<Error[] | undefined>(() => {
        const currentError = resource.error()
        if (currentError === undefined) {
          return undefined
        }

        return [currentError]
      }),
      reload: () => resource.reload(),
    }
  }

  getItem(
    id: Signal<string>,
    options?: RetryableHttpResourceMethodOptions,
  ): SwapiServiceResult<Film | undefined> {
    const resource = httpResource<Film>(
      retryableHttpResourceRequest(
        () => swapiUrl([this.resourcePath, id()]),
        options?.retryPolicy,
      ),
      {
        parse: (value: unknown): Film => mapFilmDtoToModel(value as FilmDto),
      },
    )
    const data = computed<Film | undefined>(() => {
      const item = resource.value()
      if (item !== undefined) {
        this.setCacheEntry(item.id, { item })

        return item
      }

      return this.getCachedItem(id())
    })

    return {
      data,
      status: resource.status,
      errors: computed<Error[] | undefined>(() => {
        const currentError = resource.error()
        if (currentError === undefined) {
          return undefined
        }

        return [currentError]
      }),
      reload: () => resource.reload(),
    }
  }

  getItems(
    ids: Signal<string[]>,
    options?: RetryableHttpResourceMethodOptions,
  ): SwapiServiceResult<Film[]> {
    const getOrCreateResource = (id: string): SwapiServiceResult<Film | undefined> => {
      const currentTime = Date.now()
      const cachedEntry = this.itemCache.get(id)
      if (cachedEntry?.resource !== undefined) {
        if (cachedEntry.expiresAt > currentTime) {
          return cachedEntry.resource
        }

        cachedEntry.resource.reload()
        this.setCacheEntry(id, { resource: cachedEntry.resource })

        return cachedEntry.resource
      }

      const newResource = this.getItem(
        computed(() => id),
        {
          ...options,
          retryPolicy: {
            ...MINIMAL_HTTP_RETRY_POLICY,
            ...options?.retryPolicy,
          },
        },
      )
      this.setCacheEntry(id, { resource: newResource })

      return newResource
    }

    const resources = computed<SwapiServiceResult<Film | undefined>[]>(() => {
      return ids().map((id) => getOrCreateResource(id))
    })

    const data = computed<Film[]>(() => {
      const items: Film[] = []
      for (const id of ids()) {
        const item = getOrCreateResource(id).data()
        if (item !== undefined) {
          items.push(item)
        }
      }

      return items
    })

    const status = computed<ResourceStatus>(() => {
      const currentResources = resources()
      if (currentResources === undefined) {
        return 'idle'
      }

      if (currentResources.length === 0) {
        return 'resolved'
      }

      let hasLoading = false
      let hasReloading = false
      for (const resource of currentResources) {
        const resourceStatus = resource.status()
        if (resourceStatus === 'error') {
          return 'error'
        }

        if (resourceStatus === 'loading') {
          hasLoading = true
        }

        if (resourceStatus === 'reloading') {
          hasReloading = true
        }
      }

      if (hasLoading) {
        return 'loading'
      }

      if (hasReloading) {
        return 'reloading'
      }

      return 'resolved'
    })

    const errors = computed<Error[] | undefined>(() => {
      const currentResources = resources()
      if (currentResources === undefined) {
        return undefined
      }

      const currentErrors: Error[] = []
      for (const resource of currentResources) {
        const itemErrors = resource.errors()
        if (itemErrors !== undefined) {
          currentErrors.push(...itemErrors)
        }
      }

      if (currentErrors.length === 0) {
        return undefined
      }

      return currentErrors
    })

    return {
      data,
      status,
      errors,
      reload: () => {
        const currentResources = resources()
        if (currentResources === undefined) {
          return false
        }

        let hasReloaded = false
        for (const id of new Set(ids())) {
          hasReloaded = getOrCreateResource(id).reload() || hasReloaded
        }

        return hasReloaded
      },
    }
  }

  private setCacheEntry(id: string, entry: Omit<FilmCacheEntry, 'expiresAt'>): void {
    const currentEntry = this.itemCache.get(id)
    this.itemCache.set(id, {
      ...currentEntry,
      ...entry,
      expiresAt: Date.now() + this.itemCacheTtlMs,
    })
  }

  private getCachedItem(id: string): Film | undefined {
    const currentEntry = this.itemCache.get(id)
    if (currentEntry?.item === undefined) {
      return undefined
    }

    if (currentEntry.expiresAt <= Date.now()) {
      if (currentEntry.resource === undefined) {
        this.itemCache.delete(id)
      }

      return undefined
    }

    return currentEntry.item
  }
}
