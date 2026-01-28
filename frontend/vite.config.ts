import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production'

  return {
    plugins: [
      react(),
    ],
    resolve: {
      alias: {
        '@/features': path.resolve(__dirname, './src/presentation/features'),
        '@/application': path.resolve(__dirname, './src/application'),
        '@/infrastructure': path.resolve(__dirname, './src/infrastructure'),
        '@/presentation': path.resolve(__dirname, './src/presentation'),
        '@': path.resolve(__dirname, './src'),
      },
      dedupe: ['react', 'react-dom', 'react-router-dom'],
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler', // استخدام Modern Sass API بدلاً من Legacy API
          includePaths: [path.resolve(__dirname, './src')],
          // إضافة المتغيرات والميكسينات تلقائياً لكل ملف SCSS (حل احتياطي)
          // يمكن إزالة هذا إذا كان @import يعمل بشكل صحيح
          // additionalData: `@import "@/styles/variables"; @import "@/styles/mixins";`,
        },
      },
    },
    build: {
      // Source maps for production debugging (only in production)
      sourcemap: isProduction,
      // Chunk size warnings
      chunkSizeWarningLimit: 500, // Reduced from 1000 to catch larger chunks
      // Minification
      minify: isProduction ? 'esbuild' : false,
      // CSS code splitting
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          // Optimized chunk file names
          chunkFileNames: isProduction
            ? 'assets/js/[name]-[hash].js'
            : 'assets/js/[name].js',
          entryFileNames: isProduction
            ? 'assets/js/[name]-[hash].js'
            : 'assets/js/[name].js',
          assetFileNames: (assetInfo) => {
            const info = assetInfo.name?.split('.') || []
            const ext = info[info.length - 1]
            if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
              return `assets/images/[name]-[hash][extname]`
            }
            if (/woff2?|eot|ttf|otf/i.test(ext)) {
              return `assets/fonts/[name]-[hash][extname]`
            }
            return `assets/[ext]/[name]-[hash][extname]`
          },
        },
      },
      // Target modern browsers for smaller bundle
      target: ['es2020', 'edge88', 'firefox78', 'chrome87', 'safari14'],
    },

    server: {
      port: 30174, // Development server port
      strictPort: false, // Fail if port is already in use
      open: true, // Auto-open browser in development
      hmr: {
        overlay: true, // Show error overlay
      },
      headers: {
        // Allow unsafe-eval for Vite HMR in development only
        // WARNING: This should NOT be used in production
        'Content-Security-Policy': [
          "default-src 'self'",
          "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
          "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://api.fontshare.com",
          "font-src 'self' data: https://fonts.gstatic.com https://cdn.fontshare.com",
          "img-src 'self' data: blob: https://lh3.googleusercontent.com https://*.googleusercontent.com",
          "connect-src 'self' https://fonts.googleapis.com https://api.fontshare.com",
          "frame-src 'none'",
          "object-src 'none'",
          "base-uri 'self'",
        ].join('; '),
      },
      proxy: {
        '/api/v1': {
          target: process.env.VITE_API_TARGET || "http://localhost:30000",
          changeOrigin: true,
          secure: false,
        },
      },
    },

    preview: {
      port: 4173, // Preview server port (for production builds)
      strictPort: true, // Fail if port is already in use
      open: true, // Auto-open browser in preview mode
    },

    // Optimize dependencies
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router-dom'],
    },
  }
})

