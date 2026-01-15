import { fileURLToPath, URL } from 'node:url'
import { VitePWA } from 'vite-plugin-pwa'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'Athens Cinemas',
        short_name: 'Athens Cinemas',
        start_url: '/',
        display: 'standalone',
        background_color: '#121212',
        theme_color: '#808080',
        icons: [
          {
            src: '/pwa-ac.png',
            sizes: '200x200',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        navigateFallback: '/index.html',
        globPatterns: ['**/*.{js,css,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.mode === 'navigate',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'html-cache',
            }
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "@/assets/variables.scss";`
        }
      }
  },
  build: {
    outDir: '../backend/built/dist',
  },
})
