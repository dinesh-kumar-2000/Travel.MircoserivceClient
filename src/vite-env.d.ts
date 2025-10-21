/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_API_GATEWAY_URL: string;
  readonly VITE_APP_NAME: string;
  readonly VITE_APP_DOMAIN: string;
  readonly VITE_APP_ENV: string;
  readonly VITE_JWT_SECRET: string;
  readonly VITE_AUTH_TOKEN_KEY: string;
  readonly VITE_REFRESH_TOKEN_KEY: string;
  readonly VITE_STRIPE_PUBLIC_KEY: string;
  readonly VITE_RAZORPAY_KEY: string;
  readonly VITE_ENABLE_ANALYTICS: string;
  readonly VITE_ENABLE_CHATBOT: string;
  readonly VITE_ENABLE_DARK_MODE: string;
  readonly VITE_ENABLE_MULTI_LANGUAGE: string;
  readonly VITE_GOOGLE_MAPS_API_KEY: string;
  readonly VITE_GOOGLE_ANALYTICS_ID: string;
  readonly VITE_WEBSOCKET_URL: string;
  readonly VITE_MAX_FILE_SIZE: string;
  readonly VITE_ALLOWED_FILE_TYPES: string;
  readonly VITE_DEFAULT_PAGE_SIZE: string;
  readonly VITE_MAX_PAGE_SIZE: string;
  readonly VITE_CACHE_TTL: string;
  readonly VITE_DEBUG_MODE: string;
  readonly VITE_LOG_LEVEL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

