import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  outDir: 'dist',
  clean: true,
  dts: true,
  sourcemap: true,
  splitting: false,
  bundle: true,
  minify: false,
  target: 'es2022',
  platform: 'node',
  esbuildOptions(options) {
    options.alias = {
      '@': './src',
      '@/domain': './src/domain',
      '@/application': './src/application',
      '@/infrastructure': './src/infrastructure',
      '@/api': './src/api',
      '@/engine': './src/engine',
    }
  },
})

