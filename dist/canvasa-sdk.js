const S = "0.1.0-alpha.8";
let I = "https://canvasa.olympiz.ai", T = "default";
function j(i) {
  i.host && (I = i.host.replace(/\/$/, "")), i.tenant && (T = i.tenant);
}
function P(i, t) {
  const e = new URL(`${I}/api${i}`);
  if (t)
    for (const [o, n] of Object.entries(t))
      n != null && n !== "" && e.searchParams.set(o, String(n));
  return e.toString();
}
async function _(i, t) {
  const e = await fetch(P(i, t), {
    headers: { "X-Tutor-Tenant": T, Accept: "application/json" },
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
      "X-Tutor-Tenant": T,
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
    headers: { "X-Tutor-Tenant": T, Accept: "application/json" },
    body: t,
    credentials: "omit"
  });
  if (!e.ok) throw new Error(`canvasa-api ${i} HTTP ${e.status}`);
  return await e.json();
}
const w = {
  inventoryCounts: () => _("/inventory-counts"),
  // Heavy legacy endpoints — kept for back-compat with older SDK clients
  // pinned to a tag. New code MUST use the headers + section variants below.
  libraryTopics: () => _("/library-topics"),
  problemsLibrary: () => _("/problems-library"),
  // Phase 8 — lazy-load endpoints. headers: KB. section: ~5-15 KB per page.
  libraryTopicHeaders: () => _("/library-topics/headers"),
  libraryTopicSection: (i, t = 0, e = 30, o = "all", n = "") => _("/library-topics/section", {
    name: i,
    offset: t,
    limit: e,
    level: o,
    q: n
  }),
  problemsLibraryHeaders: () => _("/problems-library/headers"),
  problemsLibrarySection: (i, t = 0, e = 30, o = "all", n = "") => _("/problems-library/section", {
    name: i,
    offset: t,
    limit: e,
    level: o,
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
}, F = ':root,.tutor-root{--tutor-bg: #fbfaf6;--tutor-surface: #ffffff;--tutor-surface-soft: #f6f4ee;--tutor-text: #1a1a2e;--tutor-muted: #4a4a5a;--tutor-faint: #8b8b9b;--tutor-border: #e7ecf3;--tutor-border-soft: #efefe7;--tutor-accent: #c9a227;--tutor-accent-soft: rgba(201, 162, 39, .12);--tutor-accent-strong:#8f7016;--tutor-on-accent: #14213d;--tutor-primary: #14213d;--tutor-primary-hover:#0a162b;--tutor-on-primary: #ffffff;--tutor-success: #047857;--tutor-warning: #b45309;--tutor-danger: #b91c1c;--tutor-radius: 12px;--tutor-radius-sm: 8px;--tutor-radius-lg: 18px;--tutor-font-display: "Playfair Display", Georgia, serif;--tutor-font-body: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;--tutor-font-mono: "JetBrains Mono", ui-monospace, monospace;--tutor-shadow-sm: 0 1px 3px rgba(0,0,0,.04);--tutor-shadow: 0 4px 14px rgba(0,0,0,.06)}.tutor-page{max-width:1100px;margin:0 auto;padding:32px 16px 64px;font-family:var(--tutor-font-body);color:var(--tutor-text);background:var(--tutor-bg)}.tutor-hero{text-align:center;margin-bottom:40px}.tutor-hero h1{font-family:var(--tutor-font-display);font-size:clamp(2rem,4vw,3rem);line-height:1.15;margin:0 0 8px;color:var(--tutor-text);font-weight:700}.tutor-hero h1 em{color:var(--tutor-accent-strong);font-style:italic}.tutor-hero p{color:var(--tutor-muted);font-size:1.05rem;margin:0}.tutor-tabs{display:flex;flex-wrap:wrap;gap:24px;border-bottom:1px solid var(--tutor-border);margin-bottom:24px}.tutor-tab{background:transparent;border:none;border-bottom:2px solid transparent;margin-bottom:-1px;padding:10px 0;font:inherit;color:var(--tutor-muted);cursor:pointer;font-size:.95rem;white-space:nowrap;transition:color .15s,border-color .15s}.tutor-tab:hover{color:var(--tutor-text)}.tutor-tab.is-active{color:var(--tutor-text);border-bottom-color:var(--tutor-accent-strong);font-weight:500}.tutor-tab__count{color:var(--tutor-muted);font-size:.78rem;margin-left:4px;font-weight:400}.tutor-section{background:var(--tutor-surface);border:1px solid var(--tutor-border);border-radius:var(--tutor-radius);padding:20px 22px;margin-bottom:16px;box-shadow:var(--tutor-shadow-sm)}.tutor-section h2{font-family:var(--tutor-font-display);font-size:1.35rem;font-weight:600;margin:0 0 12px;color:var(--tutor-text)}.tutor-section h3{font-family:var(--tutor-font-display);font-size:1.05rem;font-weight:500;margin:0 0 8px;color:var(--tutor-text);display:flex;align-items:center;gap:8px}.tutor-section__sub{font-size:.78rem;color:var(--tutor-muted);margin:-8px 0 14px}.tutor-input{display:block;width:100%;padding:12px 14px;border-radius:var(--tutor-radius-sm);border:1px solid var(--tutor-border);background:var(--tutor-surface);color:var(--tutor-text);font:inherit;font-size:.95rem;transition:border-color .15s,box-shadow .15s}.tutor-input::placeholder{color:var(--tutor-faint)}.tutor-input:focus{outline:none;border-color:var(--tutor-accent-strong);box-shadow:0 0 0 3px var(--tutor-accent-soft)}.tutor-input--sm{padding:8px 12px;font-size:.9rem}.tutor-row{display:flex;gap:10px;flex-wrap:wrap}@media (min-width: 640px){.tutor-row{flex-wrap:nowrap}}.tutor-row>.tutor-input{flex:1 1 auto}.tutor-btn{display:inline-flex;align-items:center;justify-content:center;padding:12px 22px;border-radius:var(--tutor-radius-sm);border:1px solid transparent;background:var(--tutor-primary);color:var(--tutor-on-primary);font:inherit;font-weight:500;cursor:pointer;white-space:nowrap;transition:background .15s,opacity .15s}.tutor-btn:hover:not(:disabled){background:var(--tutor-primary-hover)}.tutor-btn:disabled{opacity:.5;cursor:not-allowed}.tutor-chip{display:inline-flex;align-items:center;padding:6px 12px;border-radius:999px;border:1px solid var(--tutor-border);background:var(--tutor-surface);color:var(--tutor-muted);font:inherit;font-size:.78rem;font-weight:500;cursor:pointer;white-space:nowrap;transition:all .15s}.tutor-chip:hover{border-color:var(--tutor-accent-strong);color:var(--tutor-text)}.tutor-chip.is-active{background:var(--tutor-primary);color:var(--tutor-on-primary);border-color:var(--tutor-primary)}.tutor-sources{display:grid;grid-template-columns:1fr;gap:10px;margin-bottom:14px}@media (min-width: 720px){.tutor-sources{grid-template-columns:1fr 1fr 1fr}}.tutor-source{text-align:left;padding:12px 14px;border-radius:var(--tutor-radius-sm);border:2px solid var(--tutor-border);background:var(--tutor-surface);font:inherit;color:var(--tutor-text);cursor:pointer;transition:border-color .15s,background .15s}.tutor-source:hover{border-color:var(--tutor-accent-strong)}.tutor-source.is-active{border-color:var(--tutor-accent-strong);background:var(--tutor-accent-soft)}.tutor-source__row{display:flex;gap:10px;align-items:flex-start}.tutor-source__dot{width:12px;height:12px;border-radius:50%;border:2px solid var(--tutor-border);margin-top:4px;flex-shrink:0}.tutor-source.is-active .tutor-source__dot{border-color:var(--tutor-accent-strong);background:var(--tutor-accent-strong)}.tutor-source__lbl{font-weight:500;font-size:.9rem}.tutor-source__sub{font-size:.78rem;color:var(--tutor-muted);margin-top:2px}.tutor-results{margin-top:12px;border:1px solid var(--tutor-border);border-radius:var(--tutor-radius-sm);background:var(--tutor-bg);overflow:hidden}.tutor-result{display:block;width:100%;text-align:left;padding:12px 14px;border:none;background:transparent;font:inherit;color:var(--tutor-text);cursor:pointer;transition:background .12s;border-bottom:1px solid var(--tutor-border)}.tutor-result:last-child{border-bottom:none}.tutor-result:hover{background:var(--tutor-surface-soft)}.tutor-result__title{font-size:.9rem;font-weight:500}.tutor-result__blurb{font-size:.78rem;color:var(--tutor-muted);margin-top:2px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}.tutor-hint{font-size:.72rem;color:var(--tutor-muted);margin-top:12px}.tutor-drop{border:2px dashed var(--tutor-border);background:var(--tutor-bg);border-radius:var(--tutor-radius-sm);padding:32px 16px;text-align:center;cursor:pointer;transition:border-color .15s,background .15s}.tutor-drop:hover{border-color:var(--tutor-accent-strong)}.tutor-drop.is-hover{border-color:var(--tutor-accent-strong);background:var(--tutor-accent-soft)}.tutor-drop__icon{font-size:1.6rem;margin-bottom:8px}.tutor-drop__hint{color:var(--tutor-text);font-size:.92rem}.tutor-drop__hint strong{color:var(--tutor-accent-strong)}.tutor-card-grid{display:grid;grid-template-columns:1fr;gap:10px}@media (min-width: 720px){.tutor-card-grid{grid-template-columns:1fr 1fr}}@media (min-width: 1024px){.tutor-card-grid{grid-template-columns:1fr 1fr 1fr}}.tutor-card{display:block;padding:12px 14px;border-radius:var(--tutor-radius-sm);border:1px solid var(--tutor-border);background:var(--tutor-bg);color:var(--tutor-text);text-decoration:none;transition:border-color .15s,box-shadow .15s}.tutor-card:hover{border-color:var(--tutor-accent-strong);box-shadow:var(--tutor-shadow-sm)}.tutor-card__title{font-size:.9rem}.tutor-card__meta{margin-top:6px;display:flex;gap:10px;font-size:.7rem;color:var(--tutor-muted);align-items:center}.tutor-card__cached{color:var(--tutor-success)}.tutor-prob{display:block;padding:12px 14px;border-radius:var(--tutor-radius-sm);border:1px solid var(--tutor-border);background:var(--tutor-bg);color:var(--tutor-text);text-decoration:none;margin-bottom:8px;transition:border-color .15s,box-shadow .15s}.tutor-prob:hover{border-color:var(--tutor-accent-strong);box-shadow:var(--tutor-shadow-sm)}.tutor-prob__head{display:flex;flex-wrap:wrap;gap:8px;align-items:center}.tutor-prob__title{font-size:.9rem;font-weight:500}.tutor-prob__statement{margin-top:6px;font-size:.78rem;color:var(--tutor-muted);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}.tutor-pill{font-size:.62rem;padding:2px 6px;border-radius:4px;border:1px solid var(--tutor-border);background:var(--tutor-surface);color:var(--tutor-muted);text-transform:lowercase;letter-spacing:.04em}.tutor-pill--easy{color:var(--tutor-success);border-color:#0478574d}.tutor-pill--medium{color:var(--tutor-warning);border-color:#b453094d}.tutor-pill--hard{color:var(--tutor-danger);border-color:#b91c1c4d}.tutor-status{margin-top:12px;font-size:.85rem;color:var(--tutor-muted)}.tutor-status--error{color:var(--tutor-danger)}.tutor-empty{font-size:.88rem;color:var(--tutor-muted);padding:12px 0}.tutor-modal-backdrop{position:fixed;top:0;right:0;bottom:0;left:0;z-index:9000;display:flex;align-items:center;justify-content:center;padding:16px;background:#0d122073;-webkit-backdrop-filter:blur(3px);backdrop-filter:blur(3px)}.tutor-modal{background:var(--tutor-surface);border-radius:var(--tutor-radius-lg);box-shadow:0 20px 60px #0000004d;padding:28px 32px;width:100%;max-width:560px;font-family:var(--tutor-font-body);color:var(--tutor-text)}.tutor-modal__eyebrow{font-size:11px;font-weight:600;color:var(--tutor-accent-strong);text-transform:uppercase;letter-spacing:.18em;margin-bottom:6px}.tutor-modal__title{font-family:var(--tutor-font-display);font-size:22px;font-weight:600;margin:0 0 4px;color:var(--tutor-text)}.tutor-modal__sub{font-size:12px;color:var(--tutor-muted);margin:0 0 18px}.tutor-modal__option{display:block;width:100%;text-align:left;padding:16px;border-radius:var(--tutor-radius-sm);border:2px solid var(--tutor-border);background:var(--tutor-surface);font:inherit;color:var(--tutor-text);cursor:pointer;margin-bottom:10px;transition:border-color .12s,background .12s}.tutor-modal__option:hover{border-color:var(--tutor-accent-strong)}.tutor-modal__option.is-active{border-color:var(--tutor-accent-strong);background:var(--tutor-accent-soft)}.tutor-modal__option-row{display:flex;align-items:flex-start;gap:12px}.tutor-modal__radio{margin-top:4px;width:16px;height:16px;border-radius:50%;border:2px solid var(--tutor-border);flex-shrink:0;display:flex;align-items:center;justify-content:center}.tutor-modal__option.is-active .tutor-modal__radio{border-color:var(--tutor-accent-strong)}.tutor-modal__radio-dot{width:8px;height:8px;border-radius:50%;background:var(--tutor-accent-strong)}.tutor-modal__option-title{font-family:var(--tutor-font-display);font-style:italic;font-weight:600;font-size:16px;color:var(--tutor-accent-strong);display:inline}.tutor-modal__option-badge{margin-left:8px;font-size:9px;font-weight:800;letter-spacing:.14em;padding:2px 6px;border-radius:3px;background:#3fcc7a2e;color:#1a7341;text-transform:uppercase}.tutor-modal__option-desc{font-size:12px;color:var(--tutor-muted);margin-top:6px;line-height:1.5}.tutor-modal__actions{margin-top:20px;display:flex;align-items:center;justify-content:space-between;gap:12px}.tutor-btn--ghost{background:transparent;color:var(--tutor-muted);border:1px solid var(--tutor-border);padding:8px 16px;border-radius:var(--tutor-radius-sm);font:inherit;font-size:13px;cursor:pointer;transition:color .12s,border-color .12s}.tutor-btn--ghost:hover:not(:disabled){color:var(--tutor-text);border-color:var(--tutor-accent-strong)}.tutor-btn--ghost:disabled{opacity:.5;cursor:not-allowed}.canvasa-tutor{position:relative}.canvasa-tutor__pill{position:absolute;top:12px;right:12px;z-index:50;padding:4px 10px;border-radius:999px;background:var(--tutor-pill-bg, #0b1428);color:var(--tutor-pill-fg, #f6d77a);font:600 11px/1 JetBrains Mono,ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.04em;border:1px solid rgba(246,215,122,.25);box-shadow:0 2px 8px #0000002e;pointer-events:none;-webkit-user-select:none;user-select:none}', g = 30;
function L() {
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
function p(i) {
  return i == null ? "" : String(i).replace(/[&<>"']/g, (t) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[t]);
}
function f(i) {
  return p(i).replace(/`/g, "&#96;");
}
let C = null, E = null;
async function N(i) {
  if (i === "off") return null;
  if (C) return C;
  if (typeof window > "u") return null;
  if (typeof window.renderMathInElement == "function")
    return C = window.renderMathInElement, C;
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
          return C = window.renderMathInElement, C;
        await new Promise((o) => setTimeout(o, 100));
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
    const o = document.createElement("script");
    o.src = i, o.async = !0, o.crossOrigin = "anonymous", o.onload = () => t(), o.onerror = (n) => e(n), document.head.appendChild(o);
  });
}
function R(i, t) {
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
    G(), this.classList.add("canvasa-tutor", "tutor-root", "tutor-page"), j({ host: L(), tenant: this._tenant() });
    const t = this._readTabFromHash(), e = (() => {
      try {
        return window.sessionStorage.getItem("canvasa:active-tab") || "";
      } catch {
        return "";
      }
    })(), o = this.getAttribute("default-tab") || "ondemand", n = ["ondemand", "concepts", "problems"];
    this._tab = n.includes(t) ? t : n.includes(e) ? e : o, this._writeTabState(this._tab);
    const r = this.getAttribute("lesson"), a = this.getAttribute("ask");
    if (r) {
      const s = this.getAttribute("lesson-mode") || "teach";
      this._launch("lesson", { lesson: r, mode: s });
    } else if (a) {
      const s = this.getAttribute("lesson-mode") || "teach";
      this._launch("ask", { ask: a, mode: s });
    }
    this._render(), this._bootstrap();
  }
  disconnectedCallback() {
    var t;
    (t = this._abort) == null || t.abort();
  }
  attributeChangedCallback(t, e, o) {
    !this.isConnected || e === o || (t === "tenant" ? (j({ tenant: this._tenant() }), this._bootstrap()) : t === "default-tab" && o ? (this._tab = o, this._render()) : this._render());
  }
  // ── Programmatic API ────────────────────────────────────────────
  setTenant(t) {
    this.setAttribute("tenant", t);
  }
  setTab(t) {
    this._tab = t, this._writeTabState(t), this._render(), this._fireTab();
  }
  _readTabFromHash() {
    if (typeof window > "u" || !window.location) return "";
    const e = (window.location.hash || "").match(/(?:^|[#&])tab=([a-z]+)/i);
    return e ? e[1].toLowerCase() : "";
  }
  _writeTabState(t) {
    if (!(typeof window > "u")) {
      try {
        window.sessionStorage.setItem("canvasa:active-tab", t);
      } catch {
      }
      if (window.location && window.history && window.history.replaceState)
        try {
          const e = new URL(window.location.href), n = (e.hash || "").replace(/^#/, "").split("&").filter((r) => r && !/^tab=/.test(r));
          n.push(`tab=${t}`), e.hash = n.join("&"), window.history.replaceState(null, "", e.toString());
        } catch {
        }
    }
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
      this._brand = await w.brand(t);
    } catch (e) {
      this._brand = { tenant: t, tokens: {}, copy: {}, mark: {} }, this._fireError("brand-config-fetch-failed", String(e), e);
    }
  }
  async _loadCounts() {
    try {
      this._counts = await w.inventoryCounts();
    } catch (t) {
      this._fireError("inventory-counts-failed", String(t), t);
    }
  }
  _applyBrandTokens() {
    var o;
    const t = (o = this._brand) == null ? void 0 : o.tokens;
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
    for (const [n, r] of Object.entries(t)) {
      const a = e[n] ?? `--tutor-${n}`;
      typeof r == "string" && this.style.setProperty(a, r);
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
    var o;
    const e = this.querySelector(`[slot="${CSS.escape(t)}"]`);
    return ((o = e == null ? void 0 : e.textContent) == null ? void 0 : o.trim()) || null;
  }
  _render() {
    var b, x, m, v, y, k;
    const t = ((b = this._brand) == null ? void 0 : b.copy) ?? {}, e = this._slotText("hero-title") ?? t.heroTitle ?? "What do you want to <em>learn</em> today?", o = this._slotText("hero-sub") ?? t.heroSub ?? "Drop a question.", n = (this.getAttribute("hide-tabs") || "").split(",").map((l) => l.trim()).filter(Boolean), r = ["ondemand", "concepts", "problems"].filter((l) => !n.includes(l)), a = {
      ondemand: ((x = t.tabs) == null ? void 0 : x.ondemand) ?? "On-demand",
      concepts: ((m = t.tabs) == null ? void 0 : m.concepts) ?? "Concept library",
      problems: ((v = t.tabs) == null ? void 0 : v.problems) ?? "Problems"
    }, s = {
      ondemand: "5 ways",
      concepts: this._counts ? String(this._counts.concepts_total) : "",
      problems: this._counts ? String(this._counts.problems_total) : ""
    }, d = ((y = this._brand) == null ? void 0 : y.canvas_a_version) || ((k = this._brand) == null ? void 0 : k.olympiz_version) || "", h = d ? `SDK ${S} · srv ${d}` : `SDK ${S}`;
    this.innerHTML = `
      <div class="canvasa-tutor__pill" title="Canvas A SDK ${S}${d ? ` · canvas-a backend ${d}` : ""}">${p(h)}</div>
      <section class="tutor-hero">
        <h1>${e}</h1>
        <p>${p(o)}</p>
      </section>
      <nav class="tutor-tabs" role="tablist">
        ${r.map((l) => `
          <button type="button" role="tab" aria-selected="${l === this._tab}"
                  data-canvasa-tab="${l}"
                  class="tutor-tab${l === this._tab ? " is-active" : ""}">
            ${p(a[l])}
            ${s[l] ? `<span class="tutor-tab__count">${p(s[l])}</span>` : ""}
          </button>`).join("")}
      </nav>
      <div data-canvasa-tabpanel="${this._tab}" class="canvasa-tutor__panel"></div>
      <div class="canvasa-tutor__footer">
        <slot name="footer"></slot>
      </div>
    `, this.querySelectorAll("[data-canvasa-tab]").forEach((l) => {
      l.addEventListener("click", () => {
        const $ = l.dataset.canvasaTab;
        this.setTab($);
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
    var d, h;
    const e = ((d = this._brand) == null ? void 0 : d.copy) ?? {}, o = e.placeholderTopic ?? "e.g. Bernoulli's principle · Lenz's law · Maxwell's equations", n = this._slotText("cta-label") ?? e.ctaLabel ?? "AI Tutor →";
    t.innerHTML = `
      <section class="tutor-section">
        <h2>Type a topic.</h2>
        <div class="tutor-row">
          <input type="text" class="tutor-input" data-canvasa-topic
                 placeholder="${f(o)}" value="${f(this._topic)}">
          <button type="button" class="tutor-btn" data-canvasa-launch-topic ${this._busy || !this._topic.trim() ? "disabled" : ""}>
            ${this._busy ? "Working…" : p(n)}
          </button>
        </div>
        ${this._busyMsg || this._errorMsg ? `<div class="tutor-status${this._errorMsg ? " tutor-status--error" : ""}">${p(this._errorMsg || this._busyMsg)}</div>` : ""}
      </section>
      <section class="tutor-section" data-canvasa-source-picker></section>
      <section class="tutor-section">
        <h2>Or, drop a chapter or paper.</h2>
        <div data-canvasa-pdf-drop></div>
      </section>
    `;
    const r = t.querySelector("[data-canvasa-topic]");
    r && (r.addEventListener("input", () => {
      this._topic = r.value;
      const c = t.querySelector("[data-canvasa-launch-topic]");
      c && (c.disabled = this._busy || !this._topic.trim());
    }), r.addEventListener("keydown", (c) => {
      c.key === "Enter" && this._handleTopicGo();
    })), (h = t.querySelector("[data-canvasa-launch-topic]")) == null || h.addEventListener("click", () => this._handleTopicGo());
    const a = t.querySelector("[data-canvasa-source-picker]");
    a && this._mountSourcePicker(a);
    const s = t.querySelector("[data-canvasa-pdf-drop]");
    s && this._mountPdfDrop(s);
  }
  _handleTopicGo() {
    const t = this._topic.trim();
    if (!t) return;
    const e = this.getAttribute("lesson-mode") || "picker", o = new CustomEvent("canvasa-lesson-click", {
      detail: { slug: "", title: t, cached: !1, source: "ondemand", ask: t, mode: e },
      bubbles: !0,
      composed: !0,
      cancelable: !0
    });
    this.dispatchEvent(o) && (e === "teach" || e === "guide" ? this._dispatchLaunch({ slug: "", title: t, cached: !1, source: "ondemand", ask: t }, e) : this._openModePicker({ slug: "", title: t, cached: !1, source: "ondemand", ask: t }));
  }
  // Source picker — Internal wiki + External wiki, debounced search
  _mountSourcePicker(t) {
    let e = "internal", o = "", n = [], r = !1, a = null;
    const s = [
      { key: "internal", lbl: "Internal wiki", sub: "SuperStem Physics + AI + HS concept graphs" },
      { key: "external", lbl: "External wiki", sub: "Wikipedia — live" }
    ], d = () => {
      t.innerHTML = `
        <h2>Or, point at a source.</h2>
        <div class="tutor-sources">
          ${s.map((c) => `
            <button type="button" class="tutor-source${e === c.key ? " is-active" : ""}" data-canvasa-src="${c.key}">
              <div class="tutor-source__row">
                <span class="tutor-source__dot"></span>
                <div>
                  <div class="tutor-source__lbl">${p(c.lbl)}</div>
                  <div class="tutor-source__sub">${p(c.sub)}</div>
                </div>
              </div>
            </button>`).join("")}
        </div>
        <input type="text" class="tutor-input tutor-input--sm" data-canvasa-src-q
               value="${f(o)}" placeholder="Type to search the selected source…">
        ${r ? '<div class="tutor-status">Searching…</div>' : ""}
        ${n.length ? `
          <div class="tutor-results">
            ${n.slice(0, 10).map((c) => `
              <button type="button" class="tutor-result" data-canvasa-pick='${f(JSON.stringify({ url: c.url, title: c.title }))}'>
                <div class="tutor-result__ttl">${p(c.title)}</div>
                ${c.description || c.desc || c.snippet ? `<div class="tutor-result__desc">${p(c.description || c.desc || c.snippet || "")}</div>` : ""}
              </button>`).join("")}
          </div>` : ""}
        <div class="tutor-hint">
          Searches across SuperStem Physics Wiki (1400+ articles) · AI Wiki · HS Physics/Math/Chemistry concept graphs.
        </div>
      `, t.querySelectorAll("[data-canvasa-src]").forEach((c) => {
        c.addEventListener("click", () => {
          e = c.dataset.canvasaSrc, d();
        });
      });
      const h = t.querySelector("[data-canvasa-src-q]");
      h == null || h.addEventListener("input", () => {
        if (o = h.value, a && clearTimeout(a), !o.trim()) {
          n = [], d();
          return;
        }
        a = window.setTimeout(async () => {
          r = !0, d();
          try {
            n = (e === "external" ? await w.wikiSearch(o.trim()) : await w.superstemSearch(o.trim())).results || [];
          } catch {
            n = [];
          } finally {
            r = !1, d();
          }
        }, 300);
      }), t.querySelectorAll("[data-canvasa-pick]").forEach((c) => {
        c.addEventListener("click", () => {
          try {
            const b = JSON.parse(c.dataset.canvasaPick || "{}");
            b.url && this._launchUrl(b.url, b.title);
          } catch {
          }
        });
      });
    };
    d();
  }
  _mountPdfDrop(t) {
    t.innerHTML = `
      <label class="tutor-pdfdrop" data-canvasa-pdf-label>
        <input type="file" accept="application/pdf" hidden data-canvasa-pdf-input>
        <span>Drop a PDF here, or <u>browse</u></span>
      </label>
    `;
    const e = t.querySelector("[data-canvasa-pdf-input]"), o = t.querySelector("[data-canvasa-pdf-label]");
    e == null || e.addEventListener("change", () => {
      var r;
      const n = (r = e.files) == null ? void 0 : r[0];
      n && this._launchPdf(n);
    }), o == null || o.addEventListener("dragover", (n) => {
      n.preventDefault(), o.classList.add("is-drag");
    }), o == null || o.addEventListener("dragleave", () => o.classList.remove("is-drag")), o == null || o.addEventListener("drop", (n) => {
      var a, s;
      n.preventDefault(), o.classList.remove("is-drag");
      const r = (s = (a = n.dataTransfer) == null ? void 0 : a.files) == null ? void 0 : s[0];
      r && r.type === "application/pdf" && this._launchPdf(r);
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
    const e = t.querySelector("[data-canvasa-concepts-sub]"), o = t.querySelector("[data-canvasa-concept-topics]");
    if (!e || !o) return;
    t.querySelectorAll("[data-canvasa-clvl]").forEach((s) => {
      s.addEventListener("click", () => {
        this._conceptLevel = s.dataset.canvasaClvl, t.querySelectorAll("[data-canvasa-clvl]").forEach((d) => d.classList.toggle("is-active", d.dataset.canvasaClvl === this._conceptLevel)), this._topicSectionCache.clear(), this._pageState.clear(), this._rerenderConceptTopics(o);
      });
    });
    let n = null;
    const r = t.querySelector("[data-canvasa-concept-q]");
    if (r == null || r.addEventListener("input", () => {
      this._conceptQuery = r.value, n && clearTimeout(n), n = window.setTimeout(() => {
        this._topicSectionCache.clear(), this._pageState.clear(), this._rerenderConceptTopics(o);
      }, 220);
    }), !this._topicHeaders.length)
      try {
        const s = await w.libraryTopicHeaders();
        this._topicHeaders = s.topics || [];
      } catch (s) {
        e.textContent = "Failed to load: " + String(s), this._fireError("library-topics-failed", String(s), s);
        return;
      }
    const a = this._topicHeaders.reduce((s, d) => s + (d.count || 0), 0);
    e.textContent = `${a.toLocaleString()} lessons across ${this._topicHeaders.length} topics — click a section to expand.`, this._rerenderConceptTopics(o);
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
    const e = this._conceptLevel, o = this._conceptQuery.trim(), n = e !== "all" || !!o;
    t.innerHTML = this._topicHeaders.map((r, a) => {
      const s = this._conceptLevelCount(r), d = this._expanded.get("c:" + a) ?? a === 0, h = o ? `${r.count} lessons · search active` : `${s} lesson${s === 1 ? "" : "s"}${n ? ` of ${r.count}` : ""}`, c = e !== "all" && s === 0 && !o;
      return `
        <div class="tutor-topic${d ? " is-expanded" : ""}" data-canvasa-ctopic="${a}" data-canvasa-cname="${f(r.name)}" style="${c ? "display:none;" : ""}">
          <div class="tutor-topic__head" data-canvasa-ctoggle="${a}">
            <span class="tutor-topic__icon">${p(r.icon || "📘")}</span>
            <span class="tutor-topic__name">${p(r.name)}</span>
            <span class="tutor-topic__count">${p(h)}</span>
            <span class="tutor-topic__chev">▶</span>
          </div>
          <div class="tutor-topic__body" data-canvasa-ctopic-body="${a}" data-rendered="0"></div>
        </div>`;
    }).join(""), t.querySelectorAll("[data-canvasa-ctoggle]").forEach((r) => {
      r.addEventListener("click", () => {
        const a = +(r.dataset.canvasaCtoggle || "0"), s = t.querySelector(`[data-canvasa-ctopic="${a}"]`);
        if (!s) return;
        const d = !s.classList.contains("is-expanded");
        s.classList.toggle("is-expanded", d), this._expanded.set("c:" + a, d), d && this._renderConceptTopicBody(t, a, 0);
      });
    }), this._topicHeaders.forEach((r, a) => {
      (this._expanded.get("c:" + a) ?? a === 0) && this._renderConceptTopicBody(t, a, this._pageState.get("c:" + a) ?? 0);
    });
  }
  async _renderConceptTopicBody(t, e, o) {
    var y, k;
    const n = this._topicHeaders[e];
    if (!n) return;
    const r = t.querySelector(`[data-canvasa-ctopic-body="${e}"]`);
    if (!r) return;
    const a = this._conceptLevel, s = this._conceptQuery.trim(), d = n.name, h = Math.max(0, o * g), c = this._topicSectionCache.get(d), b = c && c.level === a && c.q === s && c.offset === h && c.limit === g;
    let x, m;
    if (b && c)
      x = c.lessons, m = c.total;
    else {
      r.innerHTML = '<div class="tutor-empty">Loading…</div>', r.dataset.rendered = "0";
      try {
        const l = await w.libraryTopicSection(n.name, h, g, a, s);
        x = l.lessons || [], m = l.total || 0, this._topicSectionCache.set(d, { lessons: x, total: m, offset: h, limit: g, level: a, q: s });
      } catch (l) {
        r.innerHTML = `<div class="tutor-empty">Failed to load: ${p(String(l))}</div>`, this._fireError("library-topic-section-failed", String(l), l);
        return;
      }
    }
    const v = Math.max(1, Math.ceil(m / g));
    o < 0 && (o = 0), o >= v && (o = v - 1), this._pageState.set("c:" + e, o), r.innerHTML = `
      <div class="tutor-card-grid">
        ${x.map((l) => {
      const $ = l.level || "HS";
      return `<button type="button" class="tutor-card" data-canvasa-lesson="${f(l.slug)}" data-canvasa-cached="${l.cached ? "1" : "0"}" data-canvasa-title="${f(l.title)}" data-canvasa-source="concept">
            <div class="tutor-card__title">${p(l.title)}</div>
            <div class="tutor-card__meta">
              <span>${p($)}</span>
              ${l.cached ? '<span class="tutor-card__cached">✓ cached</span>' : ""}
              ${l.guide_cached ? '<span class="tutor-card__guide">⚡ guide</span>' : ""}
            </div>
          </button>`;
    }).join("")}
      </div>
      ${m > g ? `
        <div class="tutor-pag">
          <button type="button" data-canvasa-cpag-prev ${o <= 0 ? "disabled" : ""}>← Prev</button>
          <span>Page ${o + 1} of ${v} · ${m} lesson${m === 1 ? "" : "s"}</span>
          <button type="button" data-canvasa-cpag-next ${o >= v - 1 ? "disabled" : ""}>Next →</button>
        </div>` : m === 0 ? '<div class="tutor-empty">No matches in this topic.</div>' : ""}
    `, r.dataset.rendered = "1", (y = r.querySelector("[data-canvasa-cpag-prev]")) == null || y.addEventListener("click", (l) => {
      l.stopPropagation(), this._renderConceptTopicBody(t, e, o - 1);
    }), (k = r.querySelector("[data-canvasa-cpag-next]")) == null || k.addEventListener("click", (l) => {
      l.stopPropagation(), this._renderConceptTopicBody(t, e, o + 1);
    }), r.querySelectorAll("[data-canvasa-lesson]").forEach((l) => {
      l.addEventListener("click", () => {
        this._handleLessonCardClick({
          slug: l.dataset.canvasaLesson || "",
          title: l.dataset.canvasaTitle || "",
          cached: l.dataset.canvasaCached === "1",
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
    const e = t.querySelector("[data-canvasa-problems-sub]"), o = t.querySelector("[data-canvasa-problem-sections]");
    if (!e || !o) return;
    t.querySelectorAll("[data-canvasa-pchip]").forEach((s) => {
      s.addEventListener("click", () => {
        this._probChip = s.dataset.canvasaPchip, t.querySelectorAll("[data-canvasa-pchip]").forEach((d) => d.classList.toggle("is-active", d.dataset.canvasaPchip === this._probChip)), this._problemSectionCache.clear(), this._pageState.clear(), this._rerenderProblemSections(o);
      });
    });
    let n = null;
    const r = t.querySelector("[data-canvasa-prob-q]");
    if (r == null || r.addEventListener("input", () => {
      this._probQuery = r.value, n && clearTimeout(n), n = window.setTimeout(() => {
        this._problemSectionCache.clear(), this._pageState.clear(), this._rerenderProblemSections(o);
      }, 220);
    }), !this._problemHeaders.length)
      try {
        const s = await w.problemsLibraryHeaders();
        this._problemHeaders = s.sections || [];
      } catch (s) {
        e.textContent = "Failed to load: " + String(s), this._fireError("problems-library-failed", String(s), s);
        return;
      }
    const a = this._problemHeaders.reduce((s, d) => s + (d.count || 0), 0);
    e.textContent = `${a.toLocaleString()} problems across ${this._problemHeaders.length} sections — click a section to expand.`, this._rerenderProblemSections(o);
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
    const e = this._probChip, o = this._probQuery.trim(), n = e !== "all" || !!o;
    t.innerHTML = this._problemHeaders.map((r, a) => {
      const s = this._problemChipCount(r), d = this._expanded.get("p:" + a) ?? a === 0, h = o ? `${r.count} problems · search active` : `${s} problem${s === 1 ? "" : "s"}${n ? ` of ${r.count}` : ""}`, c = e !== "all" && s === 0 && !o;
      return `
        <div class="tutor-topic${d ? " is-expanded" : ""}" data-canvasa-psec="${a}" data-canvasa-pname="${f(r.name)}" style="${c ? "display:none;" : ""}">
          <div class="tutor-topic__head" data-canvasa-ptoggle="${a}">
            <span class="tutor-topic__icon">${p(r.icon || "📘")}</span>
            <span class="tutor-topic__name">${p(r.name)}</span>
            <span class="tutor-topic__count">${p(h)}</span>
            <span class="tutor-topic__chev">▶</span>
          </div>
          <div class="tutor-topic__body" data-canvasa-psec-body="${a}" data-rendered="0"></div>
        </div>`;
    }).join(""), t.querySelectorAll("[data-canvasa-ptoggle]").forEach((r) => {
      r.addEventListener("click", () => {
        const a = +(r.dataset.canvasaPtoggle || "0"), s = t.querySelector(`[data-canvasa-psec="${a}"]`);
        if (!s) return;
        const d = !s.classList.contains("is-expanded");
        s.classList.toggle("is-expanded", d), this._expanded.set("p:" + a, d), d && this._renderProblemSectionBody(t, a, 0);
      });
    }), this._problemHeaders.forEach((r, a) => {
      (this._expanded.get("p:" + a) ?? a === 0) && this._renderProblemSectionBody(t, a, this._pageState.get("p:" + a) ?? 0);
    });
  }
  async _renderProblemSectionBody(t, e, o) {
    var l, $;
    const n = this._problemHeaders[e];
    if (!n) return;
    const r = t.querySelector(`[data-canvasa-psec-body="${e}"]`);
    if (!r) return;
    const a = this._probChip, s = this._probChipToLevel(), d = this._probQuery.trim(), h = n.name, c = Math.max(0, o * g), b = this._problemSectionCache.get(h), x = b && b.chip === a && b.q === d && b.offset === c && b.limit === g;
    let m, v;
    if (x && b)
      m = b.problems, v = b.total;
    else {
      r.innerHTML = '<div class="tutor-empty">Loading…</div>', r.dataset.rendered = "0";
      try {
        const u = await w.problemsLibrarySection(n.name, c, g, s, d);
        m = u.problems || [], v = u.total || 0, this._problemSectionCache.set(h, { problems: m, total: v, offset: c, limit: g, chip: a, q: d });
      } catch (u) {
        r.innerHTML = `<div class="tutor-empty">Failed to load: ${p(String(u))}</div>`, this._fireError("problems-library-section-failed", String(u), u);
        return;
      }
    }
    const y = Math.max(1, Math.ceil(v / g));
    o < 0 && (o = 0), o >= y && (o = y - 1), this._pageState.set("p:" + e, o), r.innerHTML = `
      <div class="tutor-prob-list">
        ${m.map((u) => {
      const U = u.level || "UG", z = u.difficulty || "medium";
      return `<button type="button" class="tutor-prob" data-canvasa-lesson="${f(u.slug)}" data-canvasa-cached="${u.cached ? "1" : "0"}" data-canvasa-title="${f(u.title)}" data-canvasa-source="problem" data-canvasa-statement="${f(u.statement || "")}">
            <div class="tutor-prob__head">
              <span class="tutor-prob__title">${p(u.title)}</span>
              <span class="tutor-pill tutor-pill--${f(z)}">${p(z)}</span>
              <span class="tutor-pill">${p(U)}</span>
              ${u.source ? `<span class="tutor-prob__src">· ${p(u.source)}</span>` : ""}
              ${u.cached ? '<span class="tutor-prob__cached" title="Cached — instant load">✓</span>' : ""}
              ${u.guide_cached ? '<span class="tutor-prob__guide" title="Figure-It-Out cached">⚡</span>' : ""}
            </div>
            ${u.statement ? `<div class="tutor-prob__statement">${u.statement}</div>` : ""}
          </button>`;
    }).join("")}
      </div>
      ${v > g ? `
        <div class="tutor-pag">
          <button type="button" data-canvasa-ppag-prev ${o <= 0 ? "disabled" : ""}>← Prev</button>
          <span>Page ${o + 1} of ${y} · ${v} result${v === 1 ? "" : "s"}</span>
          <button type="button" data-canvasa-ppag-next ${o >= y - 1 ? "disabled" : ""}>Next →</button>
        </div>` : v === 0 ? '<div class="tutor-empty">No matches in this section.</div>' : ""}
    `, r.dataset.rendered = "1", (l = r.querySelector("[data-canvasa-ppag-prev]")) == null || l.addEventListener("click", (u) => {
      u.stopPropagation(), this._renderProblemSectionBody(t, e, o - 1);
    }), ($ = r.querySelector("[data-canvasa-ppag-next]")) == null || $.addEventListener("click", (u) => {
      u.stopPropagation(), this._renderProblemSectionBody(t, e, o + 1);
    }), r.querySelectorAll("[data-canvasa-lesson]").forEach((u) => {
      u.addEventListener("click", () => {
        this._handleLessonCardClick({
          slug: u.dataset.canvasaLesson || "",
          title: u.dataset.canvasaTitle || "",
          cached: u.dataset.canvasaCached === "1",
          source: "problem",
          statement: u.dataset.canvasaStatement || ""
        });
      });
    });
    const k = await N(this.getAttribute("katex-cdn"));
    R(r, k);
  }
  // ── Lesson card click → mode picker → launch ────────────────────
  _handleLessonCardClick(t) {
    const e = this.getAttribute("lesson-mode") || "picker", o = new CustomEvent("canvasa-lesson-click", {
      detail: { ...t, mode: e },
      bubbles: !0,
      composed: !0,
      cancelable: !0
    });
    this.dispatchEvent(o) && (e === "teach" || e === "guide" ? this._dispatchLaunch(t, e) : this._openModePicker(t));
  }
  /**
   * Route the lesson click to /tutor?lesson= or /tutor?ask= based on whether
   * the backend actually has a prebuilt lesson for this slug:
   *   - cached=true   → ?lesson=<slug>       (instant load, lesson JSON exists)
   *   - cached=false  → ?ask=<statement|title>  (canvas-a live-builds the lesson)
   *
   * Without this routing, uncached problems 404 on /tutor?lesson=<slug>.
   * Concepts from cmap_canonical are also uncached by default — same fallback
   * applies (uses title since they have no statement).
   */
  _dispatchLaunch(t, e) {
    if (t.cached && t.slug) {
      this._launch("lesson", { lesson: t.slug, mode: e, statement: t.statement ?? "" });
      return;
    }
    const o = (t.ask || t.statement || t.title || "").trim();
    o ? this._launch("ask", { ask: o, mode: e }) : t.slug && this._launch("lesson", { lesson: t.slug, mode: e });
  }
  _openModePicker(t) {
    var r;
    const e = document.createElement("div");
    e.className = "tutor-mode-modal", e.innerHTML = `
      <div class="tutor-mode-modal__card" role="dialog" aria-label="Pick a learning mode">
        <h3 class="tutor-mode-modal__title">${p(t.title || "Pick a learning mode")}</h3>
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
    const o = () => e.remove();
    e.addEventListener("click", (a) => {
      a.target === e && o();
    }), (r = e.querySelector("[data-cancel]")) == null || r.addEventListener("click", o), e.querySelectorAll("[data-mode]").forEach((a) => {
      a.addEventListener("click", () => {
        const s = a.dataset.mode || "teach";
        o(), this._dispatchLaunch(t, s === "guide" ? "guide" : "teach");
      });
    });
    const n = (a) => {
      a.key === "Escape" && (o(), document.removeEventListener("keydown", n));
    };
    document.addEventListener("keydown", n);
  }
  // ── Launch (redirect to /tutor or /guide) ───────────────────────
  _launch(t, e) {
    const o = new CustomEvent("canvasa-launch", {
      detail: { kind: t, payload: e },
      bubbles: !0,
      composed: !0,
      cancelable: !0
    });
    if (!this.dispatchEvent(o)) return;
    const r = (e.mode === "guide" ? "guide" : "tutor") === "guide" ? "/guide" : "/tutor", a = new URLSearchParams();
    if (e.lesson && a.set("lesson", e.lesson), e.ask && a.set("ask", e.ask), a.set("brand", this._tenant()), typeof window < "u" && window.location) {
      a.set("return", window.location.href);
      const s = `${L()}${r}?${a.toString()}`, d = this.getAttribute("lesson-target") || "self";
      if (d === "blank")
        window.open(s, "_blank", "noopener");
      else if (d.startsWith(".") || d.startsWith("#")) {
        const h = document.querySelector(d);
        h && "src" in h && (h.src = s);
      } else
        window.location.assign(s);
    }
  }
  _launchUrl(t, e) {
    this._busy = !0, this._busyMsg = "Opening tutor…", this._render();
    const o = new URLSearchParams();
    o.set("ask", e && e.trim() || t), o.set("brand", this._tenant()), typeof window < "u" && window.location && o.set("return", window.location.href), window.location.assign(`${L()}/tutor?${o.toString()}`);
  }
  async _launchPdf(t) {
    this._busy = !0, this._busyMsg = "Reading PDF…", this._errorMsg = "", this._render();
    try {
      const e = await w.generateFromPdf(t);
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
  _fireError(t, e, o) {
    this.dispatchEvent(new CustomEvent("canvasa-error", {
      detail: { code: t, message: e, cause: o },
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
function W() {
  typeof window > "u" || window.customElements.get("canvasa-tutor") || window.customElements.define("canvasa-tutor", A);
}
const V = "https://canvasa.olympiz.ai", K = "default";
class Q extends HTMLElement {
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
    const t = (this.getAttribute("host") || V).replace(/\/$/, ""), o = (this.getAttribute("mode") || "teach").toLowerCase() === "guide" ? "/guide" : "/tutor", n = (this.getAttribute("lesson") || "").trim(), r = (this.getAttribute("tenant") || K).trim(), a = (this.getAttribute("return-url") || "").trim(), s = new URLSearchParams();
    return n && s.set("lesson", n), s.set("brand", r), a && s.set("return", a), `${t}${o}?${s.toString()}`;
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
    const o = document.createElement("iframe");
    o.src = e, o.title = "Canvas A — Lesson", o.setAttribute("allow", "autoplay; microphone; clipboard-write"), o.setAttribute("allowfullscreen", ""), o.style.cssText = "width:100%; height:100%; min-height:inherit; border:0; display:block; background:#0d1620;", o.addEventListener("load", () => {
      this._ready = !0, this.dispatchEvent(new CustomEvent("canvasa-ready", {
        bubbles: !0,
        composed: !0,
        detail: { version: S, lesson: t, mode: this.getAttribute("mode") || "teach" }
      }));
    }), o.addEventListener("error", () => {
      this.dispatchEvent(new CustomEvent("canvasa-error", {
        bubbles: !0,
        composed: !0,
        detail: { code: "chalkboard-load-failed", message: "Iframe failed to load", cause: { url: e } }
      }));
    }), this.appendChild(o), this._iframe = o;
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
    const o = e.type;
    o === "canvasa:close" || o === "canvas-a:close" ? this.dispatchEvent(new CustomEvent("canvasa-chalkboard-close", {
      bubbles: !0,
      composed: !0,
      detail: e
    })) : o === "canvasa:lesson-complete" ? this.dispatchEvent(new CustomEvent("canvasa-chalkboard-complete", {
      bubbles: !0,
      composed: !0,
      detail: e
    })) : o === "canvasa:ready" && !this._ready && (this._ready = !0, this.dispatchEvent(new CustomEvent("canvasa-ready", {
      bubbles: !0,
      composed: !0,
      detail: e
    })));
  }
}
typeof customElements < "u" && !customElements.get("canvasa-chalkboard") && customElements.define("canvasa-chalkboard", Q);
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
    const o = document.createElement("div");
    o.style.cssText = "display:inline-block; font-size:11px; letter-spacing:0.12em; text-transform:uppercase; opacity:0.7; margin-bottom:8px;", o.textContent = `Canvas A SDK · ${t.capability}`, e.appendChild(o);
    const n = document.createElement("div");
    n.style.cssText = "font-size:20px; font-weight:600; margin-bottom:6px; color:var(--tutor-accent, currentColor);", n.textContent = `Coming in ${t.plannedVersion}`, e.appendChild(n);
    const r = document.createElement("div");
    if (r.style.cssText = "opacity:0.85; max-width:60ch;", r.textContent = t.description, e.appendChild(r), t.docsHref) {
      const a = document.createElement("a");
      a.href = t.docsHref, a.target = "_blank", a.rel = "noopener", a.textContent = "Read the contract →", a.style.cssText = "display:inline-block; margin-top:14px; color:var(--tutor-accent, #f6d77a); text-decoration:none; font-size:13px;", e.appendChild(a);
    }
    this.appendChild(e);
  }
}
class J extends H {
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
typeof customElements < "u" && !customElements.get("canvasa-problem-walker") && customElements.define("canvasa-problem-walker", J);
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
W();
typeof window < "u" && (window.canvasa = window.canvasa ?? { version: S });
export {
  S as CANVASA_SDK_VERSION,
  Q as CanvasaChalkboardElement,
  Y as CanvasaCoachChatElement,
  J as CanvasaProblemWalkerElement,
  X as CanvasaSkillTreeElement
};
//# sourceMappingURL=canvasa-sdk.js.map
