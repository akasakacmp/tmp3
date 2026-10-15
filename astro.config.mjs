// @ts-check
import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  vite: {
    // 1. Sassコンパイラに「@」を認識させるエイリアス設定
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    // 2. 全ファイルの先頭にSCSSの@useを自動挿入する設定
    css: {
      preprocessorOptions: {
        scss: {
          // 注意: 末尾のセミコロン(;)は必須です
          additionalData: `@use "@/styles/variable" as var;`,
        },
      },
    },
  },
  site: 'https://www.example.com', // テンプレート用の仮ドメイン
  trailingSlash: 'always',
  // パーツ一覧（styleguide）は確認用ページなのでサイトマップから除外
  integrations: [sitemap({ filter: (page) => !page.includes('/styleguide/') })]
});