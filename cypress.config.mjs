import { defineConfig } from 'cypress'

// Plain JS (not TS) on purpose: Cypress loads this file through the system
// node, and a TypeScript config needs an esbuild build matching that node.
export default defineConfig({
  viewportWidth: 1049,
  e2e: {
    baseUrl: 'http://localhost:3000',
    experimentalRunAllSpecs: true,
  },
})
