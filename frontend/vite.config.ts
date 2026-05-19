import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env variables from process.env and .env files
  const env = loadEnv(mode, process.cwd(), '')
  const basePath = env.BASE_PATH || ''
  const formattedBasePath = basePath.replace(/\/$/, '')

  return {
    plugins: [react()],
    base: formattedBasePath ? `${formattedBasePath}/` : '/',
    resolve: {
      alias: {
        // Allows importing from "@/components/..." instead of "../../components/..."
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      // Bind to all interfaces so Docker can expose the port
      host: "0.0.0.0",
      port: 5173,
      // Proxy API requests to the FastAPI backend running in its own container
      proxy: {
        [`${formattedBasePath}/api`]: {
          target: "http://apex-backend:8080",
          changeOrigin: true,
        },
      },
    },
  }
})
