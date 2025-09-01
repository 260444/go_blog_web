import { fileURLToPath, URL } from 'node:url'

import {defineConfig, loadEnv} from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import type {ImportMetaEnv} from "./env";

// https://vite.dev/config/
let env: Record<keyof ImportMetaEnv, string> = loadEnv("", process.cwd())
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    host: "0.0.0.0",
    port: 80,
    proxy: {
      "/api": {
        target: env.VITE_SERVER_URL,
        changeOrigin: true
      },
      "/uploads": {
        target: env.VITE_SERVER_URL,
        changeOrigin: true,
      },
    }
  }
})
