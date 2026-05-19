/**
 * Canvas A SDK — public entry.
 *
 * Importing this module (or loading the CDN script) registers all Canvas A
 * custom elements on the page. Each element is independently usable.
 *
 * Live now:
 *   <canvasa-tutor tenant="<id>">                — AI Tutor landing
 *   <canvasa-chalkboard lesson="<slug>" mode="…"> — embedded lesson runtime
 *
 * Stub now → live in v0.3 (Phase 7 — backends in progress; the tag exists
 * today and fires `canvasa-ready` with status:'stub' so hosts can wire up
 * listeners + fallbacks):
 *   <canvasa-problem-walker problem="<slug|po_id>">
 *   <canvasa-skill-tree domain="<id>">
 *   <canvasa-coach-chat>
 *
 * Each stub element documents its planned attribute + event contract in
 * its module header — see src/elements/canvasa-*.ts for details.
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
// Self-registering elements (side-effect imports — see each file).
import './elements/canvasa-chalkboard'
import './elements/canvasa-problem-walker'
import './elements/canvasa-skill-tree'
import './elements/canvasa-coach-chat'
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
export { CanvasaProblemWalkerElement } from './elements/canvasa-problem-walker'
export { CanvasaSkillTreeElement } from './elements/canvasa-skill-tree'
export { CanvasaCoachChatElement } from './elements/canvasa-coach-chat'
