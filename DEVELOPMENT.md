# 開発ガイド

## 環境構築

### 前提条件

- Node.js 18+
- npm

### セットアップ

```bash
git clone <repository-url>
cd quake-overlay-site
npm install
```

### 開発サーバー起動

```bash
npm run dev
```

http://localhost:3000 でサイトにアクセスできます。

### コマンド一覧

| コマンド | 説明 |
|---------|------|
| `npm run dev` | 開発サーバー起動 |
| `npm run build` | プロダクションビルド |
| `npm run start` | ビルド後のサーバー起動 |
| `npm test` | テスト（ウォッチモード） |
| `npm run test:run` | テスト（単発実行） |

## コンテンツ管理

### Keystatic CMS

開発サーバー起動後、http://localhost:3000/keystatic でCMS管理画面にアクセスできます。

### コレクション一覧

| コレクション | パス | 形式 | 説明 |
|-------------|------|------|------|
| ドキュメント | `content/docs/*/` | Markdoc | ユーザーガイド |
| リリースノート | `content/releases/*/` | Markdoc | バージョン更新履歴 |
| ユーザーレビュー | `content/reviews/*` | JSON | ユーザーの声 |
| ロードマップ | `content/roadmap/*` | JSON | 今後の開発予定 |

### ドキュメント追加

詳細は [docs/CONTENT_GUIDE.md](docs/CONTENT_GUIDE.md) を参照してください。

**簡易手順:**

1. http://localhost:3000/keystatic にアクセス
2. 「ドキュメント」→「Create」
3. タイトル、カテゴリ、言語、本文を入力して保存
4. 3言語分（ja/en/ko）それぞれ作成

### リリースノート追加

1. http://localhost:3000/keystatic にアクセス
2. 「リリースノート」→「Create」
3. バージョン（例: `v1-1-0`）、日付、概要を入力
4. 変更点を種別（新機能/改善/修正/破壊的変更）ごとに追加
5. 必要に応じて既知の問題を追加
6. 詳細な説明はMarkdocで記述

### ロードマップ追加

1. http://localhost:3000/keystatic にアクセス
2. 「ロードマップ」→「Create」
3. タイトル、説明、ステータス、対象バージョン、言語を設定
4. 各言語分を個別に作成

## i18n（多言語対応）

### 対応言語

| 言語 | コード | デフォルト |
|------|--------|----------|
| 日本語 | `ja` | Yes |
| English | `en` | No |
| 한국어 | `ko` | No |

### 翻訳ファイル

UI文字列は `messages/` ディレクトリのJSONファイルで管理しています。

- `messages/ja.json` — 日本語
- `messages/en.json` — 英語
- `messages/ko.json` — 韓国語

新しいUI文字列を追加する場合は、3ファイルすべてに追加してください。

## ディレクトリ構成

```
src/
├── app/[locale]/          # ロケール別ページ
│   ├── page.tsx           # トップページ
│   ├── docs/              # ドキュメントページ
│   └── releases/          # リリースノートページ
├── components/
│   ├── layout/            # Header, Footer, MobileNav等
│   ├── sections/          # トップページセクション
│   ├── docs/              # ドキュメント関連
│   ├── releases/          # リリースノート関連
│   └── ui/                # 汎用UIコンポーネント
├── lib/                   # データ取得ユーティリティ
├── constants/             # 定数定義
├── hooks/                 # カスタムフック
├── i18n/                  # next-intl設定
├── types/                 # 型定義
└── test/                  # テストユーティリティ
content/                   # Keystatic管理コンテンツ
messages/                  # 翻訳JSON
```

## テスト

```bash
# 全テスト実行
npm run test:run

# ウォッチモード
npm test

# 特定ファイル実行
npx vitest run src/components/releases/__tests__/ReleaseCard.test.tsx
```

テストファイルは各コンポーネントの `__tests__/` ディレクトリに配置しています。

## デプロイ

### Vercel

```bash
npm run build
```

ビルドが成功すれば Vercel にデプロイ可能です。特別な環境変数は不要です（Keystatic はローカルファイルストレージを使用）。

## 必要な素材（差し替え用）

以下のダミー画像を実際の素材に差し替えてください。

| ファイル | 用途 | 推奨サイズ |
|---------|------|----------|
| `public/images/dummy/app-screenshot-main.png` | Hero、メインビジュアル | 1920x1080 |
| `public/images/dummy/app-screenshot-overlay.png` | OBSオーバーレイ表示 | 1920x1080 |
| `public/images/dummy/app-screenshot-settings.png` | 設定画面 | 1280x720 |
| OGP画像 | SNSシェア用 | 1200x630 |
| `public/favicon.ico` | ブラウザタブ | 32x32 |
