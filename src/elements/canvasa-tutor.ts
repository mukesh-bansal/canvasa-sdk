/**
 * <canvasa-tutor> — Canvas A AI Tutor landing as a custom element.
 *
 * Phase 2 (this file): full landing UI ported from canvasa-tutor-react
 * v0.1.7 — hero + 3 tabs + Concept library + Problems + lazy-render per
 * section + pagination + KaTeX on visible page + mode picker modal
 * (teach-me / guide-me).
 *
 * Architecture notes:
 *   - Light DOM rendering (no shadow root) so host CSS reaches the tree
 *     naturally. All internal classes namespaced `tutor-` (from upstream
 *     canvasa-tutor-react CSS) to avoid host collisions.
 *   - CSS injected via a <style> tag inside the element, scoped by an
 *     attribute selector so multiple <canvasa-tutor> instances don't
 *     duplicate styles. Sub-DOM still inherits CSS variables from host.
 *   - Lazy-render: section headers render on mount; rows render on
 *     expand. KaTeX runs only on the visible page's rows. Re-rendering
 *     swaps in place to keep DOM at ~30 visible rows max.
 *
 * See README.md for the public contract (attributes, events, slots,
 * CSS variables, programmatic API).
 */

import { CANVASA_SDK_VERSION } from '../version'
import { canvasaApi, setApiConfig } from '../services/api'
import type {
  Lesson, Problem, InventoryCounts,
  LibraryTopicHeader, ProblemsLibraryHeader,
  WikiSearchResult,
} from '../services/types'
import tutorCss from '../styles/tutor.css?inline'

// ───────────────────────────────────────────────────────────────────
// Types & constants
// ───────────────────────────────────────────────────────────────────

export type CanvasaTutorTab = 'ondemand' | 'concepts' | 'problems'
export type CanvasaLessonMode = 'teach' | 'guide' | 'picker'
export type SourceKind = 'internal' | 'external'
export type ConceptLevel = 'all' | 'HS' | 'UG' | 'G'
export type ProbChip = 'all' | 'HS' | 'UG' | 'G' | 'Olympiad' | 'cached'

const PAGE_SIZE = 30

export interface BrandConfig {
  tenant: string
  tokens?: Record<string, string>
  copy?: {
    heroTitle?: string
    heroSub?: string
    ctaLabel?: string
    emptyState?: string
    placeholderTopic?: string
    tabs?: Partial<Record<CanvasaTutorTab, string>>
  }
  mark?: { url?: string; svg?: string; alt?: string }
  view?: {
    tabs?: CanvasaTutorTab[]
    defaultTab?: CanvasaTutorTab
    defaultFilters?: Record<string, unknown>
  }
  redirectsTo?: string
  deprecated?: boolean
  // canvas-a backend versions echoed back by /api/brand for diagnostic
  // display in the SDK pill. NOT consumed for any behavior — purely UX.
  olympiz_version?: string
  canvas_a_version?: string
}

export interface CanvasaTutorEventMap {
  'canvasa-ready':         CustomEvent<{ version: string; tenant: string }>
  'canvasa-tab-change':    CustomEvent<{ tab: CanvasaTutorTab }>
  'canvasa-lesson-click':  CustomEvent<{ slug: string; title: string; cached: boolean; mode: CanvasaLessonMode; source: string }>
  'canvasa-launch':        CustomEvent<{ kind: 'ask' | 'lesson'; payload: Record<string, unknown> }>
  'canvasa-error':         CustomEvent<{ code: string; message: string; cause?: unknown }>
}

function getCanvasaHost(): string {
  if (typeof window !== 'undefined' && (window as any).CANVASA_HOST) return (window as any).CANVASA_HOST as string
  return 'https://canvasa.olympiz.ai'
}

let _stylesInjected = false
function ensureGlobalStyles(): void {
  if (_stylesInjected) return
  if (typeof document === 'undefined') return
  const id = 'canvasa-sdk-styles'
  if (document.getElementById(id)) { _stylesInjected = true; return }
  const style = document.createElement('style')
  style.id = id
  style.textContent = tutorCss
  document.head.appendChild(style)
  _stylesInjected = true
}

function escapeHtml(s: string | null | undefined): string {
  if (s == null) return ''
  return String(s).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c] as string))
}

