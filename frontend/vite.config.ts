import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'fs'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env variables from process.env and .env files
  const env = loadEnv(mode, process.cwd(), '')
  const basePath = env.BASE_PATH || ''
  const formattedBasePath = basePath.replace(/\/$/, '')

  // Dynamically resolve target backend depending on environment
  const isDocker = () => {
    try {
      return fs.existsSync('/.dockerenv') || fs.readFileSync('/proc/self/cgroup', 'utf8').includes('docker')
    } catch {
      return false
    }
  }
  const backendTarget = isDocker() ? "http://apex-backend:8080" : "http://localhost:8080"

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
          target: backendTarget,
          changeOrigin: true,
        },
        [`${formattedBasePath}/app_metadata.json`]: {
          target: backendTarget,
          changeOrigin: true,
        },
      },
    },
  }
})
