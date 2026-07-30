# README

## パンくず記述例

### パターンA: 固定ページ（例: 会社概要 src/pages/about.astro）での使い方

```
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

### パターンB: ブログ記事やコンテンツコレクション（動的ルーティング）での使い方

```
---
// 例: src/pages/blog/[slug].astro
import Layout from '../../layouts/Layout.astro';
import Breadcrumbs from '../../components/Breadcrumbs.astro';

// getStaticPaths等で取得した記事データが post に入っている想定
const { post } = Astro.props;
---

<Layout title={post.data.title}>
  <Breadcrumbs
    items={[
      { name: 'ホーム', href: '/' },
      { name: 'ブログ一覧', href: '/blog' },
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
