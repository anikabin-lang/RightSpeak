import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/cloudant': {
        target: 'https://6edb59b3-7ee4-4518-a920-c2407e59c8ba-bluemix.cloudantnosqldb.appdomain.cloud',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/cloudant/, '')
      }
    }
  }
})
