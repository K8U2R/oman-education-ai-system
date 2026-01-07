import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production'
  
  return {
    plugins: [
      react({
        // Enable Fast Refresh
        fastRefresh: true,
      }),
    ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/application': path.resolve(__dirname, './src/application'),
      '@/infrastructure': path.resolve(__dirname, './src/infrastructure'),
      '@/presentation': path.resolve(__dirname, './src/presentation'),
    },
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
      // Rollup options for advanced code splitting
      rollupOptions: {
        output: {
          // Manual chunks for better code splitting
          manualChunks: (id) => {
            // Vendor chunks
            if (id.includes('node_modules')) {
              // React core
              if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
                return 'react-vendor'
              }
              // UI libraries
              if (id.includes('lucide-react')) {
                return 'ui-vendor'
              }
              // State management
              if (id.includes('zustand')) {
                return 'state-vendor'
              }
              // HTTP clients
              if (id.includes('axios')) {
                return 'http-vendor'
              }
              // Supabase
              if (id.includes('@supabase')) {
                return 'supabase-vendor'
              }
              // Other node_modules
              return 'vendor'
            }
            // Route-based code splitting
            if (id.includes('/presentation/pages/')) {
              const pageMatch = id.match(/\/presentation\/pages\/([^/]+)/)
              if (pageMatch) {
                const pageName = pageMatch[1]
                // Group similar pages
                if (pageName.includes('admin') || pageName.includes('Admin')) {
                  return 'pages-admin'
                }
                if (pageName.includes('learning') || pageName.includes('Learning')) {
                  return 'pages-learning'
                }
                if (pageName.includes('project') || pageName.includes('Project')) {
                  return 'pages-projects'
                }
                if (pageName.includes('user') || pageName.includes('User')) {
                  return 'pages-user'
                }
                return 'pages-common'
              }
            }
            // Infrastructure layer
            if (id.includes('/infrastructure/')) {
              if (id.includes('/infrastructure/api/')) {
                return 'infra-api'
              }
              if (id.includes('/infrastructure/storage/')) {
                return 'infra-storage'
              }
              return 'infra-common'
            }
            // Application layer
            if (id.includes('/application/')) {
              if (id.includes('/application/features/')) {
                return 'app-features'
              }
              if (id.includes('/application/core/')) {
                return 'app-core'
              }
              return 'app-common'
            }
          },
          // Optimize chunk file names
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
        // Tree shaking
        treeshake: {
          moduleSideEffects: false,
        },
      },
      // Target modern browsers for smaller bundle
      target: ['es2020', 'edge88', 'firefox78', 'chrome87', 'safari14'],
    },
    
    server: {
      port: 5173, // Development server port
      strictPort: true, // Fail if port is already in use
      open: true, // Auto-open browser in development
      hmr: {
        overlay: true, // Show error overlay
      },
      headers: {
        // Allow unsafe-eval for Vite HMR in development only
        // WARNING: This should NOT be used in production
        'Content-Security-Policy': [
          "default-src 'self'",
          "script-src 'self' 'unsafe-eval' 'unsafe-inline' http://localhost:3000",
          "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
          "font-src 'self' data: https://fonts.gstatic.com",
          "img-src 'self' data: blob:",
          "connect-src 'self' http://localhost:3000 http://localhost:8000 http://localhost:9681 ws://localhost:3000 ws://localhost:8000 ws://localhost:9681 https://fonts.googleapis.com",
          "frame-src 'none'",
          "object-src 'none'",
          "base-uri 'self'",
        ].join('; '),
      },
      proxy: {
        '/api/v1': {
          target: 'http://localhost:3000', // Backend runs on port 3000
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

