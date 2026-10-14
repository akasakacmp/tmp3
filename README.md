# Astro サイトテンプレート

Astro でサイトを作るときによく使うパーツ（レイアウト、SEO、ヘッダー、フッター、パンくずリスト、404ページ、SCSS変数）をまとめたテンプレートです。

## 最初にやること

```
npm install
```

開発サーバーの起動（バックグラウンドで動きます）:

```
astro dev --background
```

停止・状態確認・ログ表示は `astro dev stop` / `astro dev status` / `astro dev logs` で行います。

ビルドとビルド結果の確認:

```
npm run build
npm run preview
```

## 新しいサイトを始めるときに書き換える場所

| 書き換える内容 | ファイル |
|---|---|
| サイト名（タイトル、OGP、ヘッダー、フッターに使われる） | `src/consts.ts` の `SITE_NAME` |
| 本番ドメイン | `astro.config.mjs` の `site` |
| 本番ドメイン（サイトマップのURL） | `public/robots.txt` の `Sitemap:` 行 |
| デフォルトの説明文 | `src/components/SEO.astro` の `finalDesc` |
| ヘッダーのナビゲーション | `src/components/Header.astro` の `navItems` |
| フッターのリンク・説明文 | `src/components/Footer.astro` の `footerLinks` と `.footer-description` |
| OGP画像 | `public/default-ogp.png` |
| ファビコン | `public/favicon.ico` と `public/favicon.svg` |

※ 本番ドメインは `astro.config.mjs` と `robots.txt` の2か所に書いています。片方だけ直すと食い違うので注意してください。

## ファイル構成

```
src/
├─ consts.ts                 サイト全体で使う共通の値（サイト名）
├─ layouts/
│  └─ Layout.astro           全ページ共通の枠（SEO・ヘッダー・フッター・ファビコン）
├─ components/
│  ├─ SEO.astro              title / description / canonical / noindex / OGP / Twitterカード
│  ├─ Header.astro           上部固定ヘッダー（スマホではハンバーガーメニュー）
│  ├─ Footer.astro           フッター（コピーライトの年は自動）
│  └─ Breadcrumbs.astro      パンくずリスト＋構造化データ（JSON-LD）
├─ pages/
│  ├─ index.astro            使い方のサンプルページ
│  └─ 404.astro              404ページ（noindex）
└─ styles/
   ├─ _variable.scss         ブレークポイントの mixin と vw() 関数
   └─ reset.css              リセットCSS（Josh Comeau）
public/
├─ default-ogp.png           仮のOGP画像
├─ favicon.ico / favicon.svg
└─ robots.txt
```

## Layout の使い方

```astro
---
import Layout from '../layouts/Layout.astro';
---

<Layout title="会社概要" description="会社概要のページです。">
  <main>...</main>
</Layout>
```

Layout に渡せる項目（すべて省略できます）:

| 項目 | 内容 | 省略時 |
|---|---|---|
| `title` | ページタイトル。`ページタイトル \| サイト名` の形で出力 | サイト名のみ |
| `description` | ページの説明文 | `SEO.astro` のデフォルト説明文 |
| `noindex` | `true` で検索結果に表示させない | `false` |
| `ogImage` | OGP画像のパス（`public` からの絶対パス） | `/default-ogp.png` |
| `ogType` | `"website"` か `"article"` | `"website"` |

記事ページの例:

```astro
<Layout title={post.data.title} ogType="article" ogImage="/images/post-ogp.png">
```

## パンくずリストの使い方

### パターンA: 固定ページ（例: 会社概要 src/pages/about.astro）

```astro
---
import Layout from '../layouts/Layout.astro';
import Breadcrumbs from '../components/Breadcrumbs.astro';
---

<Layout title="会社概要">
  <Breadcrumbs
    items={[
      { name: 'ホーム', href: '/' },
      { name: '会社概要' } // 現在地はリンク(href)不要
    ]}
  />
  <main>
    <h1>会社概要</h1>
    <!-- コンテンツ -->
  </main>
</Layout>
```

### パターンB: ブログ記事など（コンテンツコレクション＋動的ルーティング）

```astro
---
// 例: src/pages/blog/[slug].astro
import { getCollection, render } from 'astro:content';
import Layout from '../../layouts/Layout.astro';
import Breadcrumbs from '../../components/Breadcrumbs.astro';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map((post) => ({
    params: { slug: post.id },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content } = await render(post);
---

<Layout title={post.data.title} ogType="article">
  <Breadcrumbs
    items={[
      { name: 'ホーム', href: '/' },
      { name: 'ブログ一覧', href: '/blog/' },
      { name: post.data.title } // 記事タイトルを現在地にする
    ]}
  />
  <main>
    <h1>{post.data.title}</h1>
    <article>
      <Content />
    </article>
  </main>
</Layout>
```

※ `blog` コレクションの定義（`src/content.config.ts`）は別途必要です。詳しくは [コンテンツコレクションのガイド](https://docs.astro.build/en/guides/content-collections/) を参照してください。

## SCSS の使い方

`src/styles/_variable.scss` は `astro.config.mjs` の設定ですべての SCSS に自動で読み込まれます。`@use` を書かずに、`var.` を付けるだけで使えます（`<style lang="scss">` にしてください）。

### ブレークポイント

| mixin | 対象の画面幅 |
|---|---|
| `var.media_query_sp` | 767px以下 |
| `var.media_query_tablet` | 768px〜1109px |
| `var.media_query_tablet_up` | 768px以上 |
| `var.media_query_pc` | 1110px以上 |

```scss
.box {
  padding: 1rem;
  @include var.media_query_tablet_up {
    padding: 2rem;
  }
}
```

境目の幅は `_variable.scss` の `$tablet-width`（768px）と `$site-width`（1110px）で変更できます。

### vw() 関数

375px幅のデザインカンプの px 値を vw に変換します。

```scss
.title {
  font-size: var.vw(24);                  // → 6.4vw
  width: calc(100% - #{var.vw(10)});      // calc の中では #{} で囲む
}
```

## 注意点

- `astro.config.mjs` で `trailingSlash: 'always'` にしているため、URLの末尾には必ず `/` が付きます。サイト内リンクは `/about/` のように末尾に `/` を付けて書いてください（`/about` だと開発サーバーで404になります）。
- ヘッダー・フッターのリンク先（about / services / contact / privacy / terms）のページは用意していないので、必要に応じて `src/pages/` に作成してください。

## 参考

- [Astro ドキュメント](https://docs.astro.build)
