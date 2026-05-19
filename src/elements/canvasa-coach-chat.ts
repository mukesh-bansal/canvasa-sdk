/**
 * <canvasa-coach-chat host="..." voice="on|off" topic-context="...">
 *
 * **STATUS: STUB (SDK Phase 7).** The streaming chat backend for the
 * coach persona is not built yet. The Canvas A lesson runtime has scoped
 * narration, but a free-form coach chat that travels with the student
 * across surfaces (landing → lesson → problem walker) is its own service.
 * This element is registered today so hosts can wire the tags + listeners;
 * it renders a "Coming in v0.3" placeholder and emits `canvasa-ready` with
 * `{ status: 'stub' }`.
 *
 * Planned final contract:
 *
 * Attributes (all reactive):
 *   host             — Canvas A backend origin (default canvasa.olympiz.ai)
 *   tenant           — brand slug
 *   voice            — 'on' (default — full audio + STT) | 'off' (text-only)
 *   topic-context    — optional. Pre-seed the coach with a topic
 *                      (e.g. "Lagrangian mechanics") so the first message is
 *                      already on-context. Doesn't auto-send anything; the
 *                      student types or speaks first.
 *   user-id          — optional. Enables conversation memory across sessions.
 *   open             — boolean attr. When present the chat is expanded; when
 *                      absent it renders as a launcher button.
 *
 * Events (DOM CustomEvent, bubbles + composed):
 *   canvasa-ready             — { version, status: 'stub' | 'live' }
 *   canvasa-coach-message     — { role: 'student' | 'coach', text,
 *                                 attachments?, timestamp }
 *   canvasa-coach-action      — { action: 'open-lesson' | 'open-problem' |
 *                                 'open-skill-tree', payload }
 *                                 — the coach can hand off to other SDK
 *                                 elements; hosts intercept to navigate
 *   canvasa-error             — { code, message, cause }
 *
 * Backend dependencies (TBD):
 *   POST /api/coach/chat (SSE stream)  — primary chat endpoint
 *   POST /api/coach/voice-turn         — STT + audio response
 *   GET  /api/coach/history/<user-id>  — conversation memory
 *
 * Where this fits in the SDK roadmap: ships as SDK v0.3.
 */

import { CanvasaStubElement, type StubMetadata } from './placeholder'

class CanvasaCoachChatElement extends CanvasaStubElement {
  static get observedAttributes(): string[] {
    return ['host', 'tenant', 'voice', 'topic-context', 'user-id', 'open']
  }

  protected _stubMeta(): StubMetadata {
    return {
      capability: 'Coach chat',
      plannedVersion: 'v0.3',
      description:
        'Free-form text + voice chat with the Canvas A coach. Travels with the student across lesson / problem walker / skill tree, hands off to those surfaces via canvasa-coach-action events. Wire up the listener today; it fires once the streaming backend ships.',
      docsHref: 'https://github.com/mukesh-bansal/canvasa-sdk#canvasa-coach-chat',
    }
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('canvasa-coach-chat')) {
  customElements.define('canvasa-coach-chat', CanvasaCoachChatElement)
}

export { CanvasaCoachChatElement }