function escapeAttr(s: string | null | undefined): string {
  return escapeHtml(s).replace(/`/g, '&#96;')
}

// KaTeX — single global instance, lazy-loaded from CDN or window-global.
type RenderMathInElement = (el: HTMLElement, opts: unknown) => void
let _katex: RenderMathInElement | null = null
let _katexLoading: Promise<RenderMathInElement | null> | null = null

async function ensureKatex(cdnAttr: string | null): Promise<RenderMathInElement | null> {
  if (cdnAttr === 'off') return null
  if (_katex) return _katex
  if (typeof window === 'undefined') return null
  // 1) window.renderMathInElement from a host <script> tag (preferred)
  if (typeof (window as any).renderMathInElement === 'function') {
    _katex = (window as any).renderMathInElement as RenderMathInElement
    return _katex
  }
  if (_katexLoading) return _katexLoading
  const cdnBase = cdnAttr || 'https://cdn.jsdelivr.net/npm/katex@0.16.10/dist'
  _katexLoading = (async () => {
    try {
      // Load CSS once
      if (!document.querySelector(`link[href^="${cdnBase}/katex.min.css"]`)) {
        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = `${cdnBase}/katex.min.css`
        link.crossOrigin = 'anonymous'
        document.head.appendChild(link)
      }
      // Load core + auto-render
      await loadScript(`${cdnBase}/katex.min.js`)
      await loadScript(`${cdnBase}/contrib/auto-render.min.js`)
      // Poll briefly for the global to land
      for (let i = 0; i < 30; i++) {
        if (typeof (window as any).renderMathInElement === 'function') {
          _katex = (window as any).renderMathInElement as RenderMathInElement
          return _katex
        }
        await new Promise((r) => setTimeout(r, 100))
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('[canvasa-sdk] KaTeX load failed; raw $...$ will show', e)
    }
    return null
  })()
  return _katexLoading
}

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve()
    const s = document.createElement('script')
    s.src = src; s.async = true; s.crossOrigin = 'anonymous'
    s.onload = () => resolve(); s.onerror = (e) => reject(e)
    document.head.appendChild(s)
  })
}

function renderMathInChildren(root: HTMLElement, render: RenderMathInElement | null): void {
  if (!render) return
  try {
    render(root, {
      delimiters: [
        { left: '$$', right: '$$', display: true },
        { left: '$', right: '$', display: false },
        { left: '\\(', right: '\\)', display: false },
        { left: '\\[', right: '\\]', display: true },
      ],
      throwOnError: false,
      // 'button' intentionally NOT in ignoredTags — problem statements
      // live inside clickable <button>s and the math must render there.
      ignoredTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code'],
    })
  } catch { /* noop */ }
}

// ───────────────────────────────────────────────────────────────────
// Element
// ───────────────────────────────────────────────────────────────────

export class CanvasaTutorElement extends HTMLElement {
  static readonly observedAttributes = [
    'tenant', 'mode', 'default-tab', 'hide-tabs', 'lesson', 'ask',
    'problem-id', 'lesson-target', 'lesson-mode', 'katex-cdn', 'debug',
  ] as const

  private _brand: BrandConfig | null = null
  private _ready = false
  private _tab: CanvasaTutorTab = 'ondemand'
  private _topic = ''
  private _conceptQuery = ''
  private _conceptLevel: ConceptLevel = 'all'
  private _probQuery = ''
  private _probChip: ProbChip = 'all'
  // Phase 8: header-only data + lazily-fetched per-section caches.
  // _topicHeaders is fetched once on Concept-library tab mount (~1 KB).
  // _topicSectionCache holds [name] -> last fetched page for that section.
  // When level/query filters change, the per-section cache is cleared so
  // the next render re-fetches from the server with the new filter args.
  private _topicHeaders: LibraryTopicHeader[] = []
  private _topicSectionCache: Map<string, {
    lessons: Lesson[]; total: number; offset: number; limit: number;
    level: ConceptLevel; q: string;
  }> = new Map()
  private _problemHeaders: ProblemsLibraryHeader[] = []
  private _problemSectionCache: Map<string, {
    problems: Problem[]; total: number; offset: number; limit: number;
    chip: ProbChip; q: string;
  }> = new Map()
  private _counts: InventoryCounts | null = null
  private _busy = false
  private _busyMsg = ''
  private _errorMsg = ''
  private _abort?: AbortController
  private _expanded: Map<string, boolean> = new Map()
  private _pageState: Map<string, number> = new Map()

  // ── Lifecycle ───────────────────────────────────────────────────

  connectedCallback(): void {
    ensureGlobalStyles()
    this.classList.add('canvasa-tutor', 'tutor-root', 'tutor-page')
    setApiConfig({ host: getCanvasaHost(), tenant: this._tenant() })

    // Tab persistence — the user's return URL should land them on the same
    // tab they launched the lesson from. Priority order:
    //   1. URL hash  (#tab=concepts) — set by the SDK before any launch so
    //      ?return=<host-url>#tab=concepts round-trips on Back
    //   2. sessionStorage  ('canvasa:active-tab') — fallback within the same
    //      session if the host strips the hash
    //   3. default-tab attribute
    //   4. 'ondemand'
    const hashTab = this._readTabFromHash()
    const storedTab = (() => {
      try { return (window.sessionStorage.getItem('canvasa:active-tab') || '') as CanvasaTutorTab } catch { return '' as CanvasaTutorTab }
    })()
    const defaultTab = (this.getAttribute('default-tab') as CanvasaTutorTab) || 'ondemand'
    const validTabs: CanvasaTutorTab[] = ['ondemand', 'concepts', 'problems']
    this._tab = (validTabs.includes(hashTab as CanvasaTutorTab) ? hashTab :
                 validTabs.includes(storedTab as CanvasaTutorTab) ? storedTab :
                 defaultTab) as CanvasaTutorTab
    // Write the resolved tab back to hash + sessionStorage so the
    // ?return=window.location.href round-trip captured at launch time
    // already reflects the active tab.
    this._writeTabState(this._tab)

    // Deep-link: if `lesson` or `ask` is on the element, launch immediately
    const lessonSlug = this.getAttribute('lesson')
    const ask = this.getAttribute('ask')
    if (lessonSlug) {
      const mode = (this.getAttribute('lesson-mode') as CanvasaLessonMode) || 'teach'
      this._launch('lesson', { lesson: lessonSlug, mode })
    } else if (ask) {
      const mode = (this.getAttribute('lesson-mode') as CanvasaLessonMode) || 'teach'
      this._launch('ask', { ask, mode })
    }

    this._render()
    void this._bootstrap()
  }

  disconnectedCallback(): void {
    this._abort?.abort()
  }

  attributeChangedCallback(name: string, oldVal: string | null, newVal: string | null): void {
    if (!this.isConnected || oldVal === newVal) return
    if (name === 'tenant') {
      setApiConfig({ tenant: this._tenant() })
      void this._bootstrap()
    } else if (name === 'default-tab' && newVal) {
      this._tab = newVal as CanvasaTutorTab
      this._render()
    } else {
      this._render()
    }
  }

  // ── Programmatic API ────────────────────────────────────────────

  setTenant(tenant: string): void { this.setAttribute('tenant', tenant) }
  setTab(tab: CanvasaTutorTab): void {
    this._tab = tab
    // Persist in URL hash + sessionStorage so Back from chalkboard restores
    // this tab (return-URL round-trip includes the hash).
    this._writeTabState(tab)
    this._render()
    this._fireTab()
  }

  private _readTabFromHash(): string {
    if (typeof window === 'undefined' || !window.location) return ''
    const h = window.location.hash || ''
    const m = h.match(/(?:^|[#&])tab=([a-z]+)/i)
    return m ? m[1].toLowerCase() : ''
  }

  private _writeTabState(tab: CanvasaTutorTab): void {
    if (typeof window === 'undefined') return
    try { window.sessionStorage.setItem('canvasa:active-tab', tab) } catch { /* ignore */ }
    if (window.location && window.history && window.history.replaceState) {
      try {
        const u = new URL(window.location.href)
        // Preserve other hash params if any (e.g. #tab=concepts&foo=bar)
        const existing = (u.hash || '').replace(/^#/, '')
        const parts = existing.split('&').filter(p => p && !/^tab=/.test(p))
        parts.push(`tab=${tab}`)
        u.hash = parts.join('&')
        window.history.replaceState(null, '', u.toString())
      } catch { /* ignore */ }
    }
  }
  launchAsk(topic: string, opts?: { mode?: CanvasaLessonMode }): void {
    this._launch('ask', { ask: topic, mode: opts?.mode ?? 'teach' })
  }
  launchLesson(slug: string, opts?: { mode?: CanvasaLessonMode }): void {
    this._launch('lesson', { lesson: slug, mode: opts?.mode ?? 'teach' })
  }
  getBrandConfig(): BrandConfig | null { return this._brand }
  async refresh(): Promise<void> { await this._bootstrap() }

  // ── Bootstrap (brand + counts) ──────────────────────────────────

  private async _bootstrap(): Promise<void> {
    await Promise.all([this._loadBrand(), this._loadCounts()])
    this._applyBrandTokens()
    this._render()
    this._markReady()
  }

  private async _loadBrand(): Promise<void> {
    const tenant = this._tenant()
    try {
      this._brand = await canvasaApi.brand<BrandConfig>(tenant)
    } catch (cause) {
      this._brand = { tenant, tokens: {}, copy: {}, mark: {} }
      this._fireError('brand-config-fetch-failed', String(cause), cause)
    }
  }

  private async _loadCounts(): Promise<void> {
    try { this._counts = await canvasaApi.inventoryCounts() }
    catch (cause) { this._fireError('inventory-counts-failed', String(cause), cause) }
  }

  private _applyBrandTokens(): void {
    const t = this._brand?.tokens
    if (!t) return
    const map: Record<string, string> = {
      accent: '--tutor-accent',
      accentHover: '--tutor-accent-strong',
      bg: '--tutor-bg',
      surface: '--tutor-surface',
      text: '--tutor-text',
      muted: '--tutor-muted',
      line: '--tutor-border',
      radius: '--tutor-radius',
      fontHead: '--tutor-font-display',
      fontBody: '--tutor-font-body',
      fontMono: '--tutor-font-mono',
    }
    for (const [k, v] of Object.entries(t)) {
      const cssVar = map[k] ?? `--tutor-${k}`
      if (typeof v === 'string') this.style.setProperty(cssVar, v)
    }
  }

  // ── Render dispatch ─────────────────────────────────────────────

  private _tenant(): string { return this.getAttribute('tenant') || 'default' }
  private _debug(): boolean { return this.getAttribute('debug') === '1' }

  private _slotText(slotName: string): string | null {
    const el = this.querySelector(`[slot="${CSS.escape(slotName)}"]`)
    return el?.textContent?.trim() || null
  }

  private _render(): void {
    const copy = this._brand?.copy ?? {}
    const heroTitle = this._slotText('hero-title') ?? copy.heroTitle ?? 'What do you want to <em>learn</em> today?'
    const heroSub = this._slotText('hero-sub') ?? copy.heroSub ?? 'Drop a question.'
    const hideTabs = (this.getAttribute('hide-tabs') || '').split(',').map((s) => s.trim()).filter(Boolean)
    const tabs: CanvasaTutorTab[] = (['ondemand', 'concepts', 'problems'] as CanvasaTutorTab[])
      .filter((t) => !hideTabs.includes(t))
    const tabLabels: Record<CanvasaTutorTab, string> = {
      ondemand: copy.tabs?.ondemand ?? 'On-demand',
      concepts: copy.tabs?.concepts ?? 'Concept library',
      problems: copy.tabs?.problems ?? 'Problems',
    }
    const tabCounts: Record<CanvasaTutorTab, string> = {
      ondemand: '5 ways',
      concepts: this._counts ? String(this._counts.concepts_total) : '',
      problems: this._counts ? String(this._counts.problems_total) : '',
    }

    // Version pill — shows SDK version + canvas-a backend version (from
    // /api/version, fetched on mount into this._counts). Lets the user
    // verify which build is live without digging into the script tag.
    const backendVer = this._brand?.canvas_a_version || this._brand?.olympiz_version || ''
    const pillText = backendVer ? `SDK ${CANVASA_SDK_VERSION} · srv ${backendVer}` : `SDK ${CANVASA_SDK_VERSION}`
    this.innerHTML = `
      <div class="canvasa-tutor__pill" title="Canvas A SDK ${CANVASA_SDK_VERSION}${backendVer ? ` · canvas-a backend ${backendVer}` : ''}">${escapeHtml(pillText)}</div>
      <section class="tutor-hero">
        <h1>${heroTitle}</h1>
        <p>${escapeHtml(heroSub)}</p>
      </section>
      <nav class="tutor-tabs" role="tablist">
        ${tabs.map((t) => `
          <button type="button" role="tab" aria-selected="${t === this._tab}"
                  data-canvasa-tab="${t}"
                  class="tutor-tab${t === this._tab ? ' is-active' : ''}">
            ${escapeHtml(tabLabels[t])}
            ${tabCounts[t] ? `<span class="tutor-tab__count">${escapeHtml(tabCounts[t])}</span>` : ''}
          </button>`).join('')}
      </nav>
      <div data-canvasa-tabpanel="${this._tab}" class="canvasa-tutor__panel"></div>
      <div class="canvasa-tutor__footer">
        <slot name="footer"></slot>
      </div>
    `

    // Wire tab buttons
    this.querySelectorAll<HTMLButtonElement>('[data-canvasa-tab]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const t = btn.dataset.canvasaTab as CanvasaTutorTab
        this.setTab(t)
      })
    })

    // Inject version pill style if not already
    this._injectPillStyle()

    // Render active tab
    const panel = this.querySelector<HTMLElement>('.canvasa-tutor__panel')
    if (!panel) return
    if (this._tab === 'ondemand') this._renderOnDemand(panel)
    else if (this._tab === 'concepts') void this._renderConcepts(panel)
    else if (this._tab === 'problems') void this._renderProblems(panel)
  }

  private _injectPillStyle(): void {
    const id = 'canvasa-tutor-pill-style'
    if (document.getElementById(id)) return
    const style = document.createElement('style')
    style.id = id
    style.textContent = `
      .canvasa-tutor__pill {
        position: fixed; top: 12px; right: 60px; z-index: 99999;
        font-family: 'JetBrains Mono', ui-monospace, monospace;
        font-size: 11px; font-weight: 600; letter-spacing: 0.08em;
        padding: 5px 11px; border-radius: 999px;
        background: #14213D; color: #e8c970; border: 1px solid #C9A227;
        box-shadow: 0 2px 8px rgba(20,33,61,0.30);
        pointer-events: auto; user-select: none;
      }
      .canvasa-tutor__panel { margin-top: 24px; }
      .canvasa-tutor__footer { margin-top: 32px; }
      .tutor-pag { display: flex; align-items: center; justify-content: center; gap: 14px; padding: 10px 0 4px; font-family: var(--tutor-font-mono, 'JetBrains Mono', monospace); font-size: 11px; color: var(--tutor-muted, #5a7c92); }
      .tutor-pag button { background: transparent; border: 1px solid var(--tutor-border, rgba(26,58,82,0.18)); border-radius: 5px; padding: 4px 10px; cursor: pointer; color: var(--tutor-muted, #5a7c92); font: inherit; }
      .tutor-pag button:disabled { opacity: 0.35; cursor: default; }
      .tutor-empty { padding: 18px 4px; color: var(--tutor-muted, #79a0bb); font-size: 12.5px; }
      .tutor-section__sub { color: var(--tutor-muted, #5a7c92); font-size: 12.5px; margin-bottom: 8px; }
      .tutor-row { display: flex; gap: 12px; align-items: center; margin-bottom: 12px; }
      .tutor-input { flex: 1; padding: 12px 14px; border: 1px solid var(--tutor-border, #e7ecf3); border-radius: var(--tutor-radius-sm, 8px); font: inherit; background: var(--tutor-surface, #fff); color: var(--tutor-text); }
      .tutor-input--sm { padding: 10px 12px; font-size: 13px; }
      .tutor-btn { padding: 12px 18px; background: var(--tutor-primary, #14213d); color: var(--tutor-on-primary, #fff); border: none; border-radius: var(--tutor-radius-sm, 8px); cursor: pointer; font: inherit; font-weight: 600; }
      .tutor-btn:hover { background: var(--tutor-primary-hover, #0a162b); }
      .tutor-btn:disabled { opacity: 0.5; cursor: default; }
      .tutor-status { padding: 8px 12px; font-size: 12.5px; color: var(--tutor-muted, #5a7c92); margin-top: 8px; }
      .tutor-status--error { color: var(--tutor-danger, #b91c1c); }
      .tutor-mode-modal { position: fixed; inset: 0; background: rgba(20,33,61,0.55); z-index: 99998; display: flex; align-items: center; justify-content: center; }
      .tutor-mode-modal__card { background: var(--tutor-surface, #fff); padding: 28px 28px 22px; max-width: 440px; width: 92vw; border-radius: var(--tutor-radius, 12px); box-shadow: var(--tutor-shadow, 0 14px 40px rgba(0,0,0,0.18)); }
      .tutor-mode-modal__title { font-family: var(--tutor-font-display, serif); font-size: 22px; margin: 0 0 6px; color: var(--tutor-text, #1a1a2e); }
      .tutor-mode-modal__sub { color: var(--tutor-muted, #4a4a5a); margin: 0 0 18px; font-size: 13.5px; }
      .tutor-mode-modal__opts { display: flex; flex-direction: column; gap: 10px; }
      .tutor-mode-modal__opt { text-align: left; padding: 12px 14px; border: 1px solid var(--tutor-border, #e7ecf3); border-radius: var(--tutor-radius-sm, 8px); background: transparent; cursor: pointer; font: inherit; }
      .tutor-mode-modal__opt:hover { background: var(--tutor-accent-soft, rgba(201,162,39,0.10)); border-color: var(--tutor-accent, #c9a227); }
      .tutor-mode-modal__opt__title { font-weight: 600; color: var(--tutor-text, #1a1a2e); margin-bottom: 2px; }
      .tutor-mode-modal__opt__desc { color: var(--tutor-muted, #4a4a5a); font-size: 12.5px; }
      .tutor-mode-modal__close { margin-top: 14px; background: transparent; border: none; color: var(--tutor-faint, #8b8b9b); font: inherit; font-size: 12.5px; cursor: pointer; padding: 6px 0 0; }
    `
    document.head.appendChild(style)
  }

  // ── On-demand tab ───────────────────────────────────────────────

  private _renderOnDemand(panel: HTMLElement): void {
    const copy = this._brand?.copy ?? {}
    const placeholder = copy.placeholderTopic ?? "e.g. Bernoulli's principle · Lenz's law · Maxwell's equations"
    const ctaLabel = (this._slotText('cta-label') ?? copy.ctaLabel ?? 'AI Tutor →')

    panel.innerHTML = `
      <section class="tutor-section">
        <h2>Type a topic.</h2>
        <div class="tutor-row">
          <input type="text" class="tutor-input" data-canvasa-topic
                 placeholder="${escapeAttr(placeholder)}" value="${escapeAttr(this._topic)}">
          <button type="button" class="tutor-btn" data-canvasa-launch-topic ${this._busy || !this._topic.trim() ? 'disabled' : ''}>
            ${this._busy ? 'Working…' : escapeHtml(ctaLabel)}
          </button>
        </div>
        ${this._busyMsg || this._errorMsg ? `<div class="tutor-status${this._errorMsg ? ' tutor-status--error' : ''}">${escapeHtml(this._errorMsg || this._busyMsg)}</div>` : ''}
      </section>
      <section class="tutor-section" data-canvasa-source-picker></section>
      <section class="tutor-section">
        <h2>Or, drop a chapter or paper.</h2>
        <div data-canvasa-pdf-drop></div>
      </section>
    `

    const topicInput = panel.querySelector<HTMLInputElement>('[data-canvasa-topic]')
    if (topicInput) {
      topicInput.addEventListener('input', () => {
        this._topic = topicInput.value
        const btn = panel.querySelector<HTMLButtonElement>('[data-canvasa-launch-topic]')
        if (btn) btn.disabled = this._busy || !this._topic.trim()
      })
      topicInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') this._handleTopicGo()
      })
    }
    panel.querySelector<HTMLButtonElement>('[data-canvasa-launch-topic]')?.addEventListener('click', () => this._handleTopicGo())

    // Mount the source picker + PDF drop
    const srcMount = panel.querySelector<HTMLElement>('[data-canvasa-source-picker]')
    if (srcMount) this._mountSourcePicker(srcMount)
    const pdfMount = panel.querySelector<HTMLElement>('[data-canvasa-pdf-drop]')
    if (pdfMount) this._mountPdfDrop(pdfMount)
  }

  private _handleTopicGo(): void {
    const t = this._topic.trim()
    if (!t) return
    const lessonMode = (this.getAttribute('lesson-mode') as CanvasaLessonMode) || 'picker'
    // Fire host-overridable event (same contract as concept-card clicks)
    const ev = new CustomEvent('canvasa-lesson-click', {
      detail: { slug: '', title: t, cached: false, source: 'ondemand', ask: t, mode: lessonMode },
      bubbles: true, composed: true, cancelable: true,
    })
    if (!this.dispatchEvent(ev)) return  // host called preventDefault()
    if (lessonMode === 'teach' || lessonMode === 'guide') {
      this._dispatchLaunch({ slug: '', title: t, cached: false, source: 'ondemand', ask: t, level: 'UG' }, lessonMode)
    } else {
      // Show the teach-me / guide-me picker — same modal as concept-card clicks.
      // Default free-form topics to UG (safer than HS for ambiguous user input).
      this._openModePicker({ slug: '', title: t, cached: false, source: 'ondemand', ask: t, level: 'UG' })
    }
  }

  // Source picker — Internal wiki + External wiki, debounced search
  private _mountSourcePicker(mount: HTMLElement): void {
    let src: SourceKind = 'internal'
    let q = ''
    let results: WikiSearchResult[] = []
    let searching = false
    let debounceTimer: number | null = null

    const sources: { key: SourceKind; lbl: string; sub: string }[] = [
      { key: 'internal', lbl: 'Internal wiki', sub: 'SuperStem Physics + AI + HS concept graphs' },
      { key: 'external', lbl: 'External wiki', sub: 'Wikipedia — live' },
    ]

    const render = () => {
      mount.innerHTML = `
        <h2>Or, point at a source.</h2>
        <div class="tutor-sources">
          ${sources.map((s) => `
            <button type="button" class="tutor-source${src === s.key ? ' is-active' : ''}" data-canvasa-src="${s.key}">
              <div class="tutor-source__row">
                <span class="tutor-source__dot"></span>
                <div>
                  <div class="tutor-source__lbl">${escapeHtml(s.lbl)}</div>
                  <div class="tutor-source__sub">${escapeHtml(s.sub)}</div>
                </div>
              </div>
            </button>`).join('')}
        </div>
        <input type="text" class="tutor-input tutor-input--sm" data-canvasa-src-q
               value="${escapeAttr(q)}" placeholder="Type to search the selected source…">
        ${searching ? '<div class="tutor-status">Searching…</div>' : ''}
        ${results.length ? `
          <div class="tutor-results">
            ${results.slice(0, 10).map((r) => `
              <button type="button" class="tutor-result" data-canvasa-pick='${escapeAttr(JSON.stringify({ url: r.url, title: r.title }))}'>
                <div class="tutor-result__ttl">${escapeHtml(r.title)}</div>
                ${r.description || r.desc || r.snippet ? `<div class="tutor-result__desc">${escapeHtml(r.description || r.desc || r.snippet || '')}</div>` : ''}
              </button>`).join('')}
          </div>` : ''}
        <div class="tutor-hint">
          Searches across SuperStem Physics Wiki (1400+ articles) · AI Wiki · HS Physics/Math/Chemistry concept graphs.
        </div>
      `
      // Wire
      mount.querySelectorAll<HTMLButtonElement>('[data-canvasa-src]').forEach((b) => {
        b.addEventListener('click', () => { src = b.dataset.canvasaSrc as SourceKind; render() })
      })
      const inp = mount.querySelector<HTMLInputElement>('[data-canvasa-src-q]')
      inp?.addEventListener('input', () => {
        q = inp.value
        if (debounceTimer) clearTimeout(debounceTimer)
        if (!q.trim()) { results = []; render(); return }
        debounceTimer = window.setTimeout(async () => {
          searching = true; render()
          try {
            const res = src === 'external'
              ? await canvasaApi.wikiSearch(q.trim())
              : await canvasaApi.superstemSearch(q.trim())
            results = res.results || []
          } catch { results = [] }
          finally { searching = false; render() }
        }, 300)
      })
      mount.querySelectorAll<HTMLButtonElement>('[data-canvasa-pick]').forEach((b) => {
        b.addEventListener('click', () => {
          try {
            const picked = JSON.parse(b.dataset.canvasaPick || '{}') as { url?: string; title?: string }
            if (picked.url) this._launchUrl(picked.url, picked.title)
          } catch { /* noop */ }
        })
      })
    }
    render()
  }

  private _mountPdfDrop(mount: HTMLElement): void {
    mount.innerHTML = `
      <label class="tutor-pdfdrop" data-canvasa-pdf-label>
        <input type="file" accept="application/pdf" hidden data-canvasa-pdf-input>
        <span>Drop a PDF here, or <u>browse</u></span>
      </label>
    `
    const input = mount.querySelector<HTMLInputElement>('[data-canvasa-pdf-input]')
    const label = mount.querySelector<HTMLLabelElement>('[data-canvasa-pdf-label]')
    input?.addEventListener('change', () => {
      const f = input.files?.[0]
      if (f) this._launchPdf(f)
    })
    label?.addEventListener('dragover', (e) => { e.preventDefault(); label.classList.add('is-drag') })
    label?.addEventListener('dragleave', () => label.classList.remove('is-drag'))
    label?.addEventListener('drop', (e) => {
      e.preventDefault(); label.classList.remove('is-drag')
      const f = (e as DragEvent).dataTransfer?.files?.[0]
      if (f && f.type === 'application/pdf') this._launchPdf(f)
    })
  }

  // ── Concept library tab ─────────────────────────────────────────

  private async _renderConcepts(panel: HTMLElement): Promise<void> {
    panel.innerHTML = `<section class="tutor-section">
      <h2>Concept library</h2>
      <div class="tutor-section__sub" data-canvasa-concepts-sub>Loading…</div>
      <div class="tutor-row" style="margin-bottom: 14px;">
        <input type="text" class="tutor-input tutor-input--sm" data-canvasa-concept-q
               value="${escapeAttr(this._conceptQuery)}" placeholder="Search concepts…">
        <div class="tutor-chip-group" data-canvasa-concept-chips>
          ${(['all', 'HS', 'UG', 'G'] as ConceptLevel[]).map((l) => `
            <button type="button" class="tutor-chip${this._conceptLevel === l ? ' is-active' : ''}" data-canvasa-clvl="${l}">${l === 'all' ? 'All' : l}</button>`).join('')}
        </div>
      </div>
      <div data-canvasa-concept-topics></div>
    </section>`

    const sub = panel.querySelector<HTMLElement>('[data-canvasa-concepts-sub]')
    const wrap = panel.querySelector<HTMLElement>('[data-canvasa-concept-topics]')
    if (!sub || !wrap) return

    // Filter chips — Phase 8: clear section cache so next render re-fetches
    // from server with the new level param. Header counts stay (server-provided).
    panel.querySelectorAll<HTMLButtonElement>('[data-canvasa-clvl]').forEach((b) => {
      b.addEventListener('click', () => {
        this._conceptLevel = b.dataset.canvasaClvl as ConceptLevel
        panel.querySelectorAll<HTMLButtonElement>('[data-canvasa-clvl]').forEach((x) =>
          x.classList.toggle('is-active', x.dataset.canvasaClvl === this._conceptLevel))
        this._topicSectionCache.clear()
        this._pageState.clear()
        this._rerenderConceptTopics(wrap)
      })
    })

    // Search input (debounced) — also invalidates section cache.
    let cdebounce: number | null = null
    const cq = panel.querySelector<HTMLInputElement>('[data-canvasa-concept-q]')
    cq?.addEventListener('input', () => {
      this._conceptQuery = cq.value
      if (cdebounce) clearTimeout(cdebounce)
      cdebounce = window.setTimeout(() => {
        this._topicSectionCache.clear()
        this._pageState.clear()
        this._rerenderConceptTopics(wrap)
      }, 220)
    })

    // Phase 8: fetch ~1 KB of section headers ONCE — instant first paint.
    // Per-section lessons fetch on expand via /api/library-topics/section.
    if (!this._topicHeaders.length) {
      try {
        const d = await canvasaApi.libraryTopicHeaders()
        this._topicHeaders = d.topics || []
      } catch (cause) {
        sub.textContent = 'Failed to load: ' + String(cause)
        this._fireError('library-topics-failed', String(cause), cause)
        return
      }
    }
    const total = this._topicHeaders.reduce((acc, t) => acc + (t.count || 0), 0)
    sub.textContent = `${total.toLocaleString()} lessons across ${this._topicHeaders.length} topics — click a section to expand.`
    this._rerenderConceptTopics(wrap)
  }

  private _conceptLevelCount(t: LibraryTopicHeader): number {
    // Server-side header counts let us label "X lessons" per filter without
    // a roundtrip. Falls back to total when the filter chip is 'all'.
    switch (this._conceptLevel) {
      case 'HS': return t.hs_count
      case 'UG': return t.ug_count
      case 'G':  return t.g_count
      default:   return t.count
    }
  }

  private _rerenderConceptTopics(wrap: HTMLElement): void {
    const lvl = this._conceptLevel, q = this._conceptQuery.trim()
    // Search query forces server-side filter — we can't know counts client-side
    // without re-fetching, so we still draw all sections and let each body
    // load its own paged + filtered results.
    const filterActive = (lvl !== 'all' || !!q)
    wrap.innerHTML = this._topicHeaders.map((t, i) => {
      const baseCount = this._conceptLevelCount(t)
      const expanded = this._expanded.get('c:' + i) ?? (i === 0)
      const countLabel = q ? `${t.count} lessons · search active` : `${baseCount} lesson${baseCount === 1 ? '' : 's'}${filterActive ? ` of ${t.count}` : ''}`
      // Hide sections that have zero matches under the current level filter.
      const hide = (lvl !== 'all' && baseCount === 0 && !q)
      return `
        <div class="tutor-topic${expanded ? ' is-expanded' : ''}" data-canvasa-ctopic="${i}" data-canvasa-cname="${escapeAttr(t.name)}" style="${hide ? 'display:none;' : ''}">
          <div class="tutor-topic__head" data-canvasa-ctoggle="${i}">
            <span class="tutor-topic__icon">${escapeHtml(t.icon || '📘')}</span>
            <span class="tutor-topic__name">${escapeHtml(t.name)}</span>
            <span class="tutor-topic__count">${escapeHtml(countLabel)}</span>
            <span class="tutor-topic__chev">▶</span>
          </div>
          <div class="tutor-topic__body" data-canvasa-ctopic-body="${i}" data-rendered="0"></div>
        </div>`
    }).join('')

    wrap.querySelectorAll<HTMLElement>('[data-canvasa-ctoggle]').forEach((head) => {
      head.addEventListener('click', () => {
        const idx = +(head.dataset.canvasaCtoggle || '0')
        const topic = wrap.querySelector<HTMLElement>(`[data-canvasa-ctopic="${idx}"]`)
        if (!topic) return
        const willExpand = !topic.classList.contains('is-expanded')
        topic.classList.toggle('is-expanded', willExpand)
        this._expanded.set('c:' + idx, willExpand)
        if (willExpand) void this._renderConceptTopicBody(wrap, idx, 0)
      })
    })

    // Auto-render first expanded section's body
    this._topicHeaders.forEach((_, i) => {
      if (this._expanded.get('c:' + i) ?? (i === 0)) {
        void this._renderConceptTopicBody(wrap, i, this._pageState.get('c:' + i) ?? 0)
      }
    })
  }

  private async _renderConceptTopicBody(wrap: HTMLElement, idx: number, page: number): Promise<void> {
    const header = this._topicHeaders[idx]
    if (!header) return
    const body = wrap.querySelector<HTMLElement>(`[data-canvasa-ctopic-body="${idx}"]`)
    if (!body) return

    const lvl = this._conceptLevel
    const q = this._conceptQuery.trim()
    const cacheKey = header.name
    const offset = Math.max(0, page * PAGE_SIZE)

    // Cache hit only when level + query + page match. Filter changes
    // invalidate the entry.
    const cached = this._topicSectionCache.get(cacheKey)
    const cacheValid = cached && cached.level === lvl && cached.q === q && cached.offset === offset && cached.limit === PAGE_SIZE
    let lessons: Lesson[]
    let total: number
    if (cacheValid && cached) {
      lessons = cached.lessons
      total = cached.total
    } else {
      // Show loading placeholder synchronously, then await the fetch.
      body.innerHTML = '<div class="tutor-empty">Loading…</div>'
      body.dataset.rendered = '0'
      try {
        const d = await canvasaApi.libraryTopicSection(header.name, offset, PAGE_SIZE, lvl, q)
        lessons = d.lessons || []
        total = d.total || 0
        this._topicSectionCache.set(cacheKey, { lessons, total, offset, limit: PAGE_SIZE, level: lvl, q })
      } catch (cause) {
        body.innerHTML = `<div class="tutor-empty">Failed to load: ${escapeHtml(String(cause))}</div>`
        this._fireError('library-topic-section-failed', String(cause), cause)
        return
      }
    }

    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
    if (page < 0) page = 0
    if (page >= totalPages) page = totalPages - 1
    this._pageState.set('c:' + idx, page)

    body.innerHTML = `
      <div class="tutor-card-grid">
        ${lessons.map((l) => {
          const level = l.level || 'HS'
          return `<button type="button" class="tutor-card" data-canvasa-lesson="${escapeAttr(l.slug)}" data-canvasa-cached="${l.cached ? '1' : '0'}" data-canvasa-guide-cached="${l.guide_cached ? '1' : '0'}" data-canvasa-level="${escapeAttr(level)}" data-canvasa-title="${escapeAttr(l.title)}" data-canvasa-source="concept">
            <div class="tutor-card__title">${escapeHtml(l.title)}</div>
            <div class="tutor-card__meta">
              <span>${escapeHtml(level)}</span>
              ${l.cached ? '<span class="tutor-card__cached">✓ cached</span>' : ''}
              ${l.guide_cached ? '<span class="tutor-card__guide">⚡ guide</span>' : ''}
            </div>
          </button>`
        }).join('')}
      </div>
      ${total > PAGE_SIZE ? `
        <div class="tutor-pag">
          <button type="button" data-canvasa-cpag-prev ${page <= 0 ? 'disabled' : ''}>← Prev</button>
          <span>Page ${page + 1} of ${totalPages} · ${total} lesson${total === 1 ? '' : 's'}</span>
          <button type="button" data-canvasa-cpag-next ${page >= totalPages - 1 ? 'disabled' : ''}>Next →</button>
        </div>` : (total === 0 ? '<div class="tutor-empty">No matches in this topic.</div>' : '')}
    `
    body.dataset.rendered = '1'

    body.querySelector<HTMLButtonElement>('[data-canvasa-cpag-prev]')?.addEventListener('click', (e) => {
      e.stopPropagation(); void this._renderConceptTopicBody(wrap, idx, page - 1)
    })
    body.querySelector<HTMLButtonElement>('[data-canvasa-cpag-next]')?.addEventListener('click', (e) => {
      e.stopPropagation(); void this._renderConceptTopicBody(wrap, idx, page + 1)
    })
    body.querySelectorAll<HTMLButtonElement>('[data-canvasa-lesson]').forEach((card) => {
      card.addEventListener('click', () => {
        this._handleLessonCardClick({
          slug: card.dataset.canvasaLesson || '',
          title: card.dataset.canvasaTitle || '',
          cached: card.dataset.canvasaCached === '1',
          guideCached: card.dataset.canvasaGuideCached === '1',
          level: card.dataset.canvasaLevel || '',
          source: 'concept',
        })
      })
    })
  }

  // ── Problems tab ────────────────────────────────────────────────

  private async _renderProblems(panel: HTMLElement): Promise<void> {
    panel.innerHTML = `<section class="tutor-section">
      <h2>Problems</h2>
      <div class="tutor-section__sub" data-canvasa-problems-sub>Loading…</div>
      <div class="tutor-row" style="margin-bottom: 14px;">
        <input type="text" class="tutor-input tutor-input--sm" data-canvasa-prob-q
               value="${escapeAttr(this._probQuery)}" placeholder="Search problems…">
        <div class="tutor-chip-group" data-canvasa-prob-chips>
          ${(['all', 'HS', 'UG', 'G', 'Olympiad', 'cached'] as ProbChip[]).map((c) => `
            <button type="button" class="tutor-chip${this._probChip === c ? ' is-active' : ''}" data-canvasa-pchip="${c}">${c === 'all' ? 'All' : (c === 'cached' ? '✓' : c)}</button>`).join('')}
        </div>
      </div>
      <div data-canvasa-problem-sections></div>
    </section>`

    const sub = panel.querySelector<HTMLElement>('[data-canvasa-problems-sub]')
    const wrap = panel.querySelector<HTMLElement>('[data-canvasa-problem-sections]')
    if (!sub || !wrap) return

    panel.querySelectorAll<HTMLButtonElement>('[data-canvasa-pchip]').forEach((b) => {
      b.addEventListener('click', () => {
        this._probChip = b.dataset.canvasaPchip as ProbChip
        panel.querySelectorAll<HTMLButtonElement>('[data-canvasa-pchip]').forEach((x) =>
          x.classList.toggle('is-active', x.dataset.canvasaPchip === this._probChip))
        this._problemSectionCache.clear()
        this._pageState.clear()
        this._rerenderProblemSections(wrap)
      })
    })

    let pdebounce: number | null = null
    const pq = panel.querySelector<HTMLInputElement>('[data-canvasa-prob-q]')
    pq?.addEventListener('input', () => {
      this._probQuery = pq.value
      if (pdebounce) clearTimeout(pdebounce)
      pdebounce = window.setTimeout(() => {
        this._problemSectionCache.clear()
        this._pageState.clear()
        this._rerenderProblemSections(wrap)
      }, 220)
    })

    // Phase 8: header-only fetch first paint. Per-section problems fetch on expand.
    if (!this._problemHeaders.length) {
      try {
        const d = await canvasaApi.problemsLibraryHeaders()
        this._problemHeaders = d.sections || []
      } catch (cause) {
        sub.textContent = 'Failed to load: ' + String(cause)
        this._fireError('problems-library-failed', String(cause), cause)
        return
      }
    }
    const total = this._problemHeaders.reduce((a, s) => a + (s.count || 0), 0)
    sub.textContent = `${total.toLocaleString()} problems across ${this._problemHeaders.length} sections — click a section to expand.`
    this._rerenderProblemSections(wrap)
  }

  private _probChipToLevel(): 'all' | 'HS' | 'UG' | 'G' | 'olympiad' | 'cached' {
    switch (this._probChip) {
      case 'HS': case 'UG': case 'G': return this._probChip
      case 'Olympiad': return 'olympiad'
      case 'cached':   return 'cached'
      default: return 'all'
    }
  }

  private _problemChipCount(s: ProblemsLibraryHeader): number {
    switch (this._probChip) {
      case 'HS': return s.hs_count
      case 'UG': return s.ug_count
      case 'G':  return s.g_count
      case 'Olympiad': return s.olympiad_count
      case 'cached':   return s.cached_count
      default: return s.count
    }
  }

  private _rerenderProblemSections(wrap: HTMLElement): void {
    const chip = this._probChip, q = this._probQuery.trim()
    const filterActive = (chip !== 'all' || !!q)
    wrap.innerHTML = this._problemHeaders.map((s, i) => {
      const baseCount = this._problemChipCount(s)
      const expanded = this._expanded.get('p:' + i) ?? (i === 0)
      const countLabel = q ? `${s.count} problems · search active` : `${baseCount} problem${baseCount === 1 ? '' : 's'}${filterActive ? ` of ${s.count}` : ''}`
      const hide = (chip !== 'all' && baseCount === 0 && !q)
      return `
        <div class="tutor-topic${expanded ? ' is-expanded' : ''}" data-canvasa-psec="${i}" data-canvasa-pname="${escapeAttr(s.name)}" style="${hide ? 'display:none;' : ''}">
          <div class="tutor-topic__head" data-canvasa-ptoggle="${i}">
            <span class="tutor-topic__icon">${escapeHtml(s.icon || '📘')}</span>
            <span class="tutor-topic__name">${escapeHtml(s.name)}</span>
            <span class="tutor-topic__count">${escapeHtml(countLabel)}</span>
            <span class="tutor-topic__chev">▶</span>
          </div>
          <div class="tutor-topic__body" data-canvasa-psec-body="${i}" data-rendered="0"></div>
        </div>`
    }).join('')

    wrap.querySelectorAll<HTMLElement>('[data-canvasa-ptoggle]').forEach((head) => {
      head.addEventListener('click', () => {
        const idx = +(head.dataset.canvasaPtoggle || '0')
        const sec = wrap.querySelector<HTMLElement>(`[data-canvasa-psec="${idx}"]`)
        if (!sec) return
        const willExpand = !sec.classList.contains('is-expanded')
        sec.classList.toggle('is-expanded', willExpand)
        this._expanded.set('p:' + idx, willExpand)
        if (willExpand) void this._renderProblemSectionBody(wrap, idx, 0)
      })
    })

    // Auto-render initially expanded sections
    this._problemHeaders.forEach((_, i) => {
      if (this._expanded.get('p:' + i) ?? (i === 0)) void this._renderProblemSectionBody(wrap, i, this._pageState.get('p:' + i) ?? 0)
    })
  }

  private async _renderProblemSectionBody(wrap: HTMLElement, idx: number, page: number): Promise<void> {
    const header = this._problemHeaders[idx]
    if (!header) return
    const body = wrap.querySelector<HTMLElement>(`[data-canvasa-psec-body="${idx}"]`)
    if (!body) return

    const chip = this._probChip
    const lvl = this._probChipToLevel()
    const q = this._probQuery.trim()
    const cacheKey = header.name
    const offset = Math.max(0, page * PAGE_SIZE)

    const cached = this._problemSectionCache.get(cacheKey)
    const cacheValid = cached && cached.chip === chip && cached.q === q && cached.offset === offset && cached.limit === PAGE_SIZE
    let problems: Problem[]
    let total: number
    if (cacheValid && cached) {
      problems = cached.problems
      total = cached.total
    } else {
      body.innerHTML = '<div class="tutor-empty">Loading…</div>'
      body.dataset.rendered = '0'
      try {
        const d = await canvasaApi.problemsLibrarySection(header.name, offset, PAGE_SIZE, lvl, q)
        problems = d.problems || []
        total = d.total || 0
        this._problemSectionCache.set(cacheKey, { problems, total, offset, limit: PAGE_SIZE, chip, q })
      } catch (cause) {
        body.innerHTML = `<div class="tutor-empty">Failed to load: ${escapeHtml(String(cause))}</div>`
        this._fireError('problems-library-section-failed', String(cause), cause)
        return
      }
    }

    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
    if (page < 0) page = 0
    if (page >= totalPages) page = totalPages - 1
    this._pageState.set('p:' + idx, page)

    body.innerHTML = `
      <div class="tutor-prob-list">
        ${problems.map((p) => {
          const level = p.level || 'UG'
          const diff = p.difficulty || 'medium'
          return `<button type="button" class="tutor-prob" data-canvasa-lesson="${escapeAttr(p.slug)}" data-canvasa-cached="${p.cached ? '1' : '0'}" data-canvasa-guide-cached="${p.guide_cached ? '1' : '0'}" data-canvasa-level="${escapeAttr(level)}" data-canvasa-title="${escapeAttr(p.title)}" data-canvasa-source="problem" data-canvasa-statement="${escapeAttr(p.statement || '')}">
            <div class="tutor-prob__head">
              <span class="tutor-prob__title">${escapeHtml(p.title)}</span>
              <span class="tutor-pill tutor-pill--${escapeAttr(diff)}">${escapeHtml(diff)}</span>
              <span class="tutor-pill">${escapeHtml(level)}</span>
              ${p.source ? `<span class="tutor-prob__src">· ${escapeHtml(p.source)}</span>` : ''}
              ${p.cached ? '<span class="tutor-prob__cached" title="Cached — instant load">✓</span>' : ''}
              ${p.guide_cached ? '<span class="tutor-prob__guide" title="Figure-It-Out cached">⚡</span>' : ''}
            </div>
            ${p.statement ? `<div class="tutor-prob__statement">${p.statement}</div>` : ''}
          </button>`
        }).join('')}
      </div>
      ${total > PAGE_SIZE ? `
        <div class="tutor-pag">
          <button type="button" data-canvasa-ppag-prev ${page <= 0 ? 'disabled' : ''}>← Prev</button>
          <span>Page ${page + 1} of ${totalPages} · ${total} result${total === 1 ? '' : 's'}</span>
          <button type="button" data-canvasa-ppag-next ${page >= totalPages - 1 ? 'disabled' : ''}>Next →</button>
        </div>` : (total === 0 ? '<div class="tutor-empty">No matches in this section.</div>' : '')}
    `
    body.dataset.rendered = '1'

    body.querySelector<HTMLButtonElement>('[data-canvasa-ppag-prev]')?.addEventListener('click', (e) => {
      e.stopPropagation(); void this._renderProblemSectionBody(wrap, idx, page - 1)
    })
    body.querySelector<HTMLButtonElement>('[data-canvasa-ppag-next]')?.addEventListener('click', (e) => {
      e.stopPropagation(); void this._renderProblemSectionBody(wrap, idx, page + 1)
    })
    body.querySelectorAll<HTMLButtonElement>('[data-canvasa-lesson]').forEach((b) => {
      b.addEventListener('click', () => {
        this._handleLessonCardClick({
          slug: b.dataset.canvasaLesson || '',
          title: b.dataset.canvasaTitle || '',
          cached: b.dataset.canvasaCached === '1',
          guideCached: b.dataset.canvasaGuideCached === '1',
          level: b.dataset.canvasaLevel || '',
          source: 'problem',
          statement: b.dataset.canvasaStatement || '',
        })
      })
    })

    // KaTeX on the just-rendered slice
    const katex = await ensureKatex(this.getAttribute('katex-cdn'))
    renderMathInChildren(body, katex)
  }

  // ── Lesson card click → mode picker → launch ────────────────────

  private _handleLessonCardClick(detail: { slug: string; title: string; cached: boolean; source: string; statement?: string; guideCached?: boolean; level?: string }): void {
    const lessonMode = (this.getAttribute('lesson-mode') as CanvasaLessonMode) || 'picker'

    // Fire host-overridable event
    const ev = new CustomEvent('canvasa-lesson-click', {
      detail: { ...detail, mode: lessonMode },
      bubbles: true, composed: true, cancelable: true,
    })
    const proceed = this.dispatchEvent(ev)
    if (!proceed) return  // host called preventDefault()

    if (lessonMode === 'teach' || lessonMode === 'guide') {
      this._dispatchLaunch(detail, lessonMode)
    } else {
      // Show picker modal
      this._openModePicker(detail)
    }
  }

  /**
   * Route the lesson click to the right endpoint + mode:
   *
   *   mode=teach (Walk-Me-Through, /tutor):
   *     cached=true   → /tutor?lesson=<slug>          (instant load)
   *     cached=false  → /tutor?ask=<statement|title>  (canvas-a live-builds)
   *
   *   mode=guide (Figure-It-Out, /guide):
   *     guideCached=true  → /guide?lesson=<slug>      (pre-built skeleton)
   *     guideCached=false → FALLBACK to /tutor?ask=…  (live-build via teach,
   *                          since /guide does NOT support live-build and
   *                          would show "Step 1 missing — cache incomplete"
   *                          with no audio). Surface this fallback via the
   *                          canvasa-error event so hosts can notify.
   *
   * v0.1.0-alpha.11: Guide-Me now works universally. Backend (v2.12) live-builds
   * Mode 2 skeletons on /guide?ask=&level= so we no longer hide Guide-Me for
   * uncached items.
   */
  private _dispatchLaunch(
    detail: { slug: string; title: string; cached: boolean; source: string; statement?: string; ask?: string; guideCached?: boolean; level?: string },
    mode: 'teach' | 'guide',
  ): void {
    const level = (detail.level || '').trim()  // 'HS' | 'UG' | 'G' (or '' = server default)

    // Guide-Me: use lesson route if a pre-built skeleton exists, else ?ask= live-build.
    if (mode === 'guide') {
      if (detail.slug && detail.guideCached) {
        this._launch('lesson', { lesson: detail.slug, mode: 'guide', statement: detail.statement ?? '', level })
        return
      }
      const askText = (detail.ask || detail.statement || detail.title || '').trim()
      if (askText) {
        this._launch('ask', { ask: askText, mode: 'guide', level })
        return
      }
      if (detail.slug) {
        this._launch('lesson', { lesson: detail.slug, mode: 'guide', level })
        return
      }
    }

    // Teach-Me: cached lessons load instantly, uncached live-build via ?ask=.
    if (detail.cached && detail.slug) {
      this._launch('lesson', { lesson: detail.slug, mode: 'teach', statement: detail.statement ?? '', level })
      return
    }
    const askText = (detail.ask || detail.statement || detail.title || '').trim()
    if (askText) {
      this._launch('ask', { ask: askText, mode: 'teach', level })
    } else if (detail.slug) {
      this._launch('lesson', { lesson: detail.slug, mode: 'teach', level })
    }
  }

  private _openModePicker(detail: { slug: string; title: string; cached: boolean; source: string; statement?: string; ask?: string; guideCached?: boolean; level?: string }): void {
    // v0.1.0-alpha.11: Universal Guide-Me. Backend now live-builds Mode 2
    // skeletons on /guide?ask=&level= via /api/mode2/quick-skeleton, so both
    // modes work for ANY topic regardless of guide_cached. We always show
    // both options. Cached items load instantly; uncached items live-build
    // (first content in ~12-18s like Walk-Me-Through).
    const modal = document.createElement('div')
    modal.className = 'tutor-mode-modal'
    modal.innerHTML = `
      <div class="tutor-mode-modal__card" role="dialog" aria-label="Pick a learning mode">
        <h3 class="tutor-mode-modal__title">${escapeHtml(detail.title || 'Pick a learning mode')}</h3>
        <p class="tutor-mode-modal__sub">Two ways to learn this — pick what suits you.</p>
        <div class="tutor-mode-modal__opts">
          <button type="button" class="tutor-mode-modal__opt" data-mode="teach">
            <div class="tutor-mode-modal__opt__title">Walk me through it (Teach-me)</div>
            <div class="tutor-mode-modal__opt__desc">Linear lesson with synthesized audio + chalkboard visuals.</div>
          </button>
          <button type="button" class="tutor-mode-modal__opt" data-mode="guide">
            <div class="tutor-mode-modal__opt__title">Guide me to figure it out</div>
            <div class="tutor-mode-modal__opt__desc">Socratic checkpoints + hints. You drive; the tutor scaffolds.</div>
          </button>
        </div>
        <button type="button" class="tutor-mode-modal__close" data-cancel>Cancel</button>
      </div>
    `
    document.body.appendChild(modal)
    const close = () => modal.remove()
    modal.addEventListener('click', (e) => { if (e.target === modal) close() })
    modal.querySelector<HTMLButtonElement>('[data-cancel]')?.addEventListener('click', close)
    modal.querySelectorAll<HTMLButtonElement>('[data-mode]').forEach((b) => {
      b.addEventListener('click', () => {
        const mode = (b.dataset.mode as CanvasaLessonMode) || 'teach'
        close()
        this._dispatchLaunch(detail, mode === 'guide' ? 'guide' : 'teach')
      })
    })
    // ESC to close
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { close(); document.removeEventListener('keydown', onKey) } }
    document.addEventListener('keydown', onKey)
  }

  // ── Launch (redirect to /tutor or /guide) ───────────────────────

  private _launch(kind: 'ask' | 'lesson', payload: Record<string, string>): void {
    const ev = new CustomEvent('canvasa-launch', {
      detail: { kind, payload }, bubbles: true, composed: true, cancelable: true,
    })
    if (!this.dispatchEvent(ev)) return  // host intercepts

    const mode = payload.mode === 'guide' ? 'guide' : 'tutor'
    const path = mode === 'guide' ? '/guide' : '/tutor'
    const qs = new URLSearchParams()
    if (payload.lesson) qs.set('lesson', payload.lesson)
    if (payload.ask) qs.set('ask', payload.ask)
    qs.set('brand', this._tenant())
    if (payload.level) qs.set('level', payload.level)
    if (typeof window !== 'undefined' && window.location) {
      qs.set('return', window.location.href)
      const url = `${getCanvasaHost()}${path}?${qs.toString()}`
      const target = this.getAttribute('lesson-target') || 'self'
      if (target === 'blank') {
        window.open(url, '_blank', 'noopener')
      } else if (target.startsWith('.') || target.startsWith('#')) {
        const slot = document.querySelector(target) as HTMLIFrameElement | null
        if (slot && 'src' in slot) slot.src = url
      } else {
        window.location.assign(url)
      }
    }
  }

  private _launchUrl(srcUrl: string, title?: string): void {
    this._busy = true; this._busyMsg = 'Opening tutor…'; this._render()
    const qs = new URLSearchParams()
    qs.set('ask', (title && title.trim()) || srcUrl)
    qs.set('brand', this._tenant())
    if (typeof window !== 'undefined' && window.location) qs.set('return', window.location.href)
    window.location.assign(`${getCanvasaHost()}/tutor?${qs.toString()}`)
  }

  private async _launchPdf(file: File): Promise<void> {
    this._busy = true; this._busyMsg = 'Reading PDF…'; this._errorMsg = ''; this._render()
    try {
      const res = await canvasaApi.generateFromPdf(file)
      if (res.ready_url) window.location.assign(res.ready_url)
      else { this._busyMsg = 'Building from PDF — first beat in ~12-18s…'; this._render() }
    } catch (cause) {
      this._errorMsg = 'PDF upload failed: ' + String(cause); this._busy = false
      this._render()
      this._fireError('pdf-upload-failed', String(cause), cause)
    }
  }

  // ── Events ──────────────────────────────────────────────────────

  private _fireTab(): void {
    this.dispatchEvent(new CustomEvent('canvasa-tab-change', {
      detail: { tab: this._tab }, bubbles: true, composed: true,
    }))
  }

  private _markReady(): void {
    if (this._ready) return
    this._ready = true
    this.dispatchEvent(new CustomEvent('canvasa-ready', {
      detail: { version: CANVASA_SDK_VERSION, tenant: this._tenant() },
      bubbles: true, composed: true,
    }))
    if (this._debug()) console.log('[canvasa] ready', { tenant: this._tenant(), brand: this._brand, counts: this._counts })
  }

  private _fireError(code: string, message: string, cause?: unknown): void {
    this.dispatchEvent(new CustomEvent('canvasa-error', {
      detail: { code, message, cause }, bubbles: true, composed: true,
    }))
    if (this._debug()) console.warn('[canvasa] error', code, message)
  }
}

// ───────────────────────────────────────────────────────────────────
// Registration
// ───────────────────────────────────────────────────────────────────

export function registerCanvasaTutor(): void {
  if (typeof window === 'undefined') return
  if (window.customElements.get('canvasa-tutor')) return
  window.customElements.define('canvasa-tutor', CanvasaTutorElement)
}
