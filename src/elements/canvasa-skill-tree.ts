/**
 * <canvasa-skill-tree domain="<mechanics|em|thermo|...>" level="HS|UG|G">
 *
 * **STATUS: STUB (SDK Phase 7).** The concept-graph backend exists today
 * (cmap_canonical PG, 2,729 concepts) but the user-progress overlay + the
 * tree-visualization renderer are not yet shipped. This element is registered
 * now so hosts can mount the tag; it renders a "Coming in v0.3" placeholder
 * card and emits `canvasa-ready` with `{ status: 'stub' }`.
 *
 * Planned final contract:
 *
 * Attributes (all reactive):
 *   domain        — required, e.g. 'mechanics', 'em', 'thermo', 'qm',
 *                   'mathematics'. Matches Canvas A's section taxonomy.
 *   level         — 'HS' | 'UG' | 'G' | 'all'. Filters the tree by depth.
 *   host          — Canvas A backend origin (default canvasa.olympiz.ai)
 *   tenant        — brand slug
 *   user-id       — optional. Pulls the user's progress overlay from
 *                   /api/skill-tree/<user-id>; without it the tree is shown
 *                   in catalog mode (no completion state).
 *   compact       — boolean attr. Renders as a tight list rather than the
 *                   default radial / hierarchical visualization.
 *   highlight     — comma-separated list of concept slugs to draw with
 *                   accent color (e.g. "kinematics,momentum").
 *
 * Events (DOM CustomEvent, bubbles + composed):
 *   canvasa-ready          — { version, status: 'stub' | 'live', nodeCount }
 *   canvasa-skill-click    — { slug, label, level, completed }
 *   canvasa-skill-expand   — { slug, openChildren: number }
 *   canvasa-skill-collapse — { slug }
 *   canvasa-error          — { code, message, cause }
 *
 * Backend dependencies:
 *   GET /api/concept-graph                    — exists (cmap_api.service:8773)
 *   GET /api/skill-tree/<user-id>             — TBD: user-progress overlay
 *   GET /api/skill-tree/recommend/<user-id>   — TBD: suggested next concepts
 *
 * Where this fits in the SDK roadmap: ships as SDK v0.3.
 */

import { CanvasaStubElement, type StubMetadata } from './placeholder'

class CanvasaSkillTreeElement extends CanvasaStubElement {
  static get observedAttributes(): string[] {
    return ['domain', 'level', 'host', 'tenant', 'user-id', 'compact', 'highlight']
  }

  protected _stubMeta(): StubMetadata {
    return {
      capability: 'Skill tree',
      plannedVersion: 'v0.3',
      description:
        'Concept-graph visualization with user-progress overlay. Highlights mastered nodes, surfaces suggested next concepts, drills into any node to launch the relevant lesson or problem walker. Wire up the click listener today; it fires once the renderer ships.',
      docsHref: 'https://github.com/mukesh-bansal/canvasa-sdk#canvasa-skill-tree',
    }
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('canvasa-skill-tree')) {
  customElements.define('canvasa-skill-tree', CanvasaSkillTreeElement)
}

export { CanvasaSkillTreeElement }
