/**
 * <canvasa-problem-walker problem="<slug|po_id>" mode="practice|exam">
 *
 * **STATUS: STUB (SDK Phase 7).** The backend for the problem walker (a
 * single-problem deep-dive with progressive hints, step-by-step solution,
 * inline AI tutor chat scoped to the problem) is not built yet. This element
 * is registered today so hosts can wire up the tags + event listeners; it
 * renders a "Coming in v0.3" placeholder card themed by the host's brand
 * tokens and emits `canvasa-ready` with `{ status: 'stub' }` so hosts can
 * detect and fall back.
 *
 * Planned final contract:
 *
 * Attributes (all reactive):
 *   problem     — required, the problem slug or po_id
 *   host        — Canvas A backend origin (default canvasa.olympiz.ai)
 *   tenant      — brand slug
 *   mode        — 'practice' (default — full guidance) or 'exam' (no hints,
 *                 grades on submit only)
 *   level       — 'HS' | 'UG' | 'G' | 'olympiad' (used to tailor solution depth)
 *   return-url  — forwarded to backend so the "Back" button points to host
 *
 * Events (DOM CustomEvent, bubbles + composed):
 *   canvasa-ready            — { version, status: 'stub' | 'live' }
 *   canvasa-hint-revealed    — { hintIndex, hintText }
 *   canvasa-step-complete    — { stepNum, correct, attempts }
 *   canvasa-problem-complete — { stepsAttempted, correct, totalSteps, elapsedMs }
 *   canvasa-chat-message     — { role: 'student' | 'coach', text, attachments? }
 *   canvasa-error            — { code, message, cause }
 *
 * Backend dependencies (TBD):
 *   GET  /api/problems/<id>       — single-problem fetch (exists today)
 *   POST /api/walker/start        — TBD: create a walker session for the problem
 *   GET  /api/walker/<sid>/hints  — TBD: progressive hint reveal
 *   POST /api/walker/<sid>/step   — TBD: submit a step + get grader feedback
 *   POST /api/walker/<sid>/chat   — TBD: scoped tutor chat
 *
 * Where this fits in the SDK roadmap: ships as SDK v0.3.
 */

import { CanvasaStubElement, type StubMetadata } from './placeholder'

class CanvasaProblemWalkerElement extends CanvasaStubElement {
  static get observedAttributes(): string[] {
    return ['problem', 'host', 'tenant', 'mode', 'level', 'return-url']
  }

  protected _stubMeta(): StubMetadata {
    return {
      capability: 'Problem walker',
      plannedVersion: 'v0.3',
      description:
        'Single-problem deep-dive — progressive hints, step-by-step solution, inline AI tutor chat scoped to this problem. Wire up the listeners today; they fire once the backend ships.',
      docsHref: 'https://github.com/mukesh-bansal/canvasa-sdk#canvasa-problem-walker',
    }
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('canvasa-problem-walker')) {
  customElements.define('canvasa-problem-walker', CanvasaProblemWalkerElement)
}

export { CanvasaProblemWalkerElement }
