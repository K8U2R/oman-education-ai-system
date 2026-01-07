/// <reference types="vite/client" />

interface ImportMetaEnv {
  // API Configuration
  readonly VITE_API_BASE_URL: string

  // WebSocket & SSE Configuration
  readonly VITE_WS_URL?: string
  readonly VITE_SSE_URL?: string
  readonly VITE_SKIP_REALTIME?: string

  // Supabase Configuration
  readonly VITE_SUPABASE_URL?: string
  readonly VITE_SUPABASE_ANON_KEY?: string

  // Analytics Configuration
  readonly VITE_ANALYTICS_ENDPOINT?: string
  readonly VITE_GA_MEASUREMENT_ID?: string

  // Error Tracking Configuration
  readonly VITE_ERROR_TRACKING_ENDPOINT?: string

  // Development Mode (automatically set by Vite)
  readonly DEV: boolean
  readonly MODE: string
  readonly PROD: boolean
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
