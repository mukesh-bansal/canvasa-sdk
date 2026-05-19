const w = "0.1.0-alpha.1";
let A = "https://canvasa.olympiz.ai", k = "default";
function T(i) {
  i.host && (A = i.host.replace(/\/$/, "")), i.tenant && (k = i.tenant);
}
function E(i, t) {
  const e = new URL(`${A}/api${i}`);
  if (t)
    for (const [o, r] of Object.entries(t))
      r != null && r !== "" && e.searchParams.set(o, String(r));
  return e.toString();
}
async function g(i, t) {
  const e = await fetch(E(i, t), {
    headers: { "X-Tutor-Tenant": k, Accept: "application/json" },
    credentials: "omit"
  });
  if (!e.ok) throw new Error(`canvasa-api ${i} HTTP ${e.status}`);
  return await e.json();
}
async function P(i, t) {
  const e = await fetch(E(i), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Tutor-Tenant": k,
      Accept: "application/json"
    },
    body: JSON.stringify(t),
    credentials: "omit"
  });
  if (!e.ok) throw new Error(`canvasa-api ${i} HTTP ${e.status}`);
  return await e.json();
}
async function D(i, t) {
  const e = await fetch(E(i), {
    method: "POST",
    headers: { "X-Tutor-Tenant": k, Accept: "application/json" },
    body: t,
    credentials: "omit"
  });
  if (!e.ok) throw new Error(`canvasa-api ${i} HTTP ${e.status}`);
  return await e.json();
}
const _ = {
  inventoryCounts: () => g("/inventory-counts"),
  libraryTopics: () => g("/library-topics"),
  problemsLibrary: () => g("/problems-library"),
  generateLesson: (i) => P("/generate-lesson", { topic: i }),
  generateFromUrl: (i, t) => P("/generate-from-url", { url: i, title: t }),
  generateFromPdf: (i) => {
    const t = new FormData();
    return t.append("file", i), D("/generate-from-pdf", t);
  },
  lessonStatus: (i) => g(`/lesson-status/${encodeURIComponent(i)}`),
  wikiSearch: (i) => g("/wiki-opensearch", { q: i }),
  superstemSearch: (i) => g("/superstem-search", { q: i }),
  // Phase 3 endpoint — graceful fallback handled in canvasa-tutor.ts when missing
  brand: (i) => g(`/brand/${encodeURIComponent(i)}`)
}, j = ':root,.tutor-root{--tutor-bg: #fbfaf6;--tutor-surface: #ffffff;--tutor-surface-soft: #f6f4ee;--tutor-text: #1a1a2e;--tutor-muted: #4a4a5a;--tutor-faint: #8b8b9b;--tutor-border: #e7ecf3;--tutor-border-soft: #efefe7;--tutor-accent: #c9a227;--tutor-accent-soft: rgba(201, 162, 39, .12);--tutor-accent-strong:#8f7016;--tutor-on-accent: #14213d;--tutor-primary: #14213d;--tutor-primary-hover:#0a162b;--tutor-on-primary: #ffffff;--tutor-success: #047857;--tutor-warning: #b45309;--tutor-danger: #b91c1c;--tutor-radius: 12px;--tutor-radius-sm: 8px;--tutor-radius-lg: 18px;--tutor-font-display: "Playfair Display", Georgia, serif;--tutor-font-body: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;--tutor-font-mono: "JetBrains Mono", ui-monospace, monospace;--tutor-shadow-sm: 0 1px 3px rgba(0,0,0,.04);--tutor-shadow: 0 4px 14px rgba(0,0,0,.06)}.tutor-page{max-width:1100px;margin:0 auto;padding:32px 16px 64px;font-family:var(--tutor-font-body);color:var(--tutor-text);background:var(--tutor-bg)}.tutor-hero{text-align:center;margin-bottom:40px}.tutor-hero h1{font-family:var(--tutor-font-display);font-size:clamp(2rem,4vw,3rem);line-height:1.15;margin:0 0 8px;color:var(--tutor-text);font-weight:700}.tutor-hero h1 em{color:var(--tutor-accent-strong);font-style:italic}.tutor-hero p{color:var(--tutor-muted);font-size:1.05rem;margin:0}.tutor-tabs{display:flex;flex-wrap:wrap;gap:24px;border-bottom:1px solid var(--tutor-border);margin-bottom:24px}.tutor-tab{background:transparent;border:none;border-bottom:2px solid transparent;margin-bottom:-1px;padding:10px 0;font:inherit;color:var(--tutor-muted);cursor:pointer;font-size:.95rem;white-space:nowrap;transition:color .15s,border-color .15s}.tutor-tab:hover{color:var(--tutor-text)}.tutor-tab.is-active{color:var(--tutor-text);border-bottom-color:var(--tutor-accent-strong);font-weight:500}.tutor-tab__count{color:var(--tutor-muted);font-size:.78rem;margin-left:4px;font-weight:400}.tutor-section{background:var(--tutor-surface);border:1px solid var(--tutor-border);border-radius:var(--tutor-radius);padding:20px 22px;margin-bottom:16px;box-shadow:var(--tutor-shadow-sm)}.tutor-section h2{font-family:var(--tutor-font-display);font-size:1.35rem;font-weight:600;margin:0 0 12px;color:var(--tutor-text)}.tutor-section h3{font-family:var(--tutor-font-display);font-size:1.05rem;font-weight:500;margin:0 0 8px;color:var(--tutor-text);display:flex;align-items:center;gap:8px}.tutor-section__sub{font-size:.78rem;color:var(--tutor-muted);margin:-8px 0 14px}.tutor-input{display:block;width:100%;padding:12px 14px;border-radius:var(--tutor-radius-sm);border:1px solid var(--tutor-border);background:var(--tutor-surface);color:var(--tutor-text);font:inherit;font-size:.95rem;transition:border-color .15s,box-shadow .15s}.tutor-input::placeholder{color:var(--tutor-faint)}.tutor-input:focus{outline:none;border-color:var(--tutor-accent-strong);box-shadow:0 0 0 3px var(--tutor-accent-soft)}.tutor-input--sm{padding:8px 12px;font-size:.9rem}.tutor-row{display:flex;gap:10px;flex-wrap:wrap}@media (min-width: 640px){.tutor-row{flex-wrap:nowrap}}.tutor-row>.tutor-input{flex:1 1 auto}.tutor-btn{display:inline-flex;align-items:center;justify-content:center;padding:12px 22px;border-radius:var(--tutor-radius-sm);border:1px solid transparent;background:var(--tutor-primary);color:var(--tutor-on-primary);font:inherit;font-weight:500;cursor:pointer;white-space:nowrap;transition:background .15s,opacity .15s}.tutor-btn:hover:not(:disabled){background:var(--tutor-primary-hover)}.tutor-btn:disabled{opacity:.5;cursor:not-allowed}.tutor-chip{display:inline-flex;align-items:center;padding:6px 12px;border-radius:999px;border:1px solid var(--tutor-border);background:var(--tutor-surface);color:var(--tutor-muted);font:inherit;font-size:.78rem;font-weight:500;cursor:pointer;white-space:nowrap;transition:all .15s}.tutor-chip:hover{border-color:var(--tutor-accent-strong);color:var(--tutor-text)}.tutor-chip.is-active{background:var(--tutor-primary);color:var(--tutor-on-primary);border-color:var(--tutor-primary)}.tutor-sources{display:grid;grid-template-columns:1fr;gap:10px;margin-bottom:14px}@media (min-width: 720px){.tutor-sources{grid-template-columns:1fr 1fr 1fr}}.tutor-source{text-align:left;padding:12px 14px;border-radius:var(--tutor-radius-sm);border:2px solid var(--tutor-border);background:var(--tutor-surface);font:inherit;color:var(--tutor-text);cursor:pointer;transition:border-color .15s,background .15s}.tutor-source:hover{border-color:var(--tutor-accent-strong)}.tutor-source.is-active{border-color:var(--tutor-accent-strong);background:var(--tutor-accent-soft)}.tutor-source__row{display:flex;gap:10px;align-items:flex-start}.tutor-source__dot{width:12px;height:12px;border-radius:50%;border:2px solid var(--tutor-border);margin-top:4px;flex-shrink:0}.tutor-source.is-active .tutor-source__dot{border-color:var(--tutor-accent-strong);background:var(--tutor-accent-strong)}.tutor-source__lbl{font-weight:500;font-size:.9rem}.tutor-source__sub{font-size:.78rem;color:var(--tutor-muted);margin-top:2px}.tutor-results{margin-top:12px;border:1px solid var(--tutor-border);border-radius:var(--tutor-radius-sm);background:var(--tutor-bg);overflow:hidden}.tutor-result{display:block;width:100%;text-align:left;padding:12px 14px;border:none;background:transparent;font:inherit;color:var(--tutor-text);cursor:pointer;transition:background .12s;border-bottom:1px solid var(--tutor-border)}.tutor-result:last-child{border-bottom:none}.tutor-result:hover{background:var(--tutor-surface-soft)}.tutor-result__title{font-size:.9rem;font-weight:500}.tutor-result__blurb{font-size:.78rem;color:var(--tutor-muted);margin-top:2px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}.tutor-hint{font-size:.72rem;color:var(--tutor-muted);margin-top:12px}.tutor-drop{border:2px dashed var(--tutor-border);background:var(--tutor-bg);border-radius:var(--tutor-radius-sm);padding:32px 16px;text-align:center;cursor:pointer;transition:border-color .15s,background .15s}.tutor-drop:hover{border-color:var(--tutor-accent-strong)}.tutor-drop.is-hover{border-color:var(--tutor-accent-strong);background:var(--tutor-accent-soft)}.tutor-drop__icon{font-size:1.6rem;margin-bottom:8px}.tutor-drop__hint{color:var(--tutor-text);font-size:.92rem}.tutor-drop__hint strong{color:var(--tutor-accent-strong)}.tutor-card-grid{display:grid;grid-template-columns:1fr;gap:10px}@media (min-width: 720px){.tutor-card-grid{grid-template-columns:1fr 1fr}}@media (min-width: 1024px){.tutor-card-grid{grid-template-columns:1fr 1fr 1fr}}.tutor-card{display:block;padding:12px 14px;border-radius:var(--tutor-radius-sm);border:1px solid var(--tutor-border);background:var(--tutor-bg);color:var(--tutor-text);text-decoration:none;transition:border-color .15s,box-shadow .15s}.tutor-card:hover{border-color:var(--tutor-accent-strong);box-shadow:var(--tutor-shadow-sm)}.tutor-card__title{font-size:.9rem}.tutor-card__meta{margin-top:6px;display:flex;gap:10px;font-size:.7rem;color:var(--tutor-muted);align-items:center}.tutor-card__cached{color:var(--tutor-success)}.tutor-prob{display:block;padding:12px 14px;border-radius:var(--tutor-radius-sm);border:1px solid var(--tutor-border);background:var(--tutor-bg);color:var(--tutor-text);text-decoration:none;margin-bottom:8px;transition:border-color .15s,box-shadow .15s}.tutor-prob:hover{border-color:var(--tutor-accent-strong);box-shadow:var(--tutor-shadow-sm)}.tutor-prob__head{display:flex;flex-wrap:wrap;gap:8px;align-items:center}.tutor-prob__title{font-size:.9rem;font-weight:500}.tutor-prob__statement{margin-top:6px;font-size:.78rem;color:var(--tutor-muted);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}.tutor-pill{font-size:.62rem;padding:2px 6px;border-radius:4px;border:1px solid var(--tutor-border);background:var(--tutor-surface);color:var(--tutor-muted);text-transform:lowercase;letter-spacing:.04em}.tutor-pill--easy{color:var(--tutor-success);border-color:#0478574d}.tutor-pill--medium{color:var(--tutor-warning);border-color:#b453094d}.tutor-pill--hard{color:var(--tutor-danger);border-color:#b91c1c4d}.tutor-status{margin-top:12px;font-size:.85rem;color:var(--tutor-muted)}.tutor-status--error{color:var(--tutor-danger)}.tutor-empty{font-size:.88rem;color:var(--tutor-muted);padding:12px 0}.tutor-modal-backdrop{position:fixed;top:0;right:0;bottom:0;left:0;z-index:9000;display:flex;align-items:center;justify-content:center;padding:16px;background:#0d122073;-webkit-backdrop-filter:blur(3px);backdrop-filter:blur(3px)}.tutor-modal{background:var(--tutor-surface);border-radius:var(--tutor-radius-lg);box-shadow:0 20px 60px #0000004d;padding:28px 32px;width:100%;max-width:560px;font-family:var(--tutor-font-body);color:var(--tutor-text)}.tutor-modal__eyebrow{font-size:11px;font-weight:600;color:var(--tutor-accent-strong);text-transform:uppercase;letter-spacing:.18em;margin-bottom:6px}.tutor-modal__title{font-family:var(--tutor-font-display);font-size:22px;font-weight:600;margin:0 0 4px;color:var(--tutor-text)}.tutor-modal__sub{font-size:12px;color:var(--tutor-muted);margin:0 0 18px}.tutor-modal__option{display:block;width:100%;text-align:left;padding:16px;border-radius:var(--tutor-radius-sm);border:2px solid var(--tutor-border);background:var(--tutor-surface);font:inherit;color:var(--tutor-text);cursor:pointer;margin-bottom:10px;transition:border-color .12s,background .12s}.tutor-modal__option:hover{border-color:var(--tutor-accent-strong)}.tutor-modal__option.is-active{border-color:var(--tutor-accent-strong);background:var(--tutor-accent-soft)}.tutor-modal__option-row{display:flex;align-items:flex-start;gap:12px}.tutor-modal__radio{margin-top:4px;width:16px;height:16px;border-radius:50%;border:2px solid var(--tutor-border);flex-shrink:0;display:flex;align-items:center;justify-content:center}.tutor-modal__option.is-active .tutor-modal__radio{border-color:var(--tutor-accent-strong)}.tutor-modal__radio-dot{width:8px;height:8px;border-radius:50%;background:var(--tutor-accent-strong)}.tutor-modal__option-title{font-family:var(--tutor-font-display);font-style:italic;font-weight:600;font-size:16px;color:var(--tutor-accent-strong);display:inline}.tutor-modal__option-badge{margin-left:8px;font-size:9px;font-weight:800;letter-spacing:.14em;padding:2px 6px;border-radius:3px;background:#3fcc7a2e;color:#1a7341;text-transform:uppercase}.tutor-modal__option-desc{font-size:12px;color:var(--tutor-muted);margin-top:6px;line-height:1.5}.tutor-modal__actions{margin-top:20px;display:flex;align-items:center;justify-content:space-between;gap:12px}.tutor-btn--ghost{background:transparent;color:var(--tutor-muted);border:1px solid var(--tutor-border);padding:8px 16px;border-radius:var(--tutor-radius-sm);font:inherit;font-size:13px;cursor:pointer;transition:color .12s,border-color .12s}.tutor-btn--ghost:hover:not(:disabled){color:var(--tutor-text);border-color:var(--tutor-accent-strong)}.tutor-btn--ghost:disabled{opacity:.5;cursor:not-allowed}', f = 30;
function $() {
  return typeof window < "u" && window.CANVASA_HOST ? window.CANVASA_HOST : "https://canvasa.olympiz.ai";
}
let S = !1;
function O() {
  if (S || typeof document > "u") return;
  const i = "canvasa-sdk-styles";
  if (document.getElementById(i)) {
    S = !0;
    return;
  }
  const t = document.createElement("style");
  t.id = i, t.textContent = j, document.head.appendChild(t), S = !0;
}
function h(i) {
  return i == null ? "" : String(i).replace(/[&<>"']/g, (t) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[t]);
}
function m(i) {
  return h(i).replace(/`/g, "&#96;");
}
let x = null, y = null;
async function H(i) {
  if (i === "off") return null;
  if (x) return x;
  if (typeof window > "u") return null;
  if (typeof window.renderMathInElement == "function")
    return x = window.renderMathInElement, x;
  if (y) return y;
  const t = i || "https://cdn.jsdelivr.net/npm/katex@0.16.10/dist";
  return y = (async () => {
    try {
      if (!document.querySelector(`link[href^="${t}/katex.min.css"]`)) {
        const e = document.createElement("link");
        e.rel = "stylesheet", e.href = `${t}/katex.min.css`, e.crossOrigin = "anonymous", document.head.appendChild(e);
      }
      await q(`${t}/katex.min.js`), await q(`${t}/contrib/auto-render.min.js`);
      for (let e = 0; e < 30; e++) {
        if (typeof window.renderMathInElement == "function")
          return x = window.renderMathInElement, x;
        await new Promise((o) => setTimeout(o, 100));
      }
    } catch (e) {
      console.warn("[canvasa-sdk] KaTeX load failed; raw $...$ will show", e);
    }
    return null;
  })(), y;
}
function q(i) {
  return new Promise((t, e) => {
    if (document.querySelector(`script[src="${i}"]`)) return t();
    const o = document.createElement("script");
    o.src = i, o.async = !0, o.crossOrigin = "anonymous", o.onload = () => t(), o.onerror = (r) => e(r), document.head.appendChild(o);
  });
}
function B(i, t) {
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
const C = class C extends HTMLElement {
  constructor() {
    super(...arguments), this._brand = null, this._ready = !1, this._tab = "ondemand", this._topic = "", this._conceptQuery = "", this._conceptLevel = "all", this._probQuery = "", this._probChip = "all", this._topicsData = [], this._problemsData = [], this._counts = null, this._busy = !1, this._busyMsg = "", this._errorMsg = "", this._expanded = /* @__PURE__ */ new Map(), this._pageState = /* @__PURE__ */ new Map();
  }
  // ── Lifecycle ───────────────────────────────────────────────────
  connectedCallback() {
    O(), this.classList.add("canvasa-tutor", "tutor-root", "tutor-page"), T({ host: $(), tenant: this._tenant() });
    const t = this.getAttribute("default-tab") || "ondemand";
    this._tab = t;
    const e = this.getAttribute("lesson"), o = this.getAttribute("ask");
    if (e) {
      const r = this.getAttribute("lesson-mode") || "teach";
      this._launch("lesson", { lesson: e, mode: r });
    } else if (o) {
      const r = this.getAttribute("lesson-mode") || "teach";
      this._launch("ask", { ask: o, mode: r });
    }
    this._render(), this._bootstrap();
  }
  disconnectedCallback() {
    var t;
    (t = this._abort) == null || t.abort();
  }
  attributeChangedCallback(t, e, o) {
    !this.isConnected || e === o || (t === "tenant" ? (T({ tenant: this._tenant() }), this._bootstrap()) : t === "default-tab" && o ? (this._tab = o, this._render()) : this._render());
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
      this._brand = await _.brand(t);
    } catch (e) {
      this._brand = { tenant: t, tokens: {}, copy: {}, mark: {} }, this._fireError("brand-config-fetch-failed", String(e), e);
    }
  }
  async _loadCounts() {
    try {
      this._counts = await _.inventoryCounts();
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
    for (const [r, a] of Object.entries(t)) {
      const n = e[r] ?? `--tutor-${r}`;
      typeof a == "string" && this.style.setProperty(n, a);
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
    var p, d, b, u;
    const t = ((p = this._brand) == null ? void 0 : p.copy) ?? {}, e = this._slotText("hero-title") ?? t.heroTitle ?? "What do you want to <em>learn</em> today?", o = this._slotText("hero-sub") ?? t.heroSub ?? "Drop a question.", r = (this.getAttribute("hide-tabs") || "").split(",").map((l) => l.trim()).filter(Boolean), a = ["ondemand", "concepts", "problems"].filter((l) => !r.includes(l)), n = {
      ondemand: ((d = t.tabs) == null ? void 0 : d.ondemand) ?? "On-demand",
      concepts: ((b = t.tabs) == null ? void 0 : b.concepts) ?? "Concept library",
      problems: ((u = t.tabs) == null ? void 0 : u.problems) ?? "Problems"
    }, s = {
      ondemand: "5 ways",
      concepts: this._counts ? String(this._counts.concepts_total) : "",
      problems: this._counts ? String(this._counts.problems_total) : ""
    };
    this.innerHTML = `
      <div class="canvasa-tutor__pill" title="Canvas A SDK · ${w}">v${w}</div>
      <section class="tutor-hero">
        <h1>${e}</h1>
        <p>${h(o)}</p>
      </section>
      <nav class="tutor-tabs" role="tablist">
        ${a.map((l) => `
          <button type="button" role="tab" aria-selected="${l === this._tab}"
                  data-canvasa-tab="${l}"
                  class="tutor-tab${l === this._tab ? " is-active" : ""}">
            ${h(n[l])}
            ${s[l] ? `<span class="tutor-tab__count">${h(s[l])}</span>` : ""}
          </button>`).join("")}
      </nav>
      <div data-canvasa-tabpanel="${this._tab}" class="canvasa-tutor__panel"></div>
      <div class="canvasa-tutor__footer">
        <slot name="footer"></slot>
      </div>
    `, this.querySelectorAll("[data-canvasa-tab]").forEach((l) => {
      l.addEventListener("click", () => {
        const v = l.dataset.canvasaTab;
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
    var c, p;
    const e = ((c = this._brand) == null ? void 0 : c.copy) ?? {}, o = e.placeholderTopic ?? "e.g. Bernoulli's principle · Lenz's law · Maxwell's equations", r = this._slotText("cta-label") ?? e.ctaLabel ?? "AI Tutor →";
    t.innerHTML = `
      <section class="tutor-section">
        <h2>Type a topic.</h2>
        <div class="tutor-row">
          <input type="text" class="tutor-input" data-canvasa-topic
                 placeholder="${m(o)}" value="${m(this._topic)}">
          <button type="button" class="tutor-btn" data-canvasa-launch-topic ${this._busy || !this._topic.trim() ? "disabled" : ""}>
            ${this._busy ? "Working…" : h(r)}
          </button>
        </div>
        ${this._busyMsg || this._errorMsg ? `<div class="tutor-status${this._errorMsg ? " tutor-status--error" : ""}">${h(this._errorMsg || this._busyMsg)}</div>` : ""}
      </section>
      <section class="tutor-section" data-canvasa-source-picker></section>
      <section class="tutor-section">
        <h2>Or, drop a chapter or paper.</h2>
        <div data-canvasa-pdf-drop></div>
      </section>
    `;
    const a = t.querySelector("[data-canvasa-topic]");
    a && (a.addEventListener("input", () => {
      this._topic = a.value;
      const d = t.querySelector("[data-canvasa-launch-topic]");
      d && (d.disabled = this._busy || !this._topic.trim());
    }), a.addEventListener("keydown", (d) => {
      d.key === "Enter" && this._handleTopicGo();
    })), (p = t.querySelector("[data-canvasa-launch-topic]")) == null || p.addEventListener("click", () => this._handleTopicGo());
    const n = t.querySelector("[data-canvasa-source-picker]");
    n && this._mountSourcePicker(n);
    const s = t.querySelector("[data-canvasa-pdf-drop]");
    s && this._mountPdfDrop(s);
  }
  _handleTopicGo() {
    const t = this._topic.trim();
    t && this._launch("ask", { ask: t, mode: "teach" });
  }
  // Source picker — Internal wiki + External wiki, debounced search
  _mountSourcePicker(t) {
    let e = "internal", o = "", r = [], a = !1, n = null;
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
                  <div class="tutor-source__lbl">${h(d.lbl)}</div>
                  <div class="tutor-source__sub">${h(d.sub)}</div>
                </div>
              </div>
            </button>`).join("")}
        </div>
        <input type="text" class="tutor-input tutor-input--sm" data-canvasa-src-q
               value="${m(o)}" placeholder="Type to search the selected source…">
        ${a ? '<div class="tutor-status">Searching…</div>' : ""}
        ${r.length ? `
          <div class="tutor-results">
            ${r.slice(0, 10).map((d) => `
              <button type="button" class="tutor-result" data-canvasa-pick='${m(JSON.stringify({ url: d.url, title: d.title }))}'>
                <div class="tutor-result__ttl">${h(d.title)}</div>
                ${d.description || d.desc || d.snippet ? `<div class="tutor-result__desc">${h(d.description || d.desc || d.snippet || "")}</div>` : ""}
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
      const p = t.querySelector("[data-canvasa-src-q]");
      p == null || p.addEventListener("input", () => {
        if (o = p.value, n && clearTimeout(n), !o.trim()) {
          r = [], c();
          return;
        }
        n = window.setTimeout(async () => {
          a = !0, c();
          try {
            r = (e === "external" ? await _.wikiSearch(o.trim()) : await _.superstemSearch(o.trim())).results || [];
          } catch {
            r = [];
          } finally {
            a = !1, c();
          }
        }, 300);
      }), t.querySelectorAll("[data-canvasa-pick]").forEach((d) => {
        d.addEventListener("click", () => {
          try {
            const b = JSON.parse(d.dataset.canvasaPick || "{}");
            b.url && this._launchUrl(b.url, b.title);
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
    const e = t.querySelector("[data-canvasa-pdf-input]"), o = t.querySelector("[data-canvasa-pdf-label]");
    e == null || e.addEventListener("change", () => {
      var a;
      const r = (a = e.files) == null ? void 0 : a[0];
      r && this._launchPdf(r);
    }), o == null || o.addEventListener("dragover", (r) => {
      r.preventDefault(), o.classList.add("is-drag");
    }), o == null || o.addEventListener("dragleave", () => o.classList.remove("is-drag")), o == null || o.addEventListener("drop", (r) => {
      var n, s;
      r.preventDefault(), o.classList.remove("is-drag");
      const a = (s = (n = r.dataTransfer) == null ? void 0 : n.files) == null ? void 0 : s[0];
      a && a.type === "application/pdf" && this._launchPdf(a);
    });
  }
  // ── Concept library tab ─────────────────────────────────────────
  async _renderConcepts(t) {
    t.innerHTML = `<section class="tutor-section">
      <h2>Concept library</h2>
      <div class="tutor-section__sub" data-canvasa-concepts-sub>Loading…</div>
      <div class="tutor-row" style="margin-bottom: 14px;">
        <input type="text" class="tutor-input tutor-input--sm" data-canvasa-concept-q
               value="${m(this._conceptQuery)}" placeholder="Search concepts…">
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
        this._conceptLevel = s.dataset.canvasaClvl, t.querySelectorAll("[data-canvasa-clvl]").forEach((c) => c.classList.toggle("is-active", c.dataset.canvasaClvl === this._conceptLevel)), this._rerenderConceptTopics(o);
      });
    });
    let r = null;
    const a = t.querySelector("[data-canvasa-concept-q]");
    if (a == null || a.addEventListener("input", () => {
      this._conceptQuery = a.value, r && clearTimeout(r), r = window.setTimeout(() => this._rerenderConceptTopics(o), 180);
    }), !this._topicsData.length)
      try {
        const s = await _.libraryTopics();
        this._topicsData = s.topics || [];
      } catch (s) {
        e.textContent = "Failed to load: " + String(s), this._fireError("library-topics-failed", String(s), s);
        return;
      }
    const n = this._topicsData.reduce((s, c) => s + (c.lessons || []).length, 0);
    e.textContent = `${n.toLocaleString()} lessons across ${this._topicsData.length} topics — click a section to expand.`, this._rerenderConceptTopics(o);
  }
  _rerenderConceptTopics(t) {
    const e = this._conceptLevel, o = this._conceptQuery.toLowerCase().trim();
    t.innerHTML = this._topicsData.map((r, a) => {
      let n = (r.lessons || []).length;
      (e !== "all" || o) && (n = (r.lessons || []).filter((p) => {
        const d = p.level || "HS", b = e === "all" || d === e, u = !o || (p.title || "").toLowerCase().includes(o);
        return b && u;
      }).length);
      const s = this._expanded.get("c:" + a) ?? a === 0, c = e !== "all" || o;
      return `
        <div class="tutor-topic${s ? " is-expanded" : ""}" data-canvasa-ctopic="${a}" style="${c && n === 0 ? "display:none;" : ""}">
          <div class="tutor-topic__head" data-canvasa-ctoggle="${a}">
            <span class="tutor-topic__icon">${h(r.icon || "📘")}</span>
            <span class="tutor-topic__name">${h(r.name)}</span>
            <span class="tutor-topic__count">${c ? `${n} of ${(r.lessons || []).length} match` : `${n} lessons`}</span>
            <span class="tutor-topic__chev">▶</span>
          </div>
          <div class="tutor-topic__body" data-canvasa-ctopic-body="${a}" data-rendered="0"></div>
        </div>`;
    }).join(""), t.querySelectorAll("[data-canvasa-ctoggle]").forEach((r) => {
      r.addEventListener("click", () => {
        const a = +(r.dataset.canvasaCtoggle || "0"), n = t.querySelector(`[data-canvasa-ctopic="${a}"]`);
        if (!n) return;
        const s = !n.classList.contains("is-expanded");
        n.classList.toggle("is-expanded", s), this._expanded.set("c:" + a, s), s && this._renderConceptTopicBody(t, a, 0);
      });
    }), this._topicsData.forEach((r, a) => {
      (this._expanded.get("c:" + a) ?? a === 0) && this._renderConceptTopicBody(t, a, this._pageState.get("c:" + a) ?? 0);
    });
  }
  _renderConceptTopicBody(t, e, o) {
    var b, u;
    const r = this._topicsData[e];
    if (!r) return;
    const a = t.querySelector(`[data-canvasa-ctopic-body="${e}"]`);
    if (!a) return;
    const n = this._conceptLevel, s = this._conceptQuery.toLowerCase().trim(), c = (r.lessons || []).filter((l) => {
      const v = l.level || "HS", z = n === "all" || v === n, M = !s || (l.title || "").toLowerCase().includes(s);
      return z && M;
    }), p = Math.max(1, Math.ceil(c.length / f));
    o < 0 && (o = 0), o >= p && (o = p - 1), this._pageState.set("c:" + e, o);
    const d = c.slice(o * f, (o + 1) * f);
    a.innerHTML = `
      <div class="tutor-card-grid">
        ${d.map((l) => {
      const v = l.level || "HS";
      return `<button type="button" class="tutor-card" data-canvasa-lesson="${m(l.slug)}" data-canvasa-cached="${l.cached ? "1" : "0"}" data-canvasa-title="${m(l.title)}" data-canvasa-source="concept">
            <div class="tutor-card__title">${h(l.title)}</div>
            <div class="tutor-card__meta">
              <span>${h(v)}</span>
              ${l.cached ? '<span class="tutor-card__cached">✓ cached</span>' : ""}
              ${l.guide_cached ? '<span class="tutor-card__guide">⚡ guide</span>' : ""}
            </div>
          </button>`;
    }).join("")}
      </div>
      ${c.length > f ? `
        <div class="tutor-pag">
          <button type="button" data-canvasa-cpag-prev ${o <= 0 ? "disabled" : ""}>← Prev</button>
          <span>Page ${o + 1} of ${p} · ${c.length} lesson${c.length === 1 ? "" : "s"}</span>
          <button type="button" data-canvasa-cpag-next ${o >= p - 1 ? "disabled" : ""}>Next →</button>
        </div>` : c.length === 0 ? '<div class="tutor-empty">No matches in this topic.</div>' : ""}
    `, a.dataset.rendered = "1", (b = a.querySelector("[data-canvasa-cpag-prev]")) == null || b.addEventListener("click", (l) => {
      l.stopPropagation(), this._renderConceptTopicBody(t, e, o - 1);
    }), (u = a.querySelector("[data-canvasa-cpag-next]")) == null || u.addEventListener("click", (l) => {
      l.stopPropagation(), this._renderConceptTopicBody(t, e, o + 1);
    }), a.querySelectorAll("[data-canvasa-lesson]").forEach((l) => {
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
               value="${m(this._probQuery)}" placeholder="Search problems…">
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
        this._probChip = s.dataset.canvasaPchip, t.querySelectorAll("[data-canvasa-pchip]").forEach((c) => c.classList.toggle("is-active", c.dataset.canvasaPchip === this._probChip)), this._rerenderProblemSections(o);
      });
    });
    let r = null;
    const a = t.querySelector("[data-canvasa-prob-q]");
    if (a == null || a.addEventListener("input", () => {
      this._probQuery = a.value, r && clearTimeout(r), r = window.setTimeout(() => this._rerenderProblemSections(o), 180);
    }), !this._problemsData.length)
      try {
        const s = await _.problemsLibrary();
        this._problemsData = s.sections || [];
      } catch (s) {
        e.textContent = "Failed to load: " + String(s), this._fireError("problems-library-failed", String(s), s);
        return;
      }
    const n = this._problemsData.reduce((s, c) => s + (c.problems || []).length, 0);
    e.textContent = `${n.toLocaleString()} problems across ${this._problemsData.length} sections — click a section to expand.`, this._rerenderProblemSections(o);
  }
  _filterProblems(t) {
    const e = this._probChip, o = this._probQuery.toLowerCase().trim();
    return (t.problems || []).filter((r) => {
      let a = e === "all";
      a || (e === "cached" ? a = !!r.cached : e === "Olympiad" ? a = r.origin === "physolympiad" || r.source_kind === "olympiad" : a = (r.level || "UG") === e);
      const n = !o || (r.title || "").toLowerCase().includes(o) || (r.statement || "").toLowerCase().includes(o);
      return a && n;
    });
  }
  _rerenderProblemSections(t) {
    const e = this._probChip !== "all" || !!this._probQuery;
    t.innerHTML = this._problemsData.map((o, r) => {
      const a = e ? this._filterProblems(o).length : (o.problems || []).length;
      return `
        <div class="tutor-topic${this._expanded.get("p:" + r) ?? r === 0 ? " is-expanded" : ""}" data-canvasa-psec="${r}" style="${e && a === 0 ? "display:none;" : ""}">
          <div class="tutor-topic__head" data-canvasa-ptoggle="${r}">
            <span class="tutor-topic__icon">${h(o.icon || "📘")}</span>
            <span class="tutor-topic__name">${h(o.name)}</span>
            <span class="tutor-topic__count">${e ? `${a} of ${(o.problems || []).length} match` : `${a} problem${a === 1 ? "" : "s"}`}</span>
            <span class="tutor-topic__chev">▶</span>
          </div>
          <div class="tutor-topic__body" data-canvasa-psec-body="${r}" data-rendered="0"></div>
        </div>`;
    }).join(""), t.querySelectorAll("[data-canvasa-ptoggle]").forEach((o) => {
      o.addEventListener("click", () => {
        const r = +(o.dataset.canvasaPtoggle || "0"), a = t.querySelector(`[data-canvasa-psec="${r}"]`);
        if (!a) return;
        const n = !a.classList.contains("is-expanded");
        a.classList.toggle("is-expanded", n), this._expanded.set("p:" + r, n), n && this._renderProblemSectionBody(t, r, 0);
      });
    }), this._problemsData.forEach((o, r) => {
      (this._expanded.get("p:" + r) ?? r === 0) && this._renderProblemSectionBody(t, r, this._pageState.get("p:" + r) ?? 0);
    });
  }
  async _renderProblemSectionBody(t, e, o) {
    var d, b;
    const r = this._problemsData[e];
    if (!r) return;
    const a = t.querySelector(`[data-canvasa-psec-body="${e}"]`);
    if (!a) return;
    const n = this._filterProblems(r), s = Math.max(1, Math.ceil(n.length / f));
    o < 0 && (o = 0), o >= s && (o = s - 1), this._pageState.set("p:" + e, o);
    const c = n.slice(o * f, (o + 1) * f);
    a.innerHTML = `
      <div class="tutor-prob-list">
        ${c.map((u) => {
      const l = u.level || "UG", v = u.difficulty || "medium";
      return `<button type="button" class="tutor-prob" data-canvasa-lesson="${m(u.slug)}" data-canvasa-cached="${u.cached ? "1" : "0"}" data-canvasa-title="${m(u.title)}" data-canvasa-source="problem" data-canvasa-statement="${m(u.statement || "")}">
            <div class="tutor-prob__head">
              <span class="tutor-prob__title">${h(u.title)}</span>
              <span class="tutor-pill tutor-pill--${m(v)}">${h(v)}</span>
              <span class="tutor-pill">${h(l)}</span>
              ${u.source ? `<span class="tutor-prob__src">· ${h(u.source)}</span>` : ""}
              ${u.cached ? '<span class="tutor-prob__cached" title="Cached — instant load">✓</span>' : ""}
              ${u.guide_cached ? '<span class="tutor-prob__guide" title="Figure-It-Out cached">⚡</span>' : ""}
            </div>
            ${u.statement ? `<div class="tutor-prob__statement">${u.statement}</div>` : ""}
          </button>`;
    }).join("")}
      </div>
      ${n.length > f ? `
        <div class="tutor-pag">
          <button type="button" data-canvasa-ppag-prev ${o <= 0 ? "disabled" : ""}>← Prev</button>
          <span>Page ${o + 1} of ${s} · ${n.length} result${n.length === 1 ? "" : "s"}</span>
          <button type="button" data-canvasa-ppag-next ${o >= s - 1 ? "disabled" : ""}>Next →</button>
        </div>` : n.length === 0 ? '<div class="tutor-empty">No matches in this section.</div>' : ""}
    `, a.dataset.rendered = "1", (d = a.querySelector("[data-canvasa-ppag-prev]")) == null || d.addEventListener("click", (u) => {
      u.stopPropagation(), this._renderProblemSectionBody(t, e, o - 1);
    }), (b = a.querySelector("[data-canvasa-ppag-next]")) == null || b.addEventListener("click", (u) => {
      u.stopPropagation(), this._renderProblemSectionBody(t, e, o + 1);
    }), a.querySelectorAll("[data-canvasa-lesson]").forEach((u) => {
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
    const p = await H(this.getAttribute("katex-cdn"));
    B(a, p);
  }
  // ── Lesson card click → mode picker → launch ────────────────────
  _handleLessonCardClick(t) {
    const e = this.getAttribute("lesson-mode") || "picker", o = new CustomEvent("canvasa-lesson-click", {
      detail: { ...t, mode: e },
      bubbles: !0,
      composed: !0,
      cancelable: !0
    });
    this.dispatchEvent(o) && (e === "teach" || e === "guide" ? this._launch("lesson", { lesson: t.slug, mode: e, statement: t.statement ?? "" }) : this._openModePicker(t));
  }
  _openModePicker(t) {
    var a;
    const e = document.createElement("div");
    e.className = "tutor-mode-modal", e.innerHTML = `
      <div class="tutor-mode-modal__card" role="dialog" aria-label="Pick a learning mode">
        <h3 class="tutor-mode-modal__title">${h(t.title || "Pick a learning mode")}</h3>
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
    e.addEventListener("click", (n) => {
      n.target === e && o();
    }), (a = e.querySelector("[data-cancel]")) == null || a.addEventListener("click", o), e.querySelectorAll("[data-mode]").forEach((n) => {
      n.addEventListener("click", () => {
        const s = n.dataset.mode || "teach";
        o(), t.slug ? this._launch("lesson", { lesson: t.slug, mode: s, statement: t.statement ?? "" }) : t.statement && this._launch("ask", { ask: t.statement, mode: s });
      });
    });
    const r = (n) => {
      n.key === "Escape" && (o(), document.removeEventListener("keydown", r));
    };
    document.addEventListener("keydown", r);
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
    const a = (e.mode === "guide" ? "guide" : "tutor") === "guide" ? "/guide" : "/tutor", n = new URLSearchParams();
    if (e.lesson && n.set("lesson", e.lesson), e.ask && n.set("ask", e.ask), n.set("brand", this._tenant()), typeof window < "u" && window.location) {
      n.set("return", window.location.href);
      const s = `${$()}${a}?${n.toString()}`, c = this.getAttribute("lesson-target") || "self";
      if (c === "blank")
        window.open(s, "_blank", "noopener");
      else if (c.startsWith(".") || c.startsWith("#")) {
        const p = document.querySelector(c);
        p && "src" in p && (p.src = s);
      } else
        window.location.assign(s);
    }
  }
  _launchUrl(t, e) {
    this._busy = !0, this._busyMsg = "Opening tutor…", this._render();
    const o = new URLSearchParams();
    o.set("ask", e && e.trim() || t), o.set("brand", this._tenant()), typeof window < "u" && window.location && o.set("return", window.location.href), window.location.assign(`${$()}/tutor?${o.toString()}`);
  }
  async _launchPdf(t) {
    this._busy = !0, this._busyMsg = "Reading PDF…", this._errorMsg = "", this._render();
    try {
      const e = await _.generateFromPdf(t);
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
      detail: { version: w, tenant: this._tenant() },
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
C.observedAttributes = [
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
let L = C;
function I() {
  typeof window > "u" || window.customElements.get("canvasa-tutor") || window.customElements.define("canvasa-tutor", L);
}
I();
typeof window < "u" && (window.canvasa = window.canvasa ?? { version: w });
export {
  w as CANVASA_SDK_VERSION
};
//# sourceMappingURL=canvasa-sdk.js.map
