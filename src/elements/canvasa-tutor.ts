/**
 * <canvasa-tutor> — Canvas A AI Tutor landing as a custom element.
 *
 * v1 SCOPE (this Phase 1 scaffold)
 *   - Shell only: registers the element, parses attributes, fires
 *     `canvasa-ready`, exposes the programmatic API. Renders a minimal
 *     "Canvas A SDK · vN.N.N" placeholder. Phase 2 ports the full landing
 *     UI from canvasa-tutor-react v0.1.7 into this element.
 *
 * RENDERING MODEL
 *   - Light DOM (no shadow root) so host CSS reaches the element naturally.
 *     All internal classes are prefixed `canvasa-` (BEM-style) to avoid
 *     collisions with host styles.
 *   - CSS custom properties drive theming. Hosts set them on the element
 *     (or any ancestor) and the SDK inherits.
 *
 * ATTRIBUTES
 *   tenant            string  — which brand config to load (default: "default")
 *   mode              "landing" | "embed" | "compact"   (default: "landing")
 *   default-tab       "ondemand" | "concepts" | "problems"   (default: "ondemand")
 *   hide-tabs         comma-list (e.g. "concepts,problems")
 *   lesson            slug      — pre-launch a lesson on mount (skips landing)
 *   ask               topic     — pre-launch a live build (skips landing)
 *   problem-id        po_id     — open a specific problem
 *   lesson-target     "self" | "blank" | css-selector
 *   lesson-mode       "teach" | "guide" | "picker"   (default: "picker")
 *   katex-cdn         URL or "off"
 *   debug             "1" to enable console logging
 *
 * CSS CUSTOM PROPERTIES (set on the element or any ancestor)
 *   --tutor-accent --tutor-accent-hover --tutor-bg --tutor-surface
 *   --tutor-text --tutor-muted --tutor-line --tutor-radius
 *   --tutor-font-head --tutor-font-body --tutor-font-mono
 *   --tutor-mark-url --tutor-spacing-unit
 *
 * SLOTS
 *   hero-title    Override the hero h1
 *   hero-sub      Override the hero sub-line
 *   cta-label     Override the primary CTA label
 *   empty-state   Override the "no matches" copy
 *   footer        Append host-specific footer chrome
 *
 * EVENTS (CustomEvents, bubble + composed)
 *   canvasa-ready          { version, tenant }                      fires on mount + after brand-config load
 *   canvasa-tab-change     { tab }                                  fires when user switches tabs
 *   canvasa-lesson-click   { slug, title, cached, mode, source }    fires when user clicks a lesson card
 *   canvasa-launch         { kind: "ask" | "lesson", payload }      fires before navigation to /tutor or /guide
 *   canvasa-error          { code, message, cause }                 on fetch / config errors
 *
 * PROGRAMMATIC API (methods on the element)
 *   setTenant(tenant: string): void
 *   setTab(tab: "ondemand" | "concepts" | "problems"): void
 *   launchAsk(topic: string, opts?: { mode?: "teach" | "guide" }): void
 *   launchLesson(slug: string, opts?: { mode?: "teach" | "guide" }): void
 *   getBrandConfig(): BrandConfig | null
 *   refresh(): Promise<void>
 */

import { CANVASA_SDK_VERSION } from '../version'

// Default backend host. Override per-element via `data-canvasa-host` attribute
// or globally via window.CANVASA_HOST before SDK loads.
function getCanvasaHost(): string {
  if (typeof window !== 'undefined' && (window as any).CANVASA_HOST) {
    return (window as any).CANVASA_HOST as string
  }
  return 'https://canvasa.olympiz.ai'
}

// ───────────────────────────────────────────────────────────────────
// Types
// ───────────────────────────────────────────────────────────────────

export type CanvasaTutorTab = 'ondemand' | 'concepts' | 'problems'
export type CanvasaLessonMode = 'teach' | 'guide' | 'picker'

export interface BrandTokens {
  accent?: string
  accentHover?: string
  bg?: string
  surface?: string
  text?: string
  muted?: string
  line?: string
  radius?: string
  fontHead?: string
  fontBody?: string
  fontMono?: string
  spacingUnit?: string
}

export interface BrandCopy {
  heroTitle?: string
  heroSub?: string
  ctaLabel?: string
  emptyState?: string
  tabs?: Partial<Record<CanvasaTutorTab, string>>
  placeholderTopic?: string
}

export interface BrandMark {
  url?: string
  svg?: string
  alt?: string
}

export interface BrandConfig {
  tenant: string
  tokens?: BrandTokens
  copy?: BrandCopy
  mark?: BrandMark
  view?: {
    tabs?: CanvasaTutorTab[]
    defaultTab?: CanvasaTutorTab
    defaultFilters?: Record<string, unknown>
  }
  redirectsTo?: string
  deprecated?: boolean
}

