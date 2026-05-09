import { defineConfig, type UserConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

// We extend Vite's user config with Vitest's `test` field. Importing
// vitest/config directly clashes with Vite's own typings (incompatible
// http-proxy versions transitively), so we widen the type ourselves.
type ConfigWithTest = UserConfig & {
  test?: Record<string, unknown>;
};

// Vite config — PRD §14: path aliases + dev server settings.
const config: ConfigWithTest = ({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@/app': path.resolve(__dirname, 'src/app'),
      '@/pages': path.resolve(__dirname, 'src/pages'),
      '@/components': path.resolve(__dirname, 'src/components'),
      '@/store': path.resolve(__dirname, 'src/store'),
      '@/api': path.resolve(__dirname, 'src/api'),
      '@/mocks': path.resolve(__dirname, 'src/mocks'),
      '@/animations': path.resolve(__dirname, 'src/animations'),
      '@/hooks': path.resolve(__dirname, 'src/hooks'),
      '@/types': path.resolve(__dirname, 'src/types'),
    },
  },
  server: {
    port: 5173,
    open: false,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    css: false,
    exclude: ['node_modules', 'dist', 'tests/e2e/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.d.ts', 'src/main.tsx', 'src/mocks/**'],
    },
  },
  build: {
    sourcemap: true,
    target: 'es2020',
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Code-split: keep Three.js + R3F + drei in a separate chunk.
          // PRD §3: Editor route should lazy-load this; this gives Rollup a
          // strong hint to keep them out of the initial entry chunk.
          if (
            id.includes('node_modules/three') ||
            id.includes('node_modules/@react-three') ||
            id.includes('node_modules/three-stdlib')
          ) {
            return 'three';
          }
          if (id.includes('node_modules/antd') || id.includes('node_modules/@ant-design')) {
            return 'antd';
          }
        },
      },
    },
  },
});

export default defineConfig(config);
