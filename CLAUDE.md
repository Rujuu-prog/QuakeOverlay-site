# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

QuakeOverlay のマーケティング・ドキュメントサイト。OBS配信者向けの地震オーバーレイツールの紹介サイト。

## Commands

```bash
npm run dev          # 開発サーバー起動
npm run build        # プロダクションビルド
npm run lint         # ESLint実行
npm test             # Vitest ウォッチモード
npm run test:run     # Vitest 単発実行
```

単一テストファイルの実行:
```bash
npx vitest run src/components/docs/__tests__/DocRenderer.test.tsx
```

## Tech Stack

- **Next.js 15.1** + **React 19** (App Router)
- **Tailwind CSS v4** (@tailwindcss/postcss)
- **next-intl 4.1** (i18n: ja/en/ko, デフォルト: ja)
- **Keystatic CMS** (Markdoc形式のコンテンツ管理)
- **Shiki** (コードブロックのシンタックスハイライト)
- **Vitest** + **@testing-library/react** (jsdom環境)

## Architecture

### ルーティング

`src/app/[locale]/` 配下にロケール別の動的ルーティング。`src/app/keystatic/` にCMS管理画面。

- `/[locale]` — ランディングページ (Hero, Features, Demo, HowItWorks, Reviews, CTA)
- `/[locale]/docs` — ドキュメント一覧
- `/[locale]/docs/[slug]` — 個別ドキュメント
- `/keystatic` — CMS管理画面
- `/api/keystatic/[...]` — CMS APIハンドラ

### ディレクトリ構成

- `src/components/sections/` — ランディングページのセクション単位コンポーネント
- `src/components/layout/` — Header, Footer, MobileNav, LanguageSwitcher
- `src/components/docs/` — DocRenderer, CodeBlock, TableOfContents, Breadcrumb等
- `src/components/ui/` — Button, Card等の汎用UIプリミティブ
- `src/lib/` — Keystatic reader, ドキュメント取得・ソートユーティリティ
- `src/constants/` — ナビゲーション、カテゴリ、サイト情報、アニメーション定数
- `src/hooks/` — useScrollAnimation, useActiveHeading
- `src/i18n/` — next-intl設定 (routing.ts, request.ts, navigation.ts)
- `src/types/` — 型定義
- `messages/` — 翻訳JSON (ja.json, en.json, ko.json)
- `content/` — Keystatic管理コンテンツ (docs, releases, reviews, roadmap)

### i18n

`src/i18n/routing.ts` で `locales: ["ja", "en", "ko"]`, `defaultLocale: "ja"` を定義。サーバーコンポーネントでは `getTranslations` / `setRequestLocale`、クライアントコンポーネントでは `useTranslations` / `useLocale` を使用。

### ドキュメントシステム

Keystatic CMS → Markdocファイル (`content/docs/*/index.mdoc`) → `src/lib/docs.ts` で取得 → `DocRenderer` でReactに変換。コードブロックはShikiで非同期ハイライト。

### テスト

`src/test/utils.tsx` にNextIntlClientProviderをラップしたカスタム `render()` がある。テストではこれを使用する。`src/test/setup.ts` にIntersectionObserverとmatchMediaのモックあり。テストファイルは各コンポーネントの `__tests__/` ディレクトリに配置。

## Development Rules (order/rule.md)

- TDDで実装する（テスト先行）
- 定数はベタ書きせず `src/constants/` にまとめる
- 文字列はi18n対応のため `messages/*.json` にまとめる（コード内ベタ書き禁止）
- スクリーンショットや動画等の素材はユーザーが用意するので、必要なものを伝えてdummyを配置する
- 無理やりな実装は避け、必要に応じて設計を見直す
- Playwrightで画面確認を行ってよい

## Conventions

- パスエイリアス: `@/*` → `./src/*`
- コンポーネント: PascalCase、定数: UPPER_SNAKE_CASE、ユーティリティ: camelCase
- ダークテーマベース (背景: #0a0a12, アクセント: cyan #00d4ff)
- コンポーネントのテストは同階層の `__tests__/` に配置
- `generateStaticParams` で静的パラメータ生成、`generateMetadata` でSEOメタデータ生成
