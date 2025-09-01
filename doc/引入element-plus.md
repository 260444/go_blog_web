# 安装和配置 Element Plus

官网：https://element-plus.org/zh-CN/

## 1. 安装 Element Plus

```bash
npm install element-plus --save
```

## 2. 按需导入

### 2.1 安装相关插件

```bash
npm install -D unplugin-vue-components unplugin-auto-import
```

### 2.2 配置 vite.config.ts

```typescript
import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
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
})
```

## 3. 注册所有图标

### 3.1 安装图标库

```bash
npm install @element-plus/icons-vue
```

### 3.2 配置 main.ts

```typescript
import {createApp} from 'vue'
import '@/assets/base.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import App from './App.vue'
import router from './router'
import {pinia} from "@/stores";

const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.use(pinia).use(router)

app.mount('#app')
```