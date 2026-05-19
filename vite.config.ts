import { defineConfig } from 'vite'
import { resolve } from 'path'

// Canvas A SDK — vanilla TypeScript library, custom elements only.
// Builds to a single ESM bundle + CSS file, framework-agnostic.
//
// Hosts use either:
//   <script type="module" src="https://cdn.jsdelivr.net/npm/@canvasa/sdk@1"></script>
// or:
//   import '@canvasa/sdk'   // (registers the custom elements as side-effect)
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'CanvasaSDK',
      fileName: 'canvasa-sdk',
      formats: ['es'],
    },
    sourcemap: true,
    rollupOptions: {
      output: {
        assetFileNames: (asset) => {
          if (asset.name === 'style.css') return 'canvasa-sdk.css'
          return asset.name || 'assets/[name][extname]'
        },
      },
    },
  },
})
