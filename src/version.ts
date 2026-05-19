// Single source of truth for the SDK version string. Read by:
//   - the runtime `window.canvasa.version` handle
//   - the `<canvasa-tutor>` version pill (top-right, gold-on-navy)
//   - the `canvasa-ready` event payload sent to host
//
// Bump on every shipped change. Keep in sync with package.json `version`
// (the build does NOT automate this — manual edit so a mismatch surfaces
// in code review).
export const CANVASA_SDK_VERSION = '0.1.0-alpha.9'