export interface CanvasaTutorEventMap {
  'canvasa-ready':         CustomEvent<{ version: string; tenant: string }>
  'canvasa-tab-change':    CustomEvent<{ tab: CanvasaTutorTab }>
  'canvasa-lesson-click':  CustomEvent<{ slug: string; title: string; cached: boolean; mode: CanvasaLessonMode; source: string }>
  'canvasa-launch':        CustomEvent<{ kind: 'ask' | 'lesson'; payload: Record<string, unknown> }>
  'canvasa-error':         CustomEvent<{ code: string; message: string; cause?: unknown }>
}

// ───────────────────────────────────────────────────────────────────
// CanvasaTutorElement
// ───────────────────────────────────────────────────────────────────

export class CanvasaTutorElement extends HTMLElement {
  static readonly observedAttributes = [
    'tenant', 'mode', 'default-tab', 'hide-tabs', 'lesson', 'ask',
    'problem-id', 'lesson-target', 'lesson-mode', 'katex-cdn', 'debug',
  ] as const

  private _brand: BrandConfig | null = null
  private _ready = false

  // ── Lifecycle ───────────────────────────────────────────────────

  connectedCallback(): void {
    // Mark element with a stable class so host CSS can target it.
    this.classList.add('canvasa-tutor')
    this._renderShell()
    void this._loadBrandConfig().then(() => {
      this._applyBrandTokens()
      this._renderShell()  // re-render with brand-loaded state
      this._markReady()
    })
  }

  disconnectedCallback(): void {
    // Intentionally minimal — Phase 2 will wire up cleanup of observers,
    // fetch abort controllers, KaTeX teardown, etc.
  }

  attributeChangedCallback(name: string, _old: string | null, _next: string | null): void {
    if (!this.isConnected) return
    if (name === 'tenant') {
      void this._loadBrandConfig().then(() => {
        this._applyBrandTokens()
        this._renderShell()
      })
    } else {
      this._renderShell()
    }
  }

  // ── Programmatic API ────────────────────────────────────────────

  setTenant(tenant: string): void {
    this.setAttribute('tenant', tenant)
  }

  setTab(tab: CanvasaTutorTab): void {
    this.setAttribute('default-tab', tab)
    this.dispatchEvent(new CustomEvent('canvasa-tab-change', { detail: { tab }, bubbles: true, composed: true }))
  }

  launchAsk(topic: string, opts?: { mode?: CanvasaLessonMode }): void {
    this._launch('ask', { ask: topic, mode: opts?.mode ?? 'teach' })
  }

  launchLesson(slug: string, opts?: { mode?: CanvasaLessonMode }): void {
    this._launch('lesson', { lesson: slug, mode: opts?.mode ?? 'teach' })
  }

  getBrandConfig(): BrandConfig | null {
    return this._brand
  }

  async refresh(): Promise<void> {
    await this._loadBrandConfig()
    this._applyBrandTokens()
    this._renderShell()
  }

  // ── Internal ────────────────────────────────────────────────────

  private _tenant(): string {
    return this.getAttribute('tenant') || 'default'
  }

  private _debug(): boolean {
    return this.getAttribute('debug') === '1'
  }

  private async _loadBrandConfig(): Promise<void> {
    const tenant = this._tenant()
    const url = `${getCanvasaHost()}/api/brand/${encodeURIComponent(tenant)}`
    try {
      const r = await fetch(url, { credentials: 'omit' })
      if (!r.ok) throw new Error(`HTTP ${r.status}`)
      this._brand = (await r.json()) as BrandConfig
      if (this._debug()) console.log('[canvasa] brand loaded', this._brand)
    } catch (cause) {
      // Brand-config endpoint may not exist yet (Phase 3 builds it). Fall
      // back to a built-in default so the element renders something.
      this._brand = { tenant, tokens: {}, copy: {}, mark: {} }
      this.dispatchEvent(new CustomEvent('canvasa-error', {
        detail: { code: 'brand-config-fetch-failed', message: String(cause), cause },
        bubbles: true, composed: true,
      }))
    }
  }

  private _applyBrandTokens(): void {
    if (!this._brand?.tokens) return
    const t = this._brand.tokens
    const set = (k: string, v: string | undefined) => { if (v) this.style.setProperty(k, v) }
    set('--tutor-accent', t.accent)
    set('--tutor-accent-hover', t.accentHover)
    set('--tutor-bg', t.bg)
    set('--tutor-surface', t.surface)
    set('--tutor-text', t.text)
    set('--tutor-muted', t.muted)
    set('--tutor-line', t.line)
    set('--tutor-radius', t.radius)
    set('--tutor-font-head', t.fontHead)
    set('--tutor-font-body', t.fontBody)
    set('--tutor-font-mono', t.fontMono)
    set('--tutor-spacing-unit', t.spacingUnit)
  }

