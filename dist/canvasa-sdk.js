const d = "0.1.0-alpha.0";
function f() {
  return typeof window < "u" && window.CANVASA_HOST ? window.CANVASA_HOST : "https://canvasa.olympiz.ai";
}
const p = class p extends HTMLElement {
  constructor() {
    super(...arguments), this._brand = null, this._ready = !1;
  }
  // ── Lifecycle ───────────────────────────────────────────────────
  connectedCallback() {
    this.classList.add("canvasa-tutor"), this._renderShell(), this._loadBrandConfig().then(() => {
      this._applyBrandTokens(), this._renderShell(), this._markReady();
    });
  }
  disconnectedCallback() {
  }
  attributeChangedCallback(e, t, n) {
    this.isConnected && (e === "tenant" ? this._loadBrandConfig().then(() => {
      this._applyBrandTokens(), this._renderShell();
    }) : this._renderShell());
  }
  // ── Programmatic API ────────────────────────────────────────────
  setTenant(e) {
    this.setAttribute("tenant", e);
  }
  setTab(e) {
    this.setAttribute("default-tab", e), this.dispatchEvent(new CustomEvent("canvasa-tab-change", { detail: { tab: e }, bubbles: !0, composed: !0 }));
  }
  launchAsk(e, t) {
    this._launch("ask", { ask: e, mode: (t == null ? void 0 : t.mode) ?? "teach" });
  }
  launchLesson(e, t) {
    this._launch("lesson", { lesson: e, mode: (t == null ? void 0 : t.mode) ?? "teach" });
  }
  getBrandConfig() {
    return this._brand;
  }
  async refresh() {
    await this._loadBrandConfig(), this._applyBrandTokens(), this._renderShell();
  }
  // ── Internal ────────────────────────────────────────────────────
  _tenant() {
    return this.getAttribute("tenant") || "default";
  }
  _debug() {
    return this.getAttribute("debug") === "1";
  }
  async _loadBrandConfig() {
    const e = this._tenant(), t = `${f()}/api/brand/${encodeURIComponent(e)}`;
    try {
      const n = await fetch(t, { credentials: "omit" });
      if (!n.ok) throw new Error(`HTTP ${n.status}`);
      this._brand = await n.json(), this._debug() && console.log("[canvasa] brand loaded", this._brand);
    } catch (n) {
      this._brand = { tenant: e, tokens: {}, copy: {}, mark: {} }, this.dispatchEvent(new CustomEvent("canvasa-error", {
        detail: { code: "brand-config-fetch-failed", message: String(n), cause: n },
        bubbles: !0,
        composed: !0
      }));
    }
  }
  _applyBrandTokens() {
    var n;
    if (!((n = this._brand) != null && n.tokens)) return;
    const e = this._brand.tokens, t = (r, o) => {
      o && this.style.setProperty(r, o);
    };
    t("--tutor-accent", e.accent), t("--tutor-accent-hover", e.accentHover), t("--tutor-bg", e.bg), t("--tutor-surface", e.surface), t("--tutor-text", e.text), t("--tutor-muted", e.muted), t("--tutor-line", e.line), t("--tutor-radius", e.radius), t("--tutor-font-head", e.fontHead), t("--tutor-font-body", e.fontBody), t("--tutor-font-mono", e.fontMono), t("--tutor-spacing-unit", e.spacingUnit);
  }
  _renderShell() {
    var o, s, a;
    const e = this._tenant(), t = ((o = this._brand) == null ? void 0 : o.copy) ?? {}, n = ((s = this.querySelector('[slot="hero-title"]')) == null ? void 0 : s.textContent) ?? t.heroTitle ?? "What do you want to learn today?", r = ((a = this.querySelector('[slot="hero-sub"]')) == null ? void 0 : a.textContent) ?? t.heroSub ?? "Drop a question.";
    this.innerHTML = `
      <style>
        .canvasa-tutor {
          display: block;
          font-family: var(--tutor-font-body, 'Inter', system-ui, sans-serif);
          color: var(--tutor-text, #1a3a52);
          padding: 24px;
        }
        .canvasa-tutor__hero {
          text-align: center;
          padding: 32px 0;
        }
        .canvasa-tutor__hero h1 {
          font-family: var(--tutor-font-head, 'Playfair Display', Georgia, serif);
          font-size: clamp(28px, 5vw, 48px);
          margin: 0 0 12px;
          color: var(--tutor-text, #1a3a52);
        }
        .canvasa-tutor__hero p {
          color: var(--tutor-muted, #5a7c92);
          margin: 0;
        }
        .canvasa-tutor__pill {
          position: fixed; top: 12px; right: 60px; z-index: 99999;
          font-family: 'JetBrains Mono', ui-monospace, monospace;
          font-size: 11px; font-weight: 600; letter-spacing: 0.08em;
          padding: 5px 11px; border-radius: 999px;
          background: #14213D; color: #e8c970; border: 1px solid #C9A227;
          box-shadow: 0 2px 8px rgba(20,33,61,0.30);
          pointer-events: auto; user-select: none;
        }
        .canvasa-tutor__placeholder {
          max-width: 720px; margin: 24px auto 0; padding: 24px;
          background: var(--tutor-surface, rgba(255,255,255,0.7));
          border: 1px dashed var(--tutor-line, rgba(26,58,82,0.18));
          border-radius: var(--tutor-radius, 8px);
          font-size: 13px; color: var(--tutor-muted, #5a7c92); line-height: 1.6;
        }
        .canvasa-tutor__placeholder code {
          background: rgba(0,0,0,0.06); padding: 1px 6px; border-radius: 3px;
        }
      </style>
      <div class="canvasa-tutor__pill" title="Canvas A SDK version. Hard-refresh if outdated.">v${d}</div>
      <section class="canvasa-tutor__hero">
        <h1>${l(n)}</h1>
        <p>${l(r)}</p>
      </section>
      <div class="canvasa-tutor__placeholder">
        <strong>Canvas A SDK · Phase 1 scaffold.</strong><br>
        Tenant: <code>${l(e)}</code> ·
        Brand config: ${this._brand ? "<code>loaded</code>" : "<code>pending</code>"} ·
        Version: <code>v${d}</code><br>
        Phase 2 ports the full landing UI (3 tabs · Concept library · Problems · KaTeX · pagination) here.
      </div>
    `;
  }
  _markReady() {
    this._ready || (this._ready = !0, this.dispatchEvent(new CustomEvent("canvasa-ready", {
      detail: { version: d, tenant: this._tenant() },
      bubbles: !0,
      composed: !0
    })));
  }
  _launch(e, t) {
    const n = new CustomEvent("canvasa-launch", {
      detail: { kind: e, payload: t },
      bubbles: !0,
      composed: !0,
      cancelable: !0
    });
    if (!this.dispatchEvent(n)) return;
    const s = (t.mode === "guide" ? "guide" : "tutor") === "guide" ? "/guide" : "/tutor", a = new URLSearchParams();
    if (t.lesson && a.set("lesson", t.lesson), t.ask && a.set("ask", t.ask), a.set("brand", this._tenant()), typeof window < "u" && window.location) {
      a.set("return", window.location.href);
      const i = this.getAttribute("lesson-target") || "self", c = `${f()}${s}?${a.toString()}`;
      if (i === "blank")
        window.open(c, "_blank", "noopener");
      else if (i.startsWith(".") || i.startsWith("#")) {
        const u = document.querySelector(i);
        u && "src" in u && (u.src = c);
      } else
        window.location.assign(c);
    }
  }
};
p.observedAttributes = [
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
let h = p;
function l(b) {
  return b.replace(/[&<>"']/g, (e) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[e]);
}
function g() {
  typeof window > "u" || window.customElements.get("canvasa-tutor") || window.customElements.define("canvasa-tutor", h);
}
g();
typeof window < "u" && (window.canvasa = window.canvasa ?? { version: d });
export {
  d as CANVASA_SDK_VERSION
};
//# sourceMappingURL=canvasa-sdk.js.map
