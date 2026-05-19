/// <reference types="vite/client" />

// Vite's `?inline` query returns the CSS file's content as a string.
// Used for shipping styles bundled into the SDK's JS bundle so hosts
// don't need a separate CSS import.
declare module '*.css?inline' {
  const css: string
  export default css
}
