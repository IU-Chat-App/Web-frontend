import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const proxyTarget = env.VITE_PROXY_TARGET || 'http://localhost:3000'

  return {
    plugins: [react()],
    server: {
      // Proxy /api → backend to avoid browser CORS errors during local dev.
      // Set VITE_API_URL=/api in .env.development (or .env) and run your API on VITE_PROXY_TARGET.
      proxy: {
        '/api': {
          target: proxyTarget,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, ''),
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq, req) => {
              // Strip browser-set Origin/Referer so the backend's CORS
              // middleware treats this as a same-origin/server-to-server call
              // and skips its allow-list check. Forward the real browser
              // origin in a custom header for backend logging if needed.
              if (req.headers.origin) {
                proxyReq.setHeader('x-forwarded-origin', req.headers.origin)
              }
              proxyReq.removeHeader('origin')
              proxyReq.removeHeader('referer')
            })
          },
        },
      },
    },
  }
})

