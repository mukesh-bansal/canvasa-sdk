# Canvas A SDK

Embeddable web components for the Canvas A AI Tutor. Drop a `<script>` tag, get `<canvasa-tutor>`, `<canvasa-chalkboard>`, etc. in any host — React, Vue, vanilla, any framework.

**Status:** v0.1.0-alpha.0 (Phase 1 scaffold). API stable in concept; not yet ready for production use. See the [phase plan](https://github.com/mukesh-bansal/physolympiad/blob/main/context/2026-05-19_canvasa_sdk_design.md) for the full roadmap.

## Quick start

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/@canvasa/sdk@0/dist/canvasa-sdk.js"></script>

<canvasa-tutor tenant="olympiz"></canvasa-tutor>
```

Or as an npm module:

```bash
npm i @canvasa/sdk
```

```ts
import '@canvasa/sdk'   // side-effect registers the custom elements

// then anywhere in your markup:
// <canvasa-tutor tenant="olympiz"></canvasa-tutor>
```

## The contract — what you customize

### CSS custom properties (theming)

Set on the element (or any ancestor). The SDK uses Light DOM + CSS variables, so host stylesheets reach the rendered tree.

```css
canvasa-tutor[tenant="capacity"] {
  --tutor-accent: #1b4d36;        /* forest green */
  --tutor-bg: #f7f3e8;            /* cream paper */
  --tutor-text: #14213D;
  --tutor-muted: #6e6c61;
  --tutor-radius: 12px;
  --tutor-font-head: 'Cormorant', serif;
  --tutor-font-body: 'Inter', sans-serif;
  --tutor-font-mono: 'JetBrains Mono', ui-monospace, monospace;
  --tutor-mark-url: url('/brand/capacity-mark.svg');
}
```

Unset properties fall back to the server-side `brand_configs/<tenant>.json` row. Unknown tenants fall back to `default.json`.

### Slots (copy overrides)

```html
<canvasa-tutor tenant="capacity">
  <span slot="hero-title">Time to grow.</span>
  <span slot="hero-sub">Drop a question.</span>
  <span slot="cta-label">Begin →</span>
  <span slot="empty-state">No matches — try a broader topic.</span>
</canvasa-tutor>
```

### Attributes (behavior config)

| Attribute | Type | Default | Notes |
|---|---|---|---|
| `tenant` | string | `"default"` | Brand config to load from `GET /api/brand/<tenant>` |
| `mode` | `landing` \| `embed` \| `compact` | `"landing"` | Layout density |
| `default-tab` | `ondemand` \| `concepts` \| `problems` | `"ondemand"` | Which tab is active on mount |
| `hide-tabs` | comma-list | `""` | e.g. `"concepts,problems"` to render on-demand only |
| `lesson` | slug | — | Pre-launch a cached lesson on mount (skips landing) |
| `ask` | topic | — | Pre-launch a live build (skips landing) |
| `problem-id` | po_id | — | Open a specific problem from the DB |
| `lesson-target` | `self` \| `blank` \| selector | `"self"` | Where to open the lesson runtime |
| `lesson-mode` | `teach` \| `guide` \| `picker` | `"picker"` | Default mode (or show a picker modal) |
| `katex-cdn` | URL or `"off"` | jsDelivr | Override KaTeX CDN |
| `debug` | `"1"` to enable | — | Console logs for development |

### Events

All bubble + composed, so host listeners attached anywhere up the tree receive them.

| Event | Detail | Fires when |
|---|---|---|
| `canvasa-ready` | `{ version, tenant }` | After mount + brand-config load |
| `canvasa-tab-change` | `{ tab }` | User switches tabs |
| `canvasa-lesson-click` | `{ slug, title, cached, mode, source }` | User clicks a lesson card |
| `canvasa-launch` | `{ kind, payload }` | Before navigation to `/tutor` or `/guide`. Cancelable via `preventDefault()` — host can route inline. |
| `canvasa-error` | `{ code, message, cause }` | Fetch / config errors |

```ts
const tutor = document.querySelector('canvasa-tutor') as HTMLElement
tutor.addEventListener('canvasa-lesson-click', (e: any) => {
  e.preventDefault()  // intercept default redirect
  myRouter.push(`/study/lesson/${e.detail.slug}`)
})
```

### Programmatic API

```ts
const tutor = document.querySelector('canvasa-tutor') as any
tutor.setTenant('capacity')           // re-theme dynamically
tutor.setTab('problems')              // jump to a tab
tutor.launchAsk('Bernoulli')          // open live build
tutor.launchLesson('lenz-s-law', { mode: 'guide' })
tutor.getBrandConfig()                // BrandConfig | null
await tutor.refresh()                 // re-fetch brand + data
```

## Modes — teach-me / guide-me

Canvas A has two first-class lesson modes:

- **teach-me** (walk-through) — `/tutor?lesson=<slug>`: linear, audio-narrated beats
- **guide-me** (figure-it-out) — `/guide?lesson=<slug>`: Socratic, hints + checkpoints

Default click flow shows a picker modal. Override with `lesson-mode="teach"` or `lesson-mode="guide"` on the element to skip the picker.

## Tenants

Brand identity is server-side data, not code. Adding a tenant = adding a JSON row in `data/brand_configs/<tenant>.json` on the Canvas A backend. No SDK release needed.

Today's seeded tenants:
- `default` — generic Canvas A
- `olympiz` — gold accent, Instrument Serif
- `capacity` — forest+amber, Cormorant *(alias: `superstem` redirects here)*
- `fermi` — claret

## Phase roadmap

| Phase | What ships |
|---|---|
| 1 ✅ | Scaffold + `<canvasa-tutor>` shell + API contract |
| 2 | Port full landing UI (3 tabs, lazy-render, KaTeX, pagination) |
| 3 | Brand config service on Canvas A backend |
| 4 | Olympiz migrates from iframe to `<canvasa-tutor>` |
| 5 | Capacity adopts via `<canvasa-tutor tenant="capacity">` |
| 6 | `<canvasa-chalkboard>` — lesson runtime as a custom element |
| 7 | Future capabilities — problem-walker, skill-tree, coach-chat |

Design doc: [`07_Physics_Olympiad/context/2026-05-19_canvasa_sdk_design.md`](https://github.com/mukesh-bansal/physolympiad).

## Related

- **Canvas A backend** — `07_Physics_Olympiad/scripts/server.py` (FastAPI, on EC2). Endpoints: `/api/library-topics`, `/api/problems-library`, `/api/brand/<tenant>` (Phase 3), `/tutor`, `/guide`, `/embed`.
- **canvasa-tutor-react** — older React-specific binding. Will be deprecated after Phase 5.

## License

UNLICENSED (private). Contact Mukesh Bansal.
