/**
 * Stub base class for future SDK elements (Phase 7).
 *
 * Renders a tasteful "Coming soon" placeholder card themed by the host's
 * --tutor-* CSS custom properties. Subclasses set capability label + planned
 * release tag. All stubs fire `canvasa-ready` with `{ status: 'stub' }` on
 * connect so hosts can detect and provide their own fallback if needed.
 *
 * Why ship stubs now:
 *   - Hosts can wire up the tags + event listeners today; they'll light up
 *     when the backend lands without a host code change.
 *   - The SDK advertises its full capability surface even before every
 *     implementation is complete — easier for integrators to plan.
 *   - Tests can assert the elements exist and emit the documented events.
 */

import { CANVASA_SDK_VERSION } from '../version'

export type StubMetadata = {
  capability: string
  plannedVersion: string
  description: string
  docsHref?: string
}

export abstract class CanvasaStubElement extends HTMLElement {
  protected abstract _stubMeta(): StubMetadata

  connectedCallback(): void {
    if (!this.isConnected) return
    this._renderStub()
    // Defer ready event by a tick so listeners attached in the same tick
    // (e.g. React effects that addEventListener after render) catch it.
    queueMicrotask(() => {
      this.dispatchEvent(new CustomEvent('canvasa-ready', {
        bubbles: true,
        composed: true,
        detail: {
          version: CANVASA_SDK_VERSION,
          status: 'stub',
          capability: this._stubMeta().capability,
          plannedVersion: this._stubMeta().plannedVersion,
        },
      }))
    })
  }

  private _renderStub(): void {
    while (this.firstChild) this.removeChild(this.firstChild)
    if (!this.style.display) this.style.display = 'block'

    const meta = this._stubMeta()
    const card = document.createElement('div')
    card.setAttribute('part', 'stub-card')
    card.style.cssText = [
      'padding:32px',
      'border-radius:14px',
      'background:var(--tutor-hero-bg, linear-gradient(135deg, #0b1e2c 0%, #163a52 100%))',
      'color:var(--tutor-hero-fg, #f3f6fb)',
      'font:14px/1.6 -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      'text-align:left',
      'box-shadow:0 2px 18px rgba(0,0,0,0.18)',
    ].join(';')

    const tag = document.createElement('div')
    tag.style.cssText = 'display:inline-block; font-size:11px; letter-spacing:0.12em; text-transform:uppercase; opacity:0.7; margin-bottom:8px;'
    tag.textContent = `Canvas A SDK · ${meta.capability}`
    card.appendChild(tag)

    const title = document.createElement('div')
    title.style.cssText = 'font-size:20px; font-weight:600; margin-bottom:6px; color:var(--tutor-accent, currentColor);'
    title.textContent = `Coming in ${meta.plannedVersion}`
    card.appendChild(title)

    const desc = document.createElement('div')
    desc.style.cssText = 'opacity:0.85; max-width:60ch;'
    desc.textContent = meta.description
    card.appendChild(desc)

    if (meta.docsHref) {
      const link = document.createElement('a')
      link.href = meta.docsHref
      link.target = '_blank'
      link.rel = 'noopener'
      link.textContent = 'Read the contract →'
      link.style.cssText = 'display:inline-block; margin-top:14px; color:var(--tutor-accent, #f6d77a); text-decoration:none; font-size:13px;'
      card.appendChild(link)
    }

    this.appendChild(card)
  }
}
