import { defineWorkspace } from 'vitest/config'

export default defineWorkspace([
  {
    extends: './vite.config.js',
    test: {
      name: 'frontend',
      environment: 'jsdom',
      setupFiles: ['./vitest.setup.js'],
      include: ['src/frontend/**/*{test,spec}.{js,jsx,ts,tsx}'],
    },
  },
])
