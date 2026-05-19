/**
 * Canvas A SDK — public entry.
 *
 * Importing this module (or loading the CDN script) registers all Canvas A
 * custom elements on the page. Each element is independently usable.
 *
 * Available v1:
 *   <canvasa-tutor tenant="<id>">                — AI Tutor landing
 *   <canvasa-chalkboard lesson="<slug>" mode="…"> — embedded lesson runtime
 *
 * Coming in v2:
 *   <canvasa-problem-walker>
 *
 * Coming in v3:
 *   <canvasa-skill-tree>
 *   <canvasa-coach-chat>
 *
 * Theming + config contract:
 *   - CSS custom properties (--tutor-accent, --tutor-bg, --tutor-font-*, …)
 *   - Slots for copy overrides (slot="hero-title", slot="hero-sub", …)
 *   - Attribute config (tenant, mode, hide-tabs, lesson-target, debug, …)
 *   - JS programmatic API (el.setTenant(...), el.launch(...), …)
 *   - Events (canvasa-ready, canvasa-lesson-click, canvasa-tab-change, …)
 *
 * The full contract is in the repo README. This file just wires the elements
 * into the registry — registration is side-effectful so simply importing
 * the package is enough to enable the tags.
 */
import { registerCanvasaTutor } from './elements/canvasa-tutor'
// canvasa-chalkboard self-registers via module side-effect (see file).
import './elements/canvasa-chalkboard'
import { CANVASA_SDK_VERSION } from './version'

// Side-effect: register custom elements on first import / script load.
// Safe to call multiple times — each register* helper checks customElements.get().
registerCanvasaTutor()

// Expose the version + a tiny global handle for debug + ops visibility.
// (Hosts can `console.log(window.canvasa.version)` to check what's loaded.)
declare global {
  interface Window {
    canvasa?: {
      version: string
      // Future: handles to registered element classes for advanced introspection.
    }
  }
}
if (typeof window !== 'undefined') {
  window.canvasa = window.canvasa ?? { version: CANVASA_SDK_VERSION }
}

export { CANVASA_SDK_VERSION }
export type { CanvasaTutorElement, CanvasaTutorEventMap } from './elements/canvasa-tutor'
export { CanvasaChalkboardElement } from './elements/canvasa-chalkboard'
