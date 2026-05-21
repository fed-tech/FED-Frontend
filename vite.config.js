import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // server: {
  //   proxy: {
  //     "/api": {
  //       target: import.meta.env.VITE_API_URL,
  //       changeOrigin: true,
  //       secure: false,
  //       rewrite: path => path.replace(/^\/api/, ''),
  //     }
  //   },
  // },
  appType: 'spa', // Always serve index.html for deep routes (fixes new-tab 404)
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "./src/assets/styles/Global.scss";`
      }
    }
  }
})