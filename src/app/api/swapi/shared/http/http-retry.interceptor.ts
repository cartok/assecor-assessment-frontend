import {
  HttpContext,
  HttpContextToken,
  HttpErrorResponse,
  type HttpHandlerFn,
  type HttpInterceptorFn,
  type HttpRequest,
  type HttpResourceRequest,
} from '@angular/common/http'
import { retry, timer } from 'rxjs'

export interface HttpRetryPolicy {
  enabled: boolean
  retryCount: number
  baseDelayMs: number
  maxDelayMs: number
}

const RETRYABLE_HTTP_METHODS = new Set<string>(['GET', 'HEAD'])

export const DEFAULT_HTTP_RETRY_POLICY: HttpRetryPolicy = {
  enabled: true,
  retryCount: 2,
  baseDelayMs: 150,
  maxDelayMs: 2_000,
}

export const CRITICAL_HTTP_RETRY_POLICY: HttpRetryPolicy = {
  enabled: true,
  retryCount: 5,
  baseDelayMs: 50,
  maxDelayMs: 5_000,
}

export const HTTP_RETRY_POLICY = new HttpContextToken<HttpRetryPolicy>(() => ({
  ...DEFAULT_HTTP_RETRY_POLICY,
}))

export const httpRetryInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn,
) => {
  if (!shouldRetryRequest(request)) {
    return next(request)
  }

  const retryPolicy = normalizeRetryPolicy(request.context.get(HTTP_RETRY_POLICY))
  if (!retryPolicy.enabled || retryPolicy.retryCount === 0) {
    return next(request)
  }

  return next(request).pipe(
    retry({
      count: retryPolicy.retryCount,
      delay: (error: unknown, retryAttempt: number) => {
        if (!isRetryableError(error)) {
          throw error
        }

        return timer(calculateDelayMs(retryAttempt, retryPolicy))
      },
    }),
  )
}

function shouldRetryRequest(request: HttpRequest<unknown>): boolean {
  return RETRYABLE_HTTP_METHODS.has(request.method.toUpperCase())
}

export function createHttpRetryPolicy(
  policy?: Partial<HttpRetryPolicy>,
): HttpRetryPolicy {
  return normalizeRetryPolicy({
    ...DEFAULT_HTTP_RETRY_POLICY,
    ...policy,
  })
}

export function retryableHttpResourceRequest(
  urlFactory: () => string | undefined,
  retryPolicy?: Partial<HttpRetryPolicy>,
): () => HttpResourceRequest | undefined {
  return () => {
    const url = urlFactory()
    if (url === undefined) {
      return undefined
    }

    if (retryPolicy === undefined) {
      return { url }
    }

    return {
      url,
      context: new HttpContext().set(
        HTTP_RETRY_POLICY,
        createHttpRetryPolicy(retryPolicy),
      ),
    }
  }
}

function normalizeRetryPolicy(policy: HttpRetryPolicy): HttpRetryPolicy {
  const retryCount = normalizeRetryCount(policy.retryCount)
  const baseDelayMs = normalizeDelayMs(policy.baseDelayMs)
  const maxDelayMs = Math.max(baseDelayMs, normalizeDelayMs(policy.maxDelayMs))

  return {
    enabled: policy.enabled,
    retryCount,
    baseDelayMs,
    maxDelayMs,
  }
}

function normalizeRetryCount(retryCount: number): number {
  if (!Number.isFinite(retryCount)) {
    return 0
  }

  return Math.max(0, Math.floor(retryCount))
}

function normalizeDelayMs(delayMs: number): number {
  if (!Number.isFinite(delayMs)) {
    return 0
  }

  return Math.max(0, Math.floor(delayMs))
}

function isRetryableError(error: unknown): boolean {
  if (!(error instanceof HttpErrorResponse)) {
    return false
  }

  if (isAbortError(error.error)) {
    return false
  }

  return isTransientStatusCode(error.status)
}

function isAbortError(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false
  }

  return error.name === 'AbortError'
}

function isTransientStatusCode(statusCode: number): boolean {
  return statusCode === 0 || statusCode === 408 || statusCode === 429 || statusCode >= 500
}

function calculateDelayMs(retryAttempt: number, retryPolicy: HttpRetryPolicy): number {
  const exponentialDelay = retryPolicy.baseDelayMs * 2 ** (retryAttempt - 1)
  const jitter = Math.floor(Math.random() * retryPolicy.baseDelayMs)

  return Math.min(retryPolicy.maxDelayMs, exponentialDelay + jitter)
}
