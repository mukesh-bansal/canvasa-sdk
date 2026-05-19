/**
 * Canvas A API client — pure fetch, no axios. Single shared instance
 * configured by `setApiConfig({ host, tenant })`. Each `<canvasa-tutor>`
 * element re-runs config on mount via its `tenant` attribute.
 *
 * Why fetch over axios:
 *   - Native browser API, zero deps, smaller bundle (~5 KB saved gzipped)
 *   - Hosts already include fetch — no risk of conflict with their axios
 *   - File uploads use FormData (same as axios)
 *
 * Error handling: each endpoint throws an Error with the response status
 * if not OK; the element catches + fires `canvasa-error`.
 */

import type {
  InventoryCounts,
  LibraryTopicsResponse,
  ProblemsLibraryResponse,
  GenerateLessonResponse,
  LessonStatus,
  WikiSearchResult,
} from './types'

let _host = 'https://canvasa.olympiz.ai'
let _tenant = 'default'

export function setApiConfig(opts: { host?: string; tenant?: string }): void {
  if (opts.host) _host = opts.host.replace(/\/$/, '')
  if (opts.tenant) _tenant = opts.tenant
}

export function getApiHost(): string { return _host }
export function getApiTenant(): string { return _tenant }

function url(path: string, params?: Record<string, string | number | undefined>): string {
  const u = new URL(`${_host}/api${path}`)
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null && v !== '') u.searchParams.set(k, String(v))
    }
  }
  return u.toString()
}

async function getJSON<T>(path: string, params?: Record<string, string | number | undefined>): Promise<T> {
  const r = await fetch(url(path, params), {
    headers: { 'X-Tutor-Tenant': _tenant, 'Accept': 'application/json' },
    credentials: 'omit',
  })
  if (!r.ok) throw new Error(`canvasa-api ${path} HTTP ${r.status}`)
  return (await r.json()) as T
}

async function postJSON<T>(path: string, body: unknown): Promise<T> {
  const r = await fetch(url(path), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Tutor-Tenant': _tenant,
      'Accept': 'application/json',
    },
    body: JSON.stringify(body),
    credentials: 'omit',
  })
  if (!r.ok) throw new Error(`canvasa-api ${path} HTTP ${r.status}`)
  return (await r.json()) as T
}

async function postMultipart<T>(path: string, fd: FormData): Promise<T> {
  const r = await fetch(url(path), {
    method: 'POST',
    headers: { 'X-Tutor-Tenant': _tenant, 'Accept': 'application/json' },
    body: fd,
    credentials: 'omit',
  })
  if (!r.ok) throw new Error(`canvasa-api ${path} HTTP ${r.status}`)
  return (await r.json()) as T
}

export const canvasaApi = {
  inventoryCounts: () => getJSON<InventoryCounts>('/inventory-counts'),
  libraryTopics:   () => getJSON<LibraryTopicsResponse>('/library-topics'),
  problemsLibrary: () => getJSON<ProblemsLibraryResponse>('/problems-library'),

  generateLesson:  (topic: string) => postJSON<GenerateLessonResponse>('/generate-lesson', { topic }),
  generateFromUrl: (urlIn: string, title?: string) =>
    postJSON<GenerateLessonResponse>('/generate-from-url', { url: urlIn, title }),
  generateFromPdf: (file: File) => {
    const fd = new FormData()
    fd.append('file', file)
    return postMultipart<GenerateLessonResponse>('/generate-from-pdf', fd)
  },

  lessonStatus:    (sessionId: string) => getJSON<LessonStatus>(`/lesson-status/${encodeURIComponent(sessionId)}`),

  wikiSearch:      (q: string) => getJSON<{ results: WikiSearchResult[] }>('/wiki-opensearch', { q }),
  superstemSearch: (q: string) => getJSON<{ results: WikiSearchResult[] }>('/superstem-search', { q }),

  // Phase 3 endpoint — graceful fallback handled in canvasa-tutor.ts when missing
  brand: <T = unknown>(tenant: string) => getJSON<T>(`/brand/${encodeURIComponent(tenant)}`),
}

export type CanvasaApi = typeof canvasaApi
