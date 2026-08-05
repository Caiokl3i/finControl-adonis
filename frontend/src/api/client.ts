import type { ApiErrorBody } from './types'

/**
 * Cliente HTTP mínimo para a API Adonis do finControl.
 * Rotas sem prefixo /api/v1 — proxy do Vite encaminha para :3333.
 */

const TOKEN_KEY = 'fluxo_token'

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string | null) {
  if (token) localStorage.setItem(TOKEN_KEY, token)
  else localStorage.removeItem(TOKEN_KEY)
}

export class ApiError extends Error {
  status: number
  body: ApiErrorBody

  constructor(status: number, body: ApiErrorBody) {
    super(body.message ?? `Erro HTTP ${status}`)
    this.status = status
    this.body = body
  }
}

type RequestOptions = {
  method?: string
  body?: unknown
  auth?: boolean
  query?: Record<string, string | number | undefined>
}

export async function api<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, auth = true, query } = options

  const headers: Record<string, string> = {
    Accept: 'application/json',
  }

  if (body !== undefined) {
    headers['Content-Type'] = 'application/json'
  }

  if (auth) {
    const token = getToken()
    if (token) headers.Authorization = `Bearer ${token}`
  }

  const url = new URL(path, window.location.origin)
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== '') {
        url.searchParams.set(key, String(value))
      }
    }
  }

  const response = await fetch(`${url.pathname}${url.search}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (response.status === 204) {
    return undefined as T
  }

  const text = await response.text()
  const data = text ? (JSON.parse(text) as unknown) : null

  if (!response.ok) {
    throw new ApiError(
      response.status,
      (data as ApiErrorBody) ?? { message: response.statusText },
    )
  }

  // serialize() do Adonis envolve em { data: ... }
  if (
    data &&
    typeof data === 'object' &&
    'data' in data &&
    Object.keys(data as object).length === 1
  ) {
    return (data as { data: T }).data
  }

  return data as T
}

/** Mensagem legível a partir do Vine/Adonis. */
export function formatApiError(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.body.errors?.length) {
      return error.body.errors.map((e) => e.message).join(' · ')
    }
    return error.message
  }
  if (error instanceof Error) return error.message
  return 'Algo deu errado'
}