  private _renderShell(): void {
    const tenant = this._tenant()
    const copy = this._brand?.copy ?? {}
    const heroTitle = this.querySelector('[slot="hero-title"]')?.textContent
      ?? copy.heroTitle ?? 'What do you want to learn today?'
    const heroSub = this.querySelector('[slot="hero-sub"]')?.textContent
      ?? copy.heroSub ?? 'Drop a question.'

    // Phase 1 placeholder. Phase 2 swaps this for the full landing UI.
    // The placeholder still renders the version pill + theme tokens so
    // hosts can validate their CSS variables resolve correctly.
    this.innerHTML = `
      <style>
        .canvasa-tutor {
          display: block;
          font-family: var(--tutor-font-body, 'Inter', system-ui, sans-serif);
          color: var(--tutor-text, #1a3a52);
          padding: 24px;
        }
        .canvasa-tutor__hero {
          text-align: center;
          padding: 32px 0;
        }
        .canvasa-tutor__hero h1 {
          font-family: var(--tutor-font-head, 'Playfair Display', Georgia, serif);
          font-size: clamp(28px, 5vw, 48px);
          margin: 0 0 12px;
          color: var(--tutor-text, #1a3a52);
        }
        .canvasa-tutor__hero p {
          color: var(--tutor-muted, #5a7c92);
          margin: 0;
        }
        .canvasa-tutor__pill {
          position: fixed; top: 12px; right: 60px; z-index: 99999;
          font-family: 'JetBrains Mono', ui-monospace, monospace;
          font-size: 11px; font-weight: 600; letter-spacing: 0.08em;
          padding: 5px 11px; border-radius: 999px;
          background: #14213D; color: #e8c970; border: 1px solid #C9A227;
          box-shadow: 0 2px 8px rgba(20,33,61,0.30);
          pointer-events: auto; user-select: none;
        }
        .canvasa-tutor__placeholder {
          max-width: 720px; margin: 24px auto 0; padding: 24px;
          background: var(--tutor-surface, rgba(255,255,255,0.7));
          border: 1px dashed var(--tutor-line, rgba(26,58,82,0.18));
          border-radius: var(--tutor-radius, 8px);
          font-size: 13px; color: var(--tutor-muted, #5a7c92); line-height: 1.6;
        }
        .canvasa-tutor__placeholder code {
          background: rgba(0,0,0,0.06); padding: 1px 6px; border-radius: 3px;
        }
      </style>
      <div class="canvasa-tutor__pill" title="Canvas A SDK version. Hard-refresh if outdated.">v${CANVASA_SDK_VERSION}</div>
      <section class="canvasa-tutor__hero">
        <h1>${escapeHtml(heroTitle)}</h1>
        <p>${escapeHtml(heroSub)}</p>
      </section>
      <div class="canvasa-tutor__placeholder">
        <strong>Canvas A SDK · Phase 1 scaffold.</strong><br>
        Tenant: <code>${escapeHtml(tenant)}</code> ·
        Brand config: ${this._brand ? '<code>loaded</code>' : '<code>pending</code>'} ·
        Version: <code>v${CANVASA_SDK_VERSION}</code><br>
        Phase 2 ports the full landing UI (3 tabs · Concept library · Problems · KaTeX · pagination) here.
      </div>
    `
  }

  private _markReady(): void {
    if (this._ready) return
    this._ready = true
    this.dispatchEvent(new CustomEvent('canvasa-ready', {
      detail: { version: CANVASA_SDK_VERSION, tenant: this._tenant() },
      bubbles: true, composed: true,
    }))
  }

  private _launch(kind: 'ask' | 'lesson', payload: Record<string, string>): void {
    // Fire the canvasa-launch event so hosts can intercept + route inline.
    const ev = new CustomEvent('canvasa-launch', {
      detail: { kind, payload }, bubbles: true, composed: true, cancelable: true,
    })
    const proceed = this.dispatchEvent(ev)
    if (!proceed) return  // host called preventDefault() — handle it themselves

    // Default: redirect to canvas-a backend's /tutor or /guide URL.
    const mode = payload.mode === 'guide' ? 'guide' : 'tutor'
    const path = mode === 'guide' ? '/guide' : '/tutor'
    const qs = new URLSearchParams()
    if (payload.lesson) qs.set('lesson', payload.lesson)
    if (payload.ask) qs.set('ask', payload.ask)
    qs.set('brand', this._tenant())
    if (typeof window !== 'undefined' && window.location) {
      qs.set('return', window.location.href)
      const target = this.getAttribute('lesson-target') || 'self'
      const url = `${getCanvasaHost()}${path}?${qs.toString()}`
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
}

// Tiny HTML escape helper to keep brand-config copy + slot content safe
// when we string-template into innerHTML.
function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c] as string))
}

// ───────────────────────────────────────────────────────────────────
// Registration helper — idempotent
// ───────────────────────────────────────────────────────────────────

export function registerCanvasaTutor(): void {
  if (typeof window === 'undefined') return
  if (window.customElements.get('canvasa-tutor')) return
  window.customElements.define('canvasa-tutor', CanvasaTutorElement)
}
