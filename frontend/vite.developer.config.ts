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
        root: path.resolve(__dirname, './'),
        base: '/',
        resolve: {
            alias: {
                '@/features': path.resolve(__dirname, './src/presentation/features'),
                '@/application': path.resolve(__dirname, './src/application'),
                '@/infrastructure': path.resolve(__dirname, './src/infrastructure'),
                '@/presentation': path.resolve(__dirname, './src/presentation'),
                '@': path.resolve(__dirname, './src'),
            },
        },
        build: {
            outDir: 'dist-developer',
            rollupOptions: {
                input: {
                    developer: path.resolve(__dirname, 'developer.html'),
                },
            },
            sourcemap: isProduction,
        },
        server: {
            port: 3002, // Dedicated Port for Developer Cockpit
            strictPort: true,
            open: '/dev/cockpit',
            proxy: {
                '/api/v1': {
                    target: "http://localhost:30000",
                    changeOrigin: true,
                    secure: false,
                },
            },
        },
    }
})
