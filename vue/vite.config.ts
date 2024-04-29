import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import dynamicImportVars from '@rollup/plugin-dynamic-import-vars';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
	AutoImport({
		dirs: [
			"./src/lib/duploTo/**",
			"./src/composables/**"
		],
		imports: [
			"vue",
			"vue-router",
			"vue-i18n",
		],
	}),
	Components({
		dirs: ["./src/components/**"]
	}),
	dynamicImportVars({
		include: ["./src/lib/i18n/languages/**"]
	})
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
	host: "0.0.0.0",
  }
})
