/**
 * Canvas A backend payload types. Mirrors the JSON shape returned by the
 * FastAPI service at canvasa.olympiz.ai (and canvasa.physolympiad.com).
 *
 * Kept in sync with `07_Physics_Olympiad/scripts/server.py` endpoints:
 *   GET  /api/inventory-counts
 *   GET  /api/library-topics
 *   GET  /api/problems-library
 *   GET  /api/brand/<tenant>
 *   POST /api/generate-lesson
 *   POST /api/generate-from-url
 *   POST /api/generate-from-pdf
 *   GET  /api/lesson-status/<session_id>
 *   GET  /api/wiki-opensearch?q=
 *   GET  /api/superstem-search?q=
 */

export type Lesson = {
  slug: string
  title: string
  url: string
  level: string
  cached: boolean
  mode2_cached?: boolean
  guide_cached?: boolean
}

export type Topic = {
  name: string
  icon: string
  lessons: Lesson[]
}

export type Problem = {
  slug: string
  po_id?: number
  origin?: string
  section?: string
  section_icon?: string
  difficulty?: string
  level?: string
  source?: string
  source_kind?: string
  title: string
  statement?: string
  cached?: boolean
  guide_cached?: boolean
}

export type ProblemSection = {
  name: string
  icon: string
  problems: Problem[]
}

export type InventoryCounts = {
  ok: boolean
  concepts_cached: number
  concepts_total: number
  concepts_imported: number
  problems_total: number
  problems_cached: number
  mode2_cached: number
  skills_total: number
  superstem_textbooks: number
  superstem_chapters: number
  physolympiad_problems: number
}

export type LibraryTopicsResponse = { ok: boolean; lesson_count: number; topics: Topic[] }
export type ProblemsLibraryResponse = { ok: boolean; total: number; cached_count: number; sections: ProblemSection[] }

export type GenerateLessonResponse = {
  session_id: string
  hello?: { id: string; text: string; audio_url?: string } | null
  status_url: string
  poll_interval_ms: number
  cached?: boolean
  ready_url?: string
}

export type LessonStatus = {
  status: string
  ready_url?: string
  error?: string
  progress?: string
  topic?: string
}

export type WikiSearchResult = {
  title: string
  description?: string
  desc?: string
  snippet?: string
  url?: string
  thumbnail?: string
  kind?: string
  subject?: string
}

export function searchResultBlurb(r: WikiSearchResult): string {
  return r.description || r.desc || r.snippet || ''
}
