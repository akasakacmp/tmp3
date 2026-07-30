// @ts-check
import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
          @use "./src/styles/_variable.scss" as var;
          `,
        },
      },
    },
  },
  site: 'https://www.example.com', // テンプレート用の仮ドメイン
  trailingSlash: 'always',
  integrations: [sitemap()]
});