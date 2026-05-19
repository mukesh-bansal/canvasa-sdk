const S = "0.1.0-alpha.4";
let U = "https://canvasa.olympiz.ai", L = "default";
function j(i) {
  i.host && (U = i.host.replace(/\/$/, "")), i.tenant && (L = i.tenant);
}
function P(i, t) {
  const e = new URL(`${U}/api${i}`);
  if (t)
    for (const [r, n] of Object.entries(t))
      n != null && n !== "" && e.searchParams.set(r, String(n));
  return e.toString();
}
async function _(i, t) {
  const e = await fetch(P(i, t), {
    headers: { "X-Tutor-Tenant": L, Accept: "application/json" },
    credentials: "omit"
  });
  if (!e.ok) throw new Error(`canvasa-api ${i} HTTP ${e.status}`);
  return await e.json();
}
async function B(i, t) {
  const e = await fetch(P(i), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Tutor-Tenant": L,
      Accept: "application/json"
    },
    body: JSON.stringify(t),
    credentials: "omit"
  });
  if (!e.ok) throw new Error(`canvasa-api ${i} HTTP ${e.status}`);
  return await e.json();
}
async function D(i, t) {
  const e = await fetch(P(i), {
    method: "POST",
    headers: { "X-Tutor-Tenant": L, Accept: "application/json" },
    body: t,
    credentials: "omit"
  });
  if (!e.ok) throw new Error(`canvasa-api ${i} HTTP ${e.status}`);
  return await e.json();
}
const x = {
  inventoryCounts: () => _("/inventory-counts"),
  // Heavy legacy endpoints — kept for back-compat with older SDK clients
  // pinned to a tag. New code MUST use the headers + section variants below.
  libraryTopics: () => _("/library-topics"),
  problemsLibrary: () => _("/problems-library"),
  // Phase 8 — lazy-load endpoints. headers: KB. section: ~5-15 KB per page.
  libraryTopicHeaders: () => _("/library-topics/headers"),
  libraryTopicSection: (i, t = 0, e = 30, r = "all", n = "") => _("/library-topics/section", {
    name: i,
    offset: t,
    limit: e,
    level: r,
    q: n
  }),
  problemsLibraryHeaders: () => _("/problems-library/headers"),
  problemsLibrarySection: (i, t = 0, e = 30, r = "all", n = "") => _("/problems-library/section", {
    name: i,
    offset: t,
    limit: e,
    level: r,
    q: n
  }),
  generateLesson: (i) => B("/generate-lesson", { topic: i }),
  generateFromUrl: (i, t) => B("/generate-from-url", { url: i, title: t }),
  generateFromPdf: (i) => {
    const t = new FormData();
    return t.append("file", i), D("/generate-from-pdf", t);
  },
  lessonStatus: (i) => _(`/lesson-status/${encodeURIComponent(i)}`),
  wikiSearch: (i) => _("/wiki-opensearch", { q: i }),
  superstemSearch: (i) => _("/superstem-search", { q: i }),
  // Phase 3 endpoint — graceful fallback handled in canvasa-tutor.ts when missing
  brand: (i) => _(`/brand/${encodeURIComponent(i)}`)
}, F = ':root,.tutor-root{--tutor-bg: #fbfaf6;--tutor-surface: #ffffff;--tutor-surface-soft: #f6f4ee;--tutor-text: #1a1a2e;--tutor-muted: #4a4a5a;--tutor-faint: #8b8b9b;--tutor-border: #e7ecf3;--tutor-border-soft: #efefe7;--tutor-accent: #c9a227;--tutor-accent-soft: rgba(201, 162, 39, .12);--tutor-accent-strong:#8f7016;--tutor-on-accent: #14213d;--tutor-primary: #14213d;--tutor-primary-hover:#0a162b;--tutor-on-primary: #ffffff;--tutor-success: #047857;--tutor-warning: #b45309;--tutor-danger: #b91c1c;--tutor-radius: 12px;--tutor-radius-sm: 8px;--tutor-radius-lg: 18px;--tutor-font-display: "Playfair Display", Georgia, serif;--tutor-font-body: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;--tutor-font-mono: "JetBrains Mono", ui-monospace, monospace;--tutor-shadow-sm: 0 1px 3px rgba(0,0,0,.04);--tutor-shadow: 0 4px 14px rgba(0,0,0,.06)}.tutor-page{max-width:1100px;margin:0 auto;padding:32px 16px 64px;font-family:var(--tutor-font-body);color:var(--tutor-text);background:var(--tutor-bg)}.tutor-hero{text-align:center;margin-bottom:40px}.tutor-hero h1{font-family:var(--tutor-font-display);font-size:clamp(2rem,4vw,3rem);line-height:1.15;margin:0 0 8px;color:var(--tutor-text);font-weight:700}.tutor-hero h1 em{color:var(--tutor-accent-strong);font-style:italic}.tutor-hero p{color:var(--tutor-muted);font-size:1.05rem;margin:0}.tutor-tabs{display:flex;flex-wrap:wrap;gap:24px;border-bottom:1px solid var(--tutor-border);margin-bottom:24px}.tutor-tab{background:transparent;border:none;border-bottom:2px solid transparent;margin-bottom:-1px;padding:10px 0;font:inherit;color:var(--tutor-muted);cursor:pointer;font-size:.95rem;white-space:nowrap;transition:color .15s,border-color .15s}.tutor-tab:hover{color:var(--tutor-text)}.tutor-tab.is-active{color:var(--tutor-text);border-bottom-color:var(--tutor-accent-strong);font-weight:500}.tutor-tab__count{color:var(--tutor-muted);font-size:.78rem;margin-left:4px;font-weight:400}.tutor-section{background:var(--tutor-surface);border:1px solid var(--tutor-border);border-radius:var(--tutor-radius);padding:20px 22px;margin-bottom:16px;box-shadow:var(--tutor-shadow-sm)}.tutor-section h2{font-family:var(--tutor-font-display);font-size:1.35rem;font-weight:600;margin:0 0 12px;color:var(--tutor-text)}.tutor-section h3{font-family:var(--tutor-font-display);font-size:1.05rem;font-weight:500;margin:0 0 8px;color:var(--tutor-text);display:flex;align-items:center;gap:8px}.tutor-section__sub{font-size:.78rem;color:var(--tutor-muted);margin:-8px 0 14px}.tutor-input{display:block;width:100%;padding:12px 14px;border-radius:var(--tutor-radius-sm);border:1px solid var(--tutor-border);background:var(--tutor-surface);color:var(--tutor-text);font:inherit;font-size:.95rem;transition:border-color .15s,box-shadow .15s}.tutor-input::placeholder{color:var(--tutor-faint)}.tutor-input:focus{outline:none;border-color:var(--tutor-accent-strong);box-shadow:0 0 0 3px var(--tutor-accent-soft)}.tutor-input--sm{padding:8px 12px;font-size:.9rem}.tutor-row{display:flex;gap:10px;flex-wrap:wrap}@media (min-width: 640px){.tutor-row{flex-wrap:nowrap}}.tutor-row>.tutor-input{flex:1 1 auto}.tutor-btn{display:inline-flex;align-items:center;justify-content:center;padding:12px 22px;border-radius:var(--tutor-radius-sm);border:1px solid transparent;background:var(--tutor-primary);color:var(--tutor-on-primary);font:inherit;font-weight:500;cursor:pointer;white-space:nowrap;transition:background .15s,opacity .15s}.tutor-btn:hover:not(:disabled){background:var(--tutor-primary-hover)}.tutor-btn:disabled{opacity:.5;cursor:not-allowed}.tutor-chip{display:inline-flex;align-items:center;padding:6px 12px;border-radius:999px;border:1px solid var(--tutor-border);background:var(--tutor-surface);color:var(--tutor-muted);font:inherit;font-size:.78rem;font-weight:500;cursor:pointer;white-space:nowrap;transition:all .15s}.tutor-chip:hover{border-color:var(--tutor-accent-strong);color:var(--tutor-text)}.tutor-chip.is-active{background:var(--tutor-primary);color:var(--tutor-on-primary);border-color:var(--tutor-primary)}.tutor-sources{display:grid;grid-template-columns:1fr;gap:10px;margin-bottom:14px}@media (min-width: 720px){.tutor-sources{grid-template-columns:1fr 1fr 1fr}}.tutor-source{text-align:left;padding:12px 14px;border-radius:var(--tutor-radius-sm);border:2px solid var(--tutor-border);background:var(--tutor-surface);font:inherit;color:var(--tutor-text);cursor:pointer;transition:border-color .15s,background .15s}.tutor-source:hover{border-color:var(--tutor-accent-strong)}.tutor-source.is-active{border-color:var(--tutor-accent-strong);background:var(--tutor-accent-soft)}.tutor-source__row{display:flex;gap:10px;align-items:flex-start}.tutor-source__dot{width:12px;height:12px;border-radius:50%;border:2px solid var(--tutor-border);margin-top:4px;flex-shrink:0}.tutor-source.is-active .tutor-source__dot{border-color:var(--tutor-accent-strong);background:var(--tutor-accent-strong)}.tutor-source__lbl{font-weight:500;font-size:.9rem}.tutor-source__sub{font-size:.78rem;color:var(--tutor-muted);margin-top:2px}.tutor-results{margin-top:12px;border:1px solid var(--tutor-border);border-radius:var(--tutor-radius-sm);background:var(--tutor-bg);overflow:hidden}.tutor-result{display:block;width:100%;text-align:left;padding:12px 14px;border:none;background:transparent;font:inherit;color:var(--tutor-text);cursor:pointer;transition:background .12s;border-bottom:1px solid var(--tutor-border)}.tutor-result:last-child{border-bottom:none}.tutor-result:hover{background:var(--tutor-surface-soft)}.tutor-result__title{font-size:.9rem;font-weight:500}.tutor-result__blurb{font-size:.78rem;color:var(--tutor-muted);margin-top:2px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}.tutor-hint{font-size:.72rem;color:var(--tutor-muted);margin-top:12px}.tutor-drop{border:2px dashed var(--tutor-border);background:var(--tutor-bg);border-radius:var(--tutor-radius-sm);padding:32px 16px;text-align:center;cursor:pointer;transition:border-color .15s,background .15s}.tutor-drop:hover{border-color:var(--tutor-accent-strong)}.tutor-drop.is-hover{border-color:var(--tutor-accent-strong);background:var(--tutor-accent-soft)}.tutor-drop__icon{font-size:1.6rem;margin-bottom:8px}.tutor-drop__hint{color:var(--tutor-text);font-size:.92rem}.tutor-drop__hint strong{color:var(--tutor-accent-strong)}.tutor-card-grid{display:grid;grid-template-columns:1fr;gap:10px}@media (min-width: 720px){.tutor-card-grid{grid-template-columns:1fr 1fr}}@media (min-width: 1024px){.tutor-card-grid{grid-template-columns:1fr 1fr 1fr}}.tutor-card{display:block;padding:12px 14px;border-radius:var(--tutor-radius-sm);border:1px solid var(--tutor-border);background:var(--tutor-bg);color:var(--tutor-text);text-decoration:none;transition:border-color .15s,box-shadow .15s}.tutor-card:hover{border-color:var(--tutor-accent-strong);box-shadow:var(--tutor-shadow-sm)}.tutor-card__title{font-size:.9rem}.tutor-card__meta{margin-top:6px;display:flex;gap:10px;font-size:.7rem;color:var(--tutor-muted);align-items:center}.tutor-card__cached{color:var(--tutor-success)}.tutor-prob{display:block;padding:12px 14px;border-radius:var(--tutor-radius-sm);border:1px solid var(--tutor-border);background:var(--tutor-bg);color:var(--tutor-text);text-decoration:none;margin-bottom:8px;transition:border-color .15s,box-shadow .15s}.tutor-prob:hover{border-color:var(--tutor-accent-strong);box-shadow:var(--tutor-shadow-sm)}.tutor-prob__head{display:flex;flex-wrap:wrap;gap:8px;align-items:center}.tutor-prob__title{font-size:.9rem;font-weight:500}.tutor-prob__statement{margin-top:6px;font-size:.78rem;color:var(--tutor-muted);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}.tutor-pill{font-size:.62rem;padding:2px 6px;border-radius:4px;border:1px solid var(--tutor-border);background:var(--tutor-surface);color:var(--tutor-muted);text-transform:lowercase;letter-spacing:.04em}.tutor-pill--easy{color:var(--tutor-success);border-color:#0478574d}.tutor-pill--medium{color:var(--tutor-warning);border-color:#b453094d}.tutor-pill--hard{color:var(--tutor-danger);border-color:#b91c1c4d}.tutor-status{margin-top:12px;font-size:.85rem;color:var(--tutor-muted)}.tutor-status--error{color:var(--tutor-danger)}.tutor-empty{font-size:.88rem;color:var(--tutor-muted);padding:12px 0}.tutor-modal-backdrop{position:fixed;top:0;right:0;bottom:0;left:0;z-index:9000;display:flex;align-items:center;justify-content:center;padding:16px;background:#0d122073;-webkit-backdrop-filter:blur(3px);backdrop-filter:blur(3px)}.tutor-modal{background:var(--tutor-surface);border-radius:var(--tutor-radius-lg);box-shadow:0 20px 60px #0000004d;padding:28px 32px;width:100%;max-width:560px;font-family:var(--tutor-font-body);color:var(--tutor-text)}.tutor-modal__eyebrow{font-size:11px;font-weight:600;color:var(--tutor-accent-strong);text-transform:uppercase;letter-spacing:.18em;margin-bottom:6px}.tutor-modal__title{font-family:var(--tutor-font-display);font-size:22px;font-weight:600;margin:0 0 4px;color:var(--tutor-text)}.tutor-modal__sub{font-size:12px;color:var(--tutor-muted);margin:0 0 18px}.tutor-modal__option{display:block;width:100%;text-align:left;padding:16px;border-radius:var(--tutor-radius-sm);border:2px solid var(--tutor-border);background:var(--tutor-surface);font:inherit;color:var(--tutor-text);cursor:pointer;margin-bottom:10px;transition:border-color .12s,background .12s}.tutor-modal__option:hover{border-color:var(--tutor-accent-strong)}.tutor-modal__option.is-active{border-color:var(--tutor-accent-strong);background:var(--tutor-accent-soft)}.tutor-modal__option-row{display:flex;align-items:flex-start;gap:12px}.tutor-modal__radio{margin-top:4px;width:16px;height:16px;border-radius:50%;border:2px solid var(--tutor-border);flex-shrink:0;display:flex;align-items:center;justify-content:center}.tutor-modal__option.is-active .tutor-modal__radio{border-color:var(--tutor-accent-strong)}.tutor-modal__radio-dot{width:8px;height:8px;border-radius:50%;background:var(--tutor-accent-strong)}.tutor-modal__option-title{font-family:var(--tutor-font-display);font-style:italic;font-weight:600;font-size:16px;color:var(--tutor-accent-strong);display:inline}.tutor-modal__option-badge{margin-left:8px;font-size:9px;font-weight:800;letter-spacing:.14em;padding:2px 6px;border-radius:3px;background:#3fcc7a2e;color:#1a7341;text-transform:uppercase}.tutor-modal__option-desc{font-size:12px;color:var(--tutor-muted);margin-top:6px;line-height:1.5}.tutor-modal__actions{margin-top:20px;display:flex;align-items:center;justify-content:space-between;gap:12px}.tutor-btn--ghost{background:transparent;color:var(--tutor-muted);border:1px solid var(--tutor-border);padding:8px 16px;border-radius:var(--tutor-radius-sm);font:inherit;font-size:13px;cursor:pointer;transition:color .12s,border-color .12s}.tutor-btn--ghost:hover:not(:disabled){color:var(--tutor-text);border-color:var(--tutor-accent-strong)}.tutor-btn--ghost:disabled{opacity:.5;cursor:not-allowed}', g = 30;
function T() {
  return typeof window < "u" && window.CANVASA_HOST ? window.CANVASA_HOST : "https://canvasa.olympiz.ai";
}
let M = !1;
function G() {
  if (M || typeof document > "u") return;
  const i = "canvasa-sdk-styles";
  if (document.getElementById(i)) {
    M = !0;
    return;
  }
  const t = document.createElement("style");
  t.id = i, t.textContent = F, document.head.appendChild(t), M = !0;
}
function b(i) {
  return i == null ? "" : String(i).replace(/[&<>"']/g, (t) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[t]);
}
function f(i) {
  return b(i).replace(/`/g, "&#96;");
}
let k = null, E = null;
async function N(i) {
  if (i === "off") return null;
  if (k) return k;
  if (typeof window > "u") return null;
  if (typeof window.renderMathInElement == "function")
    return k = window.renderMathInElement, k;
  if (E) return E;
  const t = i || "https://cdn.jsdelivr.net/npm/katex@0.16.10/dist";
  return E = (async () => {
    try {
      if (!document.querySelector(`link[href^="${t}/katex.min.css"]`)) {
        const e = document.createElement("link");
        e.rel = "stylesheet", e.href = `${t}/katex.min.css`, e.crossOrigin = "anonymous", document.head.appendChild(e);
      }
      await O(`${t}/katex.min.js`), await O(`${t}/contrib/auto-render.min.js`);
      for (let e = 0; e < 30; e++) {
        if (typeof window.renderMathInElement == "function")
          return k = window.renderMathInElement, k;
        await new Promise((r) => setTimeout(r, 100));
      }
    } catch (e) {
      console.warn("[canvasa-sdk] KaTeX load failed; raw $...$ will show", e);
    }
    return null;
  })(), E;
}
function O(i) {
  return new Promise((t, e) => {
    if (document.querySelector(`script[src="${i}"]`)) return t();
    const r = document.createElement("script");
    r.src = i, r.async = !0, r.crossOrigin = "anonymous", r.onload = () => t(), r.onerror = (n) => e(n), document.head.appendChild(r);
  });
}
function W(i, t) {
  if (t)
    try {
      t(i, {
        delimiters: [
          { left: "$$", right: "$$", display: !0 },
          { left: "$", right: "$", display: !1 },
          { left: "\\(", right: "\\)", display: !1 },
          { left: "\\[", right: "\\]", display: !0 }
        ],
        throwOnError: !1,
        // 'button' intentionally NOT in ignoredTags — problem statements
        // live inside clickable <button>s and the math must render there.
        ignoredTags: ["script", "noscript", "style", "textarea", "pre", "code"]
      });
    } catch {
    }
}
const q = class q extends HTMLElement {
  constructor() {
    super(...arguments), this._brand = null, this._ready = !1, this._tab = "ondemand", this._topic = "", this._conceptQuery = "", this._conceptLevel = "all", this._probQuery = "", this._probChip = "all", this._topicHeaders = [], this._topicSectionCache = /* @__PURE__ */ new Map(), this._problemHeaders = [], this._problemSectionCache = /* @__PURE__ */ new Map(), this._counts = null, this._busy = !1, this._busyMsg = "", this._errorMsg = "", this._expanded = /* @__PURE__ */ new Map(), this._pageState = /* @__PURE__ */ new Map();
  }
  // ── Lifecycle ───────────────────────────────────────────────────
  connectedCallback() {
    G(), this.classList.add("canvasa-tutor", "tutor-root", "tutor-page"), j({ host: T(), tenant: this._tenant() });
    const t = this.getAttribute("default-tab") || "ondemand";
    this._tab = t;
    const e = this.getAttribute("lesson"), r = this.getAttribute("ask");
    if (e) {
      const n = this.getAttribute("lesson-mode") || "teach";
      this._launch("lesson", { lesson: e, mode: n });
    } else if (r) {
      const n = this.getAttribute("lesson-mode") || "teach";
      this._launch("ask", { ask: r, mode: n });
    }
    this._render(), this._bootstrap();
  }
  disconnectedCallback() {
    var t;
    (t = this._abort) == null || t.abort();
  }
  attributeChangedCallback(t, e, r) {
    !this.isConnected || e === r || (t === "tenant" ? (j({ tenant: this._tenant() }), this._bootstrap()) : t === "default-tab" && r ? (this._tab = r, this._render()) : this._render());
  }
  // ── Programmatic API ────────────────────────────────────────────
  setTenant(t) {
    this.setAttribute("tenant", t);
  }
  setTab(t) {
    this._tab = t, this._render(), this._fireTab();
  }
  launchAsk(t, e) {
    this._launch("ask", { ask: t, mode: (e == null ? void 0 : e.mode) ?? "teach" });
  }
  launchLesson(t, e) {
    this._launch("lesson", { lesson: t, mode: (e == null ? void 0 : e.mode) ?? "teach" });
  }
  getBrandConfig() {
    return this._brand;
  }
  async refresh() {
    await this._bootstrap();
  }
  // ── Bootstrap (brand + counts) ──────────────────────────────────
  async _bootstrap() {
    await Promise.all([this._loadBrand(), this._loadCounts()]), this._applyBrandTokens(), this._render(), this._markReady();
  }
  async _loadBrand() {
    const t = this._tenant();
    try {
      this._brand = await x.brand(t);
    } catch (e) {
      this._brand = { tenant: t, tokens: {}, copy: {}, mark: {} }, this._fireError("brand-config-fetch-failed", String(e), e);
    }
  }
  async _loadCounts() {
    try {
      this._counts = await x.inventoryCounts();
    } catch (t) {
      this._fireError("inventory-counts-failed", String(t), t);
    }
  }
  _applyBrandTokens() {
    var r;
    const t = (r = this._brand) == null ? void 0 : r.tokens;
    if (!t) return;
    const e = {
      accent: "--tutor-accent",
      accentHover: "--tutor-accent-strong",
      bg: "--tutor-bg",
      surface: "--tutor-surface",
      text: "--tutor-text",
      muted: "--tutor-muted",
      line: "--tutor-border",
      radius: "--tutor-radius",
      fontHead: "--tutor-font-display",
      fontBody: "--tutor-font-body",
      fontMono: "--tutor-font-mono"
    };
    for (const [n, o] of Object.entries(t)) {
      const a = e[n] ?? `--tutor-${n}`;
      typeof o == "string" && this.style.setProperty(a, o);
    }
  }
  // ── Render dispatch ─────────────────────────────────────────────
  _tenant() {
    return this.getAttribute("tenant") || "default";
  }
  _debug() {
    return this.getAttribute("debug") === "1";
  }
  _slotText(t) {
    var r;
    const e = this.querySelector(`[slot="${CSS.escape(t)}"]`);
    return ((r = e == null ? void 0 : e.textContent) == null ? void 0 : r.trim()) || null;
  }
  _render() {
    var h, d, m, y;
    const t = ((h = this._brand) == null ? void 0 : h.copy) ?? {}, e = this._slotText("hero-title") ?? t.heroTitle ?? "What do you want to <em>learn</em> today?", r = this._slotText("hero-sub") ?? t.heroSub ?? "Drop a question.", n = (this.getAttribute("hide-tabs") || "").split(",").map((u) => u.trim()).filter(Boolean), o = ["ondemand", "concepts", "problems"].filter((u) => !n.includes(u)), a = {
      ondemand: ((d = t.tabs) == null ? void 0 : d.ondemand) ?? "On-demand",
      concepts: ((m = t.tabs) == null ? void 0 : m.concepts) ?? "Concept library",
      problems: ((y = t.tabs) == null ? void 0 : y.problems) ?? "Problems"
    }, s = {
      ondemand: "5 ways",
      concepts: this._counts ? String(this._counts.concepts_total) : "",
      problems: this._counts ? String(this._counts.problems_total) : ""
    };
    this.innerHTML = `
      <div class="canvasa-tutor__pill" title="Canvas A SDK · ${S}">v${S}</div>
      <section class="tutor-hero">
        <h1>${e}</h1>
        <p>${b(r)}</p>
      </section>
      <nav class="tutor-tabs" role="tablist">
        ${o.map((u) => `
          <button type="button" role="tab" aria-selected="${u === this._tab}"
                  data-canvasa-tab="${u}"
                  class="tutor-tab${u === this._tab ? " is-active" : ""}">
            ${b(a[u])}
            ${s[u] ? `<span class="tutor-tab__count">${b(s[u])}</span>` : ""}
          </button>`).join("")}
      </nav>
      <div data-canvasa-tabpanel="${this._tab}" class="canvasa-tutor__panel"></div>
      <div class="canvasa-tutor__footer">
        <slot name="footer"></slot>
      </div>
    `, this.querySelectorAll("[data-canvasa-tab]").forEach((u) => {
      u.addEventListener("click", () => {
        const v = u.dataset.canvasaTab;
        this.setTab(v);
      });
    }), this._injectPillStyle();
    const c = this.querySelector(".canvasa-tutor__panel");
    c && (this._tab === "ondemand" ? this._renderOnDemand(c) : this._tab === "concepts" ? this._renderConcepts(c) : this._tab === "problems" && this._renderProblems(c));
  }
  _injectPillStyle() {
    const t = "canvasa-tutor-pill-style";
    if (document.getElementById(t)) return;
    const e = document.createElement("style");
    e.id = t, e.textContent = `
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
    `, document.head.appendChild(e);
  }
  // ── On-demand tab ───────────────────────────────────────────────
  _renderOnDemand(t) {
    var c, h;
    const e = ((c = this._brand) == null ? void 0 : c.copy) ?? {}, r = e.placeholderTopic ?? "e.g. Bernoulli's principle · Lenz's law · Maxwell's equations", n = this._slotText("cta-label") ?? e.ctaLabel ?? "AI Tutor →";
    t.innerHTML = `
      <section class="tutor-section">
        <h2>Type a topic.</h2>
        <div class="tutor-row">
          <input type="text" class="tutor-input" data-canvasa-topic
                 placeholder="${f(r)}" value="${f(this._topic)}">
          <button type="button" class="tutor-btn" data-canvasa-launch-topic ${this._busy || !this._topic.trim() ? "disabled" : ""}>
            ${this._busy ? "Working…" : b(n)}
          </button>
        </div>
        ${this._busyMsg || this._errorMsg ? `<div class="tutor-status${this._errorMsg ? " tutor-status--error" : ""}">${b(this._errorMsg || this._busyMsg)}</div>` : ""}
      </section>
      <section class="tutor-section" data-canvasa-source-picker></section>
      <section class="tutor-section">
        <h2>Or, drop a chapter or paper.</h2>
        <div data-canvasa-pdf-drop></div>
      </section>
    `;
    const o = t.querySelector("[data-canvasa-topic]");
    o && (o.addEventListener("input", () => {
      this._topic = o.value;
      const d = t.querySelector("[data-canvasa-launch-topic]");
      d && (d.disabled = this._busy || !this._topic.trim());
    }), o.addEventListener("keydown", (d) => {
      d.key === "Enter" && this._handleTopicGo();
    })), (h = t.querySelector("[data-canvasa-launch-topic]")) == null || h.addEventListener("click", () => this._handleTopicGo());
    const a = t.querySelector("[data-canvasa-source-picker]");
    a && this._mountSourcePicker(a);
    const s = t.querySelector("[data-canvasa-pdf-drop]");
    s && this._mountPdfDrop(s);
  }
  _handleTopicGo() {
    const t = this._topic.trim();
    t && this._launch("ask", { ask: t, mode: "teach" });
  }
  // Source picker — Internal wiki + External wiki, debounced search
  _mountSourcePicker(t) {
    let e = "internal", r = "", n = [], o = !1, a = null;
    const s = [
      { key: "internal", lbl: "Internal wiki", sub: "SuperStem Physics + AI + HS concept graphs" },
      { key: "external", lbl: "External wiki", sub: "Wikipedia — live" }
    ], c = () => {
      t.innerHTML = `
        <h2>Or, point at a source.</h2>
        <div class="tutor-sources">
          ${s.map((d) => `
            <button type="button" class="tutor-source${e === d.key ? " is-active" : ""}" data-canvasa-src="${d.key}">
              <div class="tutor-source__row">
                <span class="tutor-source__dot"></span>
                <div>
                  <div class="tutor-source__lbl">${b(d.lbl)}</div>
                  <div class="tutor-source__sub">${b(d.sub)}</div>
                </div>
              </div>
            </button>`).join("")}
        </div>
        <input type="text" class="tutor-input tutor-input--sm" data-canvasa-src-q
               value="${f(r)}" placeholder="Type to search the selected source…">
        ${o ? '<div class="tutor-status">Searching…</div>' : ""}
        ${n.length ? `
          <div class="tutor-results">
            ${n.slice(0, 10).map((d) => `
              <button type="button" class="tutor-result" data-canvasa-pick='${f(JSON.stringify({ url: d.url, title: d.title }))}'>
                <div class="tutor-result__ttl">${b(d.title)}</div>
                ${d.description || d.desc || d.snippet ? `<div class="tutor-result__desc">${b(d.description || d.desc || d.snippet || "")}</div>` : ""}
              </button>`).join("")}
          </div>` : ""}
        <div class="tutor-hint">
          Searches across SuperStem Physics Wiki (1400+ articles) · AI Wiki · HS Physics/Math/Chemistry concept graphs.
        </div>
      `, t.querySelectorAll("[data-canvasa-src]").forEach((d) => {
        d.addEventListener("click", () => {
          e = d.dataset.canvasaSrc, c();
        });
      });
      const h = t.querySelector("[data-canvasa-src-q]");
      h == null || h.addEventListener("input", () => {
        if (r = h.value, a && clearTimeout(a), !r.trim()) {
          n = [], c();
          return;
        }
        a = window.setTimeout(async () => {
          o = !0, c();
          try {
            n = (e === "external" ? await x.wikiSearch(r.trim()) : await x.superstemSearch(r.trim())).results || [];
          } catch {
            n = [];
          } finally {
            o = !1, c();
          }
        }, 300);
      }), t.querySelectorAll("[data-canvasa-pick]").forEach((d) => {
        d.addEventListener("click", () => {
          try {
            const m = JSON.parse(d.dataset.canvasaPick || "{}");
            m.url && this._launchUrl(m.url, m.title);
          } catch {
          }
        });
      });
    };
    c();
  }
  _mountPdfDrop(t) {
    t.innerHTML = `
      <label class="tutor-pdfdrop" data-canvasa-pdf-label>
        <input type="file" accept="application/pdf" hidden data-canvasa-pdf-input>
        <span>Drop a PDF here, or <u>browse</u></span>
      </label>
    `;
    const e = t.querySelector("[data-canvasa-pdf-input]"), r = t.querySelector("[data-canvasa-pdf-label]");
    e == null || e.addEventListener("change", () => {
      var o;
      const n = (o = e.files) == null ? void 0 : o[0];
      n && this._launchPdf(n);
    }), r == null || r.addEventListener("dragover", (n) => {
      n.preventDefault(), r.classList.add("is-drag");
    }), r == null || r.addEventListener("dragleave", () => r.classList.remove("is-drag")), r == null || r.addEventListener("drop", (n) => {
      var a, s;
      n.preventDefault(), r.classList.remove("is-drag");
      const o = (s = (a = n.dataTransfer) == null ? void 0 : a.files) == null ? void 0 : s[0];
      o && o.type === "application/pdf" && this._launchPdf(o);
    });
  }
  // ── Concept library tab ─────────────────────────────────────────
  async _renderConcepts(t) {
    t.innerHTML = `<section class="tutor-section">
      <h2>Concept library</h2>
      <div class="tutor-section__sub" data-canvasa-concepts-sub>Loading…</div>
      <div class="tutor-row" style="margin-bottom: 14px;">
        <input type="text" class="tutor-input tutor-input--sm" data-canvasa-concept-q
               value="${f(this._conceptQuery)}" placeholder="Search concepts…">
        <div class="tutor-chip-group" data-canvasa-concept-chips>
          ${["all", "HS", "UG", "G"].map((s) => `
            <button type="button" class="tutor-chip${this._conceptLevel === s ? " is-active" : ""}" data-canvasa-clvl="${s}">${s === "all" ? "All" : s}</button>`).join("")}
        </div>
      </div>
      <div data-canvasa-concept-topics></div>
    </section>`;
    const e = t.querySelector("[data-canvasa-concepts-sub]"), r = t.querySelector("[data-canvasa-concept-topics]");
    if (!e || !r) return;
    t.querySelectorAll("[data-canvasa-clvl]").forEach((s) => {
      s.addEventListener("click", () => {
        this._conceptLevel = s.dataset.canvasaClvl, t.querySelectorAll("[data-canvasa-clvl]").forEach((c) => c.classList.toggle("is-active", c.dataset.canvasaClvl === this._conceptLevel)), this._topicSectionCache.clear(), this._pageState.clear(), this._rerenderConceptTopics(r);
      });
    });
    let n = null;
    const o = t.querySelector("[data-canvasa-concept-q]");
    if (o == null || o.addEventListener("input", () => {
      this._conceptQuery = o.value, n && clearTimeout(n), n = window.setTimeout(() => {
        this._topicSectionCache.clear(), this._pageState.clear(), this._rerenderConceptTopics(r);
      }, 220);
    }), !this._topicHeaders.length)
      try {
        const s = await x.libraryTopicHeaders();
        this._topicHeaders = s.topics || [];
      } catch (s) {
        e.textContent = "Failed to load: " + String(s), this._fireError("library-topics-failed", String(s), s);
        return;
      }
    const a = this._topicHeaders.reduce((s, c) => s + (c.count || 0), 0);
    e.textContent = `${a.toLocaleString()} lessons across ${this._topicHeaders.length} topics — click a section to expand.`, this._rerenderConceptTopics(r);
  }
  _conceptLevelCount(t) {
    switch (this._conceptLevel) {
      case "HS":
        return t.hs_count;
      case "UG":
        return t.ug_count;
      case "G":
        return t.g_count;
      default:
        return t.count;
    }
  }
  _rerenderConceptTopics(t) {
    const e = this._conceptLevel, r = this._conceptQuery.trim(), n = e !== "all" || !!r;
    t.innerHTML = this._topicHeaders.map((o, a) => {
      const s = this._conceptLevelCount(o), c = this._expanded.get("c:" + a) ?? a === 0, h = r ? `${o.count} lessons · search active` : `${s} lesson${s === 1 ? "" : "s"}${n ? ` of ${o.count}` : ""}`, d = e !== "all" && s === 0 && !r;
      return `
        <div class="tutor-topic${c ? " is-expanded" : ""}" data-canvasa-ctopic="${a}" data-canvasa-cname="${f(o.name)}" style="${d ? "display:none;" : ""}">
          <div class="tutor-topic__head" data-canvasa-ctoggle="${a}">
            <span class="tutor-topic__icon">${b(o.icon || "📘")}</span>
            <span class="tutor-topic__name">${b(o.name)}</span>
            <span class="tutor-topic__count">${b(h)}</span>
            <span class="tutor-topic__chev">▶</span>
          </div>
          <div class="tutor-topic__body" data-canvasa-ctopic-body="${a}" data-rendered="0"></div>
        </div>`;
    }).join(""), t.querySelectorAll("[data-canvasa-ctoggle]").forEach((o) => {
      o.addEventListener("click", () => {
        const a = +(o.dataset.canvasaCtoggle || "0"), s = t.querySelector(`[data-canvasa-ctopic="${a}"]`);
        if (!s) return;
        const c = !s.classList.contains("is-expanded");
        s.classList.toggle("is-expanded", c), this._expanded.set("c:" + a, c), c && this._renderConceptTopicBody(t, a, 0);
      });
    }), this._topicHeaders.forEach((o, a) => {
      (this._expanded.get("c:" + a) ?? a === 0) && this._renderConceptTopicBody(t, a, this._pageState.get("c:" + a) ?? 0);
    });
  }
  async _renderConceptTopicBody(t, e, r) {
    var w, $;
    const n = this._topicHeaders[e];
    if (!n) return;
    const o = t.querySelector(`[data-canvasa-ctopic-body="${e}"]`);
    if (!o) return;
    const a = this._conceptLevel, s = this._conceptQuery.trim(), c = n.name, h = Math.max(0, r * g), d = this._topicSectionCache.get(c), m = d && d.level === a && d.q === s && d.offset === h && d.limit === g;
    let y, u;
    if (m && d)
      y = d.lessons, u = d.total;
    else {
      o.innerHTML = '<div class="tutor-empty">Loading…</div>', o.dataset.rendered = "0";
      try {
        const p = await x.libraryTopicSection(n.name, h, g, a, s);
        y = p.lessons || [], u = p.total || 0, this._topicSectionCache.set(c, { lessons: y, total: u, offset: h, limit: g, level: a, q: s });
      } catch (p) {
        o.innerHTML = `<div class="tutor-empty">Failed to load: ${b(String(p))}</div>`, this._fireError("library-topic-section-failed", String(p), p);
        return;
      }
    }
    const v = Math.max(1, Math.ceil(u / g));
    r < 0 && (r = 0), r >= v && (r = v - 1), this._pageState.set("c:" + e, r), o.innerHTML = `
      <div class="tutor-card-grid">
        ${y.map((p) => {
      const C = p.level || "HS";
      return `<button type="button" class="tutor-card" data-canvasa-lesson="${f(p.slug)}" data-canvasa-cached="${p.cached ? "1" : "0"}" data-canvasa-title="${f(p.title)}" data-canvasa-source="concept">
            <div class="tutor-card__title">${b(p.title)}</div>
            <div class="tutor-card__meta">
              <span>${b(C)}</span>
              ${p.cached ? '<span class="tutor-card__cached">✓ cached</span>' : ""}
              ${p.guide_cached ? '<span class="tutor-card__guide">⚡ guide</span>' : ""}
            </div>
          </button>`;
    }).join("")}
      </div>
      ${u > g ? `
        <div class="tutor-pag">
          <button type="button" data-canvasa-cpag-prev ${r <= 0 ? "disabled" : ""}>← Prev</button>
          <span>Page ${r + 1} of ${v} · ${u} lesson${u === 1 ? "" : "s"}</span>
          <button type="button" data-canvasa-cpag-next ${r >= v - 1 ? "disabled" : ""}>Next →</button>
        </div>` : u === 0 ? '<div class="tutor-empty">No matches in this topic.</div>' : ""}
    `, o.dataset.rendered = "1", (w = o.querySelector("[data-canvasa-cpag-prev]")) == null || w.addEventListener("click", (p) => {
      p.stopPropagation(), this._renderConceptTopicBody(t, e, r - 1);
    }), ($ = o.querySelector("[data-canvasa-cpag-next]")) == null || $.addEventListener("click", (p) => {
      p.stopPropagation(), this._renderConceptTopicBody(t, e, r + 1);
    }), o.querySelectorAll("[data-canvasa-lesson]").forEach((p) => {
      p.addEventListener("click", () => {
        this._handleLessonCardClick({
          slug: p.dataset.canvasaLesson || "",
          title: p.dataset.canvasaTitle || "",
          cached: p.dataset.canvasaCached === "1",
          source: "concept"
        });
      });
    });
  }
  // ── Problems tab ────────────────────────────────────────────────
  async _renderProblems(t) {
    t.innerHTML = `<section class="tutor-section">
      <h2>Problems</h2>
      <div class="tutor-section__sub" data-canvasa-problems-sub>Loading…</div>
      <div class="tutor-row" style="margin-bottom: 14px;">
        <input type="text" class="tutor-input tutor-input--sm" data-canvasa-prob-q
               value="${f(this._probQuery)}" placeholder="Search problems…">
        <div class="tutor-chip-group" data-canvasa-prob-chips>
          ${["all", "HS", "UG", "G", "Olympiad", "cached"].map((s) => `
            <button type="button" class="tutor-chip${this._probChip === s ? " is-active" : ""}" data-canvasa-pchip="${s}">${s === "all" ? "All" : s === "cached" ? "✓" : s}</button>`).join("")}
        </div>
      </div>
      <div data-canvasa-problem-sections></div>
    </section>`;
    const e = t.querySelector("[data-canvasa-problems-sub]"), r = t.querySelector("[data-canvasa-problem-sections]");
    if (!e || !r) return;
    t.querySelectorAll("[data-canvasa-pchip]").forEach((s) => {
      s.addEventListener("click", () => {
        this._probChip = s.dataset.canvasaPchip, t.querySelectorAll("[data-canvasa-pchip]").forEach((c) => c.classList.toggle("is-active", c.dataset.canvasaPchip === this._probChip)), this._problemSectionCache.clear(), this._pageState.clear(), this._rerenderProblemSections(r);
      });
    });
    let n = null;
    const o = t.querySelector("[data-canvasa-prob-q]");
    if (o == null || o.addEventListener("input", () => {
      this._probQuery = o.value, n && clearTimeout(n), n = window.setTimeout(() => {
        this._problemSectionCache.clear(), this._pageState.clear(), this._rerenderProblemSections(r);
      }, 220);
    }), !this._problemHeaders.length)
      try {
        const s = await x.problemsLibraryHeaders();
        this._problemHeaders = s.sections || [];
      } catch (s) {
        e.textContent = "Failed to load: " + String(s), this._fireError("problems-library-failed", String(s), s);
        return;
      }
    const a = this._problemHeaders.reduce((s, c) => s + (c.count || 0), 0);
    e.textContent = `${a.toLocaleString()} problems across ${this._problemHeaders.length} sections — click a section to expand.`, this._rerenderProblemSections(r);
  }
  _probChipToLevel() {
    switch (this._probChip) {
      case "HS":
      case "UG":
      case "G":
        return this._probChip;
      case "Olympiad":
        return "olympiad";
      case "cached":
        return "cached";
      default:
        return "all";
    }
  }
  _problemChipCount(t) {
    switch (this._probChip) {
      case "HS":
        return t.hs_count;
      case "UG":
        return t.ug_count;
      case "G":
        return t.g_count;
      case "Olympiad":
        return t.olympiad_count;
      case "cached":
        return t.cached_count;
      default:
        return t.count;
    }
  }
  _rerenderProblemSections(t) {
    const e = this._probChip, r = this._probQuery.trim(), n = e !== "all" || !!r;
    t.innerHTML = this._problemHeaders.map((o, a) => {
      const s = this._problemChipCount(o), c = this._expanded.get("p:" + a) ?? a === 0, h = r ? `${o.count} problems · search active` : `${s} problem${s === 1 ? "" : "s"}${n ? ` of ${o.count}` : ""}`, d = e !== "all" && s === 0 && !r;
      return `
        <div class="tutor-topic${c ? " is-expanded" : ""}" data-canvasa-psec="${a}" data-canvasa-pname="${f(o.name)}" style="${d ? "display:none;" : ""}">
          <div class="tutor-topic__head" data-canvasa-ptoggle="${a}">
            <span class="tutor-topic__icon">${b(o.icon || "📘")}</span>
            <span class="tutor-topic__name">${b(o.name)}</span>
            <span class="tutor-topic__count">${b(h)}</span>
            <span class="tutor-topic__chev">▶</span>
          </div>
          <div class="tutor-topic__body" data-canvasa-psec-body="${a}" data-rendered="0"></div>
        </div>`;
    }).join(""), t.querySelectorAll("[data-canvasa-ptoggle]").forEach((o) => {
      o.addEventListener("click", () => {
        const a = +(o.dataset.canvasaPtoggle || "0"), s = t.querySelector(`[data-canvasa-psec="${a}"]`);
        if (!s) return;
        const c = !s.classList.contains("is-expanded");
        s.classList.toggle("is-expanded", c), this._expanded.set("p:" + a, c), c && this._renderProblemSectionBody(t, a, 0);
      });
    }), this._problemHeaders.forEach((o, a) => {
      (this._expanded.get("p:" + a) ?? a === 0) && this._renderProblemSectionBody(t, a, this._pageState.get("p:" + a) ?? 0);
    });
  }
  async _renderProblemSectionBody(t, e, r) {
    var p, C;
    const n = this._problemHeaders[e];
    if (!n) return;
    const o = t.querySelector(`[data-canvasa-psec-body="${e}"]`);
    if (!o) return;
    const a = this._probChip, s = this._probChipToLevel(), c = this._probQuery.trim(), h = n.name, d = Math.max(0, r * g), m = this._problemSectionCache.get(h), y = m && m.chip === a && m.q === c && m.offset === d && m.limit === g;
    let u, v;
    if (y && m)
      u = m.problems, v = m.total;
    else {
      o.innerHTML = '<div class="tutor-empty">Loading…</div>', o.dataset.rendered = "0";
      try {
        const l = await x.problemsLibrarySection(n.name, d, g, s, c);
        u = l.problems || [], v = l.total || 0, this._problemSectionCache.set(h, { problems: u, total: v, offset: d, limit: g, chip: a, q: c });
      } catch (l) {
        o.innerHTML = `<div class="tutor-empty">Failed to load: ${b(String(l))}</div>`, this._fireError("problems-library-section-failed", String(l), l);
        return;
      }
    }
    const w = Math.max(1, Math.ceil(v / g));
    r < 0 && (r = 0), r >= w && (r = w - 1), this._pageState.set("p:" + e, r), o.innerHTML = `
      <div class="tutor-prob-list">
        ${u.map((l) => {
      const I = l.level || "UG", z = l.difficulty || "medium";
      return `<button type="button" class="tutor-prob" data-canvasa-lesson="${f(l.slug)}" data-canvasa-cached="${l.cached ? "1" : "0"}" data-canvasa-title="${f(l.title)}" data-canvasa-source="problem" data-canvasa-statement="${f(l.statement || "")}">
            <div class="tutor-prob__head">
              <span class="tutor-prob__title">${b(l.title)}</span>
              <span class="tutor-pill tutor-pill--${f(z)}">${b(z)}</span>
              <span class="tutor-pill">${b(I)}</span>
              ${l.source ? `<span class="tutor-prob__src">· ${b(l.source)}</span>` : ""}
              ${l.cached ? '<span class="tutor-prob__cached" title="Cached — instant load">✓</span>' : ""}
              ${l.guide_cached ? '<span class="tutor-prob__guide" title="Figure-It-Out cached">⚡</span>' : ""}
            </div>
            ${l.statement ? `<div class="tutor-prob__statement">${l.statement}</div>` : ""}
          </button>`;
    }).join("")}
      </div>
      ${v > g ? `
        <div class="tutor-pag">
          <button type="button" data-canvasa-ppag-prev ${r <= 0 ? "disabled" : ""}>← Prev</button>
          <span>Page ${r + 1} of ${w} · ${v} result${v === 1 ? "" : "s"}</span>
          <button type="button" data-canvasa-ppag-next ${r >= w - 1 ? "disabled" : ""}>Next →</button>
        </div>` : v === 0 ? '<div class="tutor-empty">No matches in this section.</div>' : ""}
    `, o.dataset.rendered = "1", (p = o.querySelector("[data-canvasa-ppag-prev]")) == null || p.addEventListener("click", (l) => {
      l.stopPropagation(), this._renderProblemSectionBody(t, e, r - 1);
    }), (C = o.querySelector("[data-canvasa-ppag-next]")) == null || C.addEventListener("click", (l) => {
      l.stopPropagation(), this._renderProblemSectionBody(t, e, r + 1);
    }), o.querySelectorAll("[data-canvasa-lesson]").forEach((l) => {
      l.addEventListener("click", () => {
        this._handleLessonCardClick({
          slug: l.dataset.canvasaLesson || "",
          title: l.dataset.canvasaTitle || "",
          cached: l.dataset.canvasaCached === "1",
          source: "problem",
          statement: l.dataset.canvasaStatement || ""
        });
      });
    });
    const $ = await N(this.getAttribute("katex-cdn"));
    W(o, $);
  }
  // ── Lesson card click → mode picker → launch ────────────────────
  _handleLessonCardClick(t) {
    const e = this.getAttribute("lesson-mode") || "picker", r = new CustomEvent("canvasa-lesson-click", {
      detail: { ...t, mode: e },
      bubbles: !0,
      composed: !0,
      cancelable: !0
    });
    this.dispatchEvent(r) && (e === "teach" || e === "guide" ? this._launch("lesson", { lesson: t.slug, mode: e, statement: t.statement ?? "" }) : this._openModePicker(t));
  }
  _openModePicker(t) {
    var o;
    const e = document.createElement("div");
    e.className = "tutor-mode-modal", e.innerHTML = `
      <div class="tutor-mode-modal__card" role="dialog" aria-label="Pick a learning mode">
        <h3 class="tutor-mode-modal__title">${b(t.title || "Pick a learning mode")}</h3>
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
    `, document.body.appendChild(e);
    const r = () => e.remove();
    e.addEventListener("click", (a) => {
      a.target === e && r();
    }), (o = e.querySelector("[data-cancel]")) == null || o.addEventListener("click", r), e.querySelectorAll("[data-mode]").forEach((a) => {
      a.addEventListener("click", () => {
        const s = a.dataset.mode || "teach";
        r(), t.slug ? this._launch("lesson", { lesson: t.slug, mode: s, statement: t.statement ?? "" }) : t.statement && this._launch("ask", { ask: t.statement, mode: s });
      });
    });
    const n = (a) => {
      a.key === "Escape" && (r(), document.removeEventListener("keydown", n));
    };
    document.addEventListener("keydown", n);
  }
  // ── Launch (redirect to /tutor or /guide) ───────────────────────
  _launch(t, e) {
    const r = new CustomEvent("canvasa-launch", {
      detail: { kind: t, payload: e },
      bubbles: !0,
      composed: !0,
      cancelable: !0
    });
    if (!this.dispatchEvent(r)) return;
    const o = (e.mode === "guide" ? "guide" : "tutor") === "guide" ? "/guide" : "/tutor", a = new URLSearchParams();
    if (e.lesson && a.set("lesson", e.lesson), e.ask && a.set("ask", e.ask), a.set("brand", this._tenant()), typeof window < "u" && window.location) {
      a.set("return", window.location.href);
      const s = `${T()}${o}?${a.toString()}`, c = this.getAttribute("lesson-target") || "self";
      if (c === "blank")
        window.open(s, "_blank", "noopener");
      else if (c.startsWith(".") || c.startsWith("#")) {
        const h = document.querySelector(c);
        h && "src" in h && (h.src = s);
      } else
        window.location.assign(s);
    }
  }
  _launchUrl(t, e) {
    this._busy = !0, this._busyMsg = "Opening tutor…", this._render();
    const r = new URLSearchParams();
    r.set("ask", e && e.trim() || t), r.set("brand", this._tenant()), typeof window < "u" && window.location && r.set("return", window.location.href), window.location.assign(`${T()}/tutor?${r.toString()}`);
  }
  async _launchPdf(t) {
    this._busy = !0, this._busyMsg = "Reading PDF…", this._errorMsg = "", this._render();
    try {
      const e = await x.generateFromPdf(t);
      e.ready_url ? window.location.assign(e.ready_url) : (this._busyMsg = "Building from PDF — first beat in ~12-18s…", this._render());
    } catch (e) {
      this._errorMsg = "PDF upload failed: " + String(e), this._busy = !1, this._render(), this._fireError("pdf-upload-failed", String(e), e);
    }
  }
  // ── Events ──────────────────────────────────────────────────────
  _fireTab() {
    this.dispatchEvent(new CustomEvent("canvasa-tab-change", {
      detail: { tab: this._tab },
      bubbles: !0,
      composed: !0
    }));
  }
  _markReady() {
    this._ready || (this._ready = !0, this.dispatchEvent(new CustomEvent("canvasa-ready", {
      detail: { version: S, tenant: this._tenant() },
      bubbles: !0,
      composed: !0
    })), this._debug() && console.log("[canvasa] ready", { tenant: this._tenant(), brand: this._brand, counts: this._counts }));
  }
  _fireError(t, e, r) {
    this.dispatchEvent(new CustomEvent("canvasa-error", {
      detail: { code: t, message: e, cause: r },
      bubbles: !0,
      composed: !0
    })), this._debug() && console.warn("[canvasa] error", t, e);
  }
};
q.observedAttributes = [
  "tenant",
  "mode",
  "default-tab",
  "hide-tabs",
  "lesson",
  "ask",
  "problem-id",
  "lesson-target",
  "lesson-mode",
  "katex-cdn",
  "debug"
];
let A = q;
function R() {
  typeof window > "u" || window.customElements.get("canvasa-tutor") || window.customElements.define("canvasa-tutor", A);
}
const V = "https://canvasa.olympiz.ai", Q = "default";
class J extends HTMLElement {
  constructor() {
    super(...arguments), this._iframe = null, this._onMessage = this._handleMessage.bind(this), this._ready = !1;
  }
  static get observedAttributes() {
    return ["lesson", "mode", "host", "tenant", "return-url"];
  }
  connectedCallback() {
    this.isConnected && (this._render(), window.addEventListener("message", this._onMessage));
  }
  disconnectedCallback() {
    window.removeEventListener("message", this._onMessage), this._iframe = null, this._ready = !1;
  }
  attributeChangedCallback() {
    this.isConnected && this._render();
  }
  /** Read the current iframe URL — useful for hosts that want to deep-link. */
  get currentUrl() {
    return this._buildUrl();
  }
  _buildUrl() {
    const t = (this.getAttribute("host") || V).replace(/\/$/, ""), r = (this.getAttribute("mode") || "teach").toLowerCase() === "guide" ? "/guide" : "/tutor", n = (this.getAttribute("lesson") || "").trim(), o = (this.getAttribute("tenant") || Q).trim(), a = (this.getAttribute("return-url") || "").trim(), s = new URLSearchParams();
    return n && s.set("lesson", n), s.set("brand", o), a && s.set("return", a), `${t}${r}?${s.toString()}`;
  }
  _render() {
    const t = (this.getAttribute("lesson") || "").trim();
    if (!t) {
      this._renderError("Missing required attribute `lesson` on <canvasa-chalkboard>.");
      return;
    }
    const e = this._buildUrl();
    if (this._iframe) {
      this._iframe.src !== e && (this._ready = !1, this._iframe.src = e);
      return;
    }
    for (this.style.position || (this.style.position = "relative"), this.style.display || (this.style.display = "block"), this.style.width || (this.style.width = "100%"), this.style.minHeight || (this.style.minHeight = "600px"); this.firstChild; ) this.removeChild(this.firstChild);
    const r = document.createElement("iframe");
    r.src = e, r.title = "Canvas A — Lesson", r.setAttribute("allow", "autoplay; microphone; clipboard-write"), r.setAttribute("allowfullscreen", ""), r.style.cssText = "width:100%; height:100%; min-height:inherit; border:0; display:block; background:#0d1620;", r.addEventListener("load", () => {
      this._ready = !0, this.dispatchEvent(new CustomEvent("canvasa-ready", {
        bubbles: !0,
        composed: !0,
        detail: { version: S, lesson: t, mode: this.getAttribute("mode") || "teach" }
      }));
    }), r.addEventListener("error", () => {
      this.dispatchEvent(new CustomEvent("canvasa-error", {
        bubbles: !0,
        composed: !0,
        detail: { code: "chalkboard-load-failed", message: "Iframe failed to load", cause: { url: e } }
      }));
    }), this.appendChild(r), this._iframe = r;
  }
  _renderError(t) {
    for (; this.firstChild; ) this.removeChild(this.firstChild);
    const e = document.createElement("div");
    e.style.cssText = "padding:24px; font:14px/1.5 -apple-system,BlinkMacSystemFont,sans-serif; color:#c44; background:#fff2f2; border:1px solid #e88; border-radius:6px;", e.textContent = t, this.appendChild(e), this.dispatchEvent(new CustomEvent("canvasa-error", {
      bubbles: !0,
      composed: !0,
      detail: { code: "chalkboard-config", message: t, cause: null }
    }));
  }
  _handleMessage(t) {
    if (!this._iframe || t.source !== this._iframe.contentWindow) return;
    const e = t.data;
    if (!e || typeof e != "object") return;
    const r = e.type;
    r === "canvasa:close" || r === "canvas-a:close" ? this.dispatchEvent(new CustomEvent("canvasa-chalkboard-close", {
      bubbles: !0,
      composed: !0,
      detail: e
    })) : r === "canvasa:lesson-complete" ? this.dispatchEvent(new CustomEvent("canvasa-chalkboard-complete", {
      bubbles: !0,
      composed: !0,
      detail: e
    })) : r === "canvasa:ready" && !this._ready && (this._ready = !0, this.dispatchEvent(new CustomEvent("canvasa-ready", {
      bubbles: !0,
      composed: !0,
      detail: e
    })));
  }
}
typeof customElements < "u" && !customElements.get("canvasa-chalkboard") && customElements.define("canvasa-chalkboard", J);
class H extends HTMLElement {
  connectedCallback() {
    this.isConnected && (this._renderStub(), queueMicrotask(() => {
      this.dispatchEvent(new CustomEvent("canvasa-ready", {
        bubbles: !0,
        composed: !0,
        detail: {
          version: S,
          status: "stub",
          capability: this._stubMeta().capability,
          plannedVersion: this._stubMeta().plannedVersion
        }
      }));
    }));
  }
  _renderStub() {
    for (; this.firstChild; ) this.removeChild(this.firstChild);
    this.style.display || (this.style.display = "block");
    const t = this._stubMeta(), e = document.createElement("div");
    e.setAttribute("part", "stub-card"), e.style.cssText = [
      "padding:32px",
      "border-radius:14px",
      "background:var(--tutor-hero-bg, linear-gradient(135deg, #0b1e2c 0%, #163a52 100%))",
      "color:var(--tutor-hero-fg, #f3f6fb)",
      'font:14px/1.6 -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      "text-align:left",
      "box-shadow:0 2px 18px rgba(0,0,0,0.18)"
    ].join(";");
    const r = document.createElement("div");
    r.style.cssText = "display:inline-block; font-size:11px; letter-spacing:0.12em; text-transform:uppercase; opacity:0.7; margin-bottom:8px;", r.textContent = `Canvas A SDK · ${t.capability}`, e.appendChild(r);
    const n = document.createElement("div");
    n.style.cssText = "font-size:20px; font-weight:600; margin-bottom:6px; color:var(--tutor-accent, currentColor);", n.textContent = `Coming in ${t.plannedVersion}`, e.appendChild(n);
    const o = document.createElement("div");
    if (o.style.cssText = "opacity:0.85; max-width:60ch;", o.textContent = t.description, e.appendChild(o), t.docsHref) {
      const a = document.createElement("a");
      a.href = t.docsHref, a.target = "_blank", a.rel = "noopener", a.textContent = "Read the contract →", a.style.cssText = "display:inline-block; margin-top:14px; color:var(--tutor-accent, #f6d77a); text-decoration:none; font-size:13px;", e.appendChild(a);
    }
    this.appendChild(e);
  }
}
class K extends H {
  static get observedAttributes() {
    return ["problem", "host", "tenant", "mode", "level", "return-url"];
  }
  _stubMeta() {
    return {
      capability: "Problem walker",
      plannedVersion: "v0.3",
      description: "Single-problem deep-dive — progressive hints, step-by-step solution, inline AI tutor chat scoped to this problem. Wire up the listeners today; they fire once the backend ships.",
      docsHref: "https://github.com/mukesh-bansal/canvasa-sdk#canvasa-problem-walker"
    };
  }
}
typeof customElements < "u" && !customElements.get("canvasa-problem-walker") && customElements.define("canvasa-problem-walker", K);
class X extends H {
  static get observedAttributes() {
    return ["domain", "level", "host", "tenant", "user-id", "compact", "highlight"];
  }
  _stubMeta() {
    return {
      capability: "Skill tree",
      plannedVersion: "v0.3",
      description: "Concept-graph visualization with user-progress overlay. Highlights mastered nodes, surfaces suggested next concepts, drills into any node to launch the relevant lesson or problem walker. Wire up the click listener today; it fires once the renderer ships.",
      docsHref: "https://github.com/mukesh-bansal/canvasa-sdk#canvasa-skill-tree"
    };
  }
}
typeof customElements < "u" && !customElements.get("canvasa-skill-tree") && customElements.define("canvasa-skill-tree", X);
class Y extends H {
  static get observedAttributes() {
    return ["host", "tenant", "voice", "topic-context", "user-id", "open"];
  }
  _stubMeta() {
    return {
      capability: "Coach chat",
      plannedVersion: "v0.3",
      description: "Free-form text + voice chat with the Canvas A coach. Travels with the student across lesson / problem walker / skill tree, hands off to those surfaces via canvasa-coach-action events. Wire up the listener today; it fires once the streaming backend ships.",
      docsHref: "https://github.com/mukesh-bansal/canvasa-sdk#canvasa-coach-chat"
    };
  }
}
typeof customElements < "u" && !customElements.get("canvasa-coach-chat") && customElements.define("canvasa-coach-chat", Y);
R();
typeof window < "u" && (window.canvasa = window.canvasa ?? { version: S });
export {
  S as CANVASA_SDK_VERSION,
  J as CanvasaChalkboardElement,
  Y as CanvasaCoachChatElement,
  K as CanvasaProblemWalkerElement,
  X as CanvasaSkillTreeElement
};
//# sourceMappingURL=canvasa-sdk.js.map
