/**
 * <canvasa-chalkboard lesson="..." mode="teach"> — embeddable Canvas A lesson
 * runtime.
 *
 * Phase 6 of the SDK rollout. The actual lesson player (audio cues, beat-by-
 * beat narration, scrubber, KaTeX-rendered scenes) is ~8000 lines of inline
 * HTML/JS served by FastAPI at `canvasa.olympiz.ai/tutor?lesson=<slug>` (and
 * `/guide?lesson=<slug>` for the Figure-It-Out mode). Porting all of that
 * into a native custom element is a significant project; the right shape for
 * Phase 6 is a **thin wrapper** that mounts the production chalkboard inside
 * an iframe and exposes the SDK's attribute + event contract.
 *
 * Why this is good enough as a v1:
 *   - Hosts get a stable `<canvasa-chalkboard>` API today.
 *   - The implementation can swap from iframe → native rendering in a future
 *     SDK version without changing any consumer code.
 *   - Iframe isolation is actually desirable for the chalkboard — audio
 *     context, KaTeX font-face hoisting, scrubber CSS — staying scoped to
 *     a child document avoids host-CSS bleed.
 *
 * Attributes (all reactive):
 *   lesson       — the lesson slug. Required.
 *   mode         — 'teach' (default, hits /tutor) or 'guide' (hits /guide).
 *   host         — Canvas A backend origin. Default https://canvasa.olympiz.ai.
 *   tenant       — Brand slug, forwarded as ?brand=<tenant>. Default 'default'.
 *   return-url   — Forwarded as ?return=<url> so the chalkboard's Home button
 *                  points back to the host. Optional.
 *
 * Events (DOM CustomEvent, bubbles + composed):
 *   canvasa-ready              — iframe document fired its load event
 *   canvasa-chalkboard-close   — child posted 'canvasa:close' (e.g. user clicks
 *                                the chalkboard's Home button when no return-url
 *                                was set, current chalkboard does not yet emit
 *                                this — future-proofed)
 *   canvasa-chalkboard-complete— child posted 'canvasa:lesson-complete' (also
 *                                future-proofed; emits when present)
 *   canvasa-error              — iframe failed to load
 *
 * Slot: none (the chalkboard fills 100% of the host element).
 */

import { CANVASA_SDK_VERSION } from '../version'

const DEFAULT_HOST = 'https://canvasa.olympiz.ai'
const DEFAULT_TENANT = 'default'

class CanvasaChalkboardElement extends HTMLElement {
  static get observedAttributes(): string[] {
    return ['lesson', 'mode', 'host', 'tenant', 'return-url']
  }

  private _iframe: HTMLIFrameElement | null = null
  private _onMessage = this._handleMessage.bind(this)
  private _ready = false

  connectedCallback(): void {
    if (!this.isConnected) return
    this._render()
    window.addEventListener('message', this._onMessage)
  }

  disconnectedCallback(): void {
    window.removeEventListener('message', this._onMessage)
    this._iframe = null
    this._ready = false
  }

  attributeChangedCallback(): void {
    if (this.isConnected) this._render()
  }

  /** Read the current iframe URL — useful for hosts that want to deep-link. */
  get currentUrl(): string {
    return this._buildUrl()
  }

  private _buildUrl(): string {
    const host = (this.getAttribute('host') || DEFAULT_HOST).replace(/\/$/, '')
    const mode = (this.getAttribute('mode') || 'teach').toLowerCase()
    const path = mode === 'guide' ? '/guide' : '/tutor'
    const lesson = (this.getAttribute('lesson') || '').trim()
    const tenant = (this.getAttribute('tenant') || DEFAULT_TENANT).trim()
    const returnUrl = (this.getAttribute('return-url') || '').trim()
    const qs = new URLSearchParams()
    if (lesson) qs.set('lesson', lesson)
    qs.set('brand', tenant)
    if (returnUrl) qs.set('return', returnUrl)
    return `${host}${path}?${qs.toString()}`
  }

  private _render(): void {
    const lesson = (this.getAttribute('lesson') || '').trim()
    if (!lesson) {
      this._renderError('Missing required attribute `lesson` on <canvasa-chalkboard>.')
      return
    }

    const url = this._buildUrl()

    if (this._iframe) {
      if (this._iframe.src !== url) {
        this._ready = false
        this._iframe.src = url
      }
      return
    }

    // Reset host element layout once (so the iframe fills it).
    if (!this.style.position) this.style.position = 'relative'
    if (!this.style.display) this.style.display = 'block'
    if (!this.style.width) this.style.width = '100%'
    if (!this.style.minHeight) this.style.minHeight = '600px'

    // Clear any previous content (e.g., from a prior error state).
    while (this.firstChild) this.removeChild(this.firstChild)

    const iframe = document.createElement('iframe')
    iframe.src = url
    iframe.title = 'Canvas A — Lesson'
    iframe.setAttribute('allow', 'autoplay; microphone; clipboard-write')
    iframe.setAttribute('allowfullscreen', '')
    iframe.style.cssText = 'width:100%; height:100%; min-height:inherit; border:0; display:block; background:#0d1620;'
    iframe.addEventListener('load', () => {
      this._ready = true
      this.dispatchEvent(new CustomEvent('canvasa-ready', {
        bubbles: true,
        composed: true,
        detail: { version: CANVASA_SDK_VERSION, lesson, mode: this.getAttribute('mode') || 'teach' },
      }))
    })
    iframe.addEventListener('error', () => {
      this.dispatchEvent(new CustomEvent('canvasa-error', {
        bubbles: true,
        composed: true,
        detail: { code: 'chalkboard-load-failed', message: 'Iframe failed to load', cause: { url } },
      }))
    })
    this.appendChild(iframe)
    this._iframe = iframe
  }

  private _renderError(message: string): void {
    while (this.firstChild) this.removeChild(this.firstChild)
    const box = document.createElement('div')
    box.style.cssText = 'padding:24px; font:14px/1.5 -apple-system,BlinkMacSystemFont,sans-serif; color:#c44; background:#fff2f2; border:1px solid #e88; border-radius:6px;'
    box.textContent = message
    this.appendChild(box)
    this.dispatchEvent(new CustomEvent('canvasa-error', {
      bubbles: true,
      composed: true,
      detail: { code: 'chalkboard-config', message, cause: null },
    }))
  }

  private _handleMessage(ev: MessageEvent): void {
    // Only trust messages from the iframe we own.
    if (!this._iframe || ev.source !== this._iframe.contentWindow) return
    const data = ev.data
    if (!data || typeof data !== 'object') return
    const t = (data as { type?: string }).type
    if (t === 'canvasa:close' || t === 'canvas-a:close') {
      this.dispatchEvent(new CustomEvent('canvasa-chalkboard-close', {
        bubbles: true, composed: true, detail: data,
      }))
    } else if (t === 'canvasa:lesson-complete') {
      this.dispatchEvent(new CustomEvent('canvasa-chalkboard-complete', {
        bubbles: true, composed: true, detail: data,
      }))
    } else if (t === 'canvasa:ready' && !this._ready) {
      // Some chalkboard builds post their own ready event; honour it.
      this._ready = true
      this.dispatchEvent(new CustomEvent('canvasa-ready', {
        bubbles: true, composed: true, detail: data,
      }))
    }
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('canvasa-chalkboard')) {
  customElements.define('canvasa-chalkboard', CanvasaChalkboardElement)
}

export { CanvasaChalkboardElement }
