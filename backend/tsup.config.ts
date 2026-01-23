import { defineConfig } from 'tsup'
import { resolve } from 'path'

const rootDir = process.cwd()
const srcDir = resolve(rootDir, 'src')

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
    // Resolve aliases to absolute paths
    // Note: esbuild requires paths without trailing slashes and will add extensions automatically
    options.alias = {
      '@': srcDir,
      '@/domain': resolve(srcDir, 'domain'),
      '@/application': resolve(srcDir, 'application'),
      '@/infrastructure': resolve(srcDir, 'infrastructure'),
      '@/presentation': resolve(srcDir, 'presentation'),
      '@/shared': resolve(srcDir, 'shared'),
    }
    
    // Ensure proper resolution with extensions
    if (!options.resolveExtensions) {
      options.resolveExtensions = ['.ts', '.tsx', '.js', '.jsx', '.json']
    }
    
    // Main fields for resolution
    if (!options.mainFields) {
      options.mainFields = ['module', 'main']
    }
  },
  noExternal: [/^@\//], // Treat all @/ imports as internal
})

