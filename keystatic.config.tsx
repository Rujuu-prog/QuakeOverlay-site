import { config, collection, fields } from "@keystatic/core";

export default config({
  storage: {
    kind: "local",
  },
  ui: {
    brand: { name: "QuakeOverlay CMS" },
  },
  collections: {
    docs: collection({
      label: "ドキュメント",
      slugField: "title",
      path: "content/docs/*/",
      format: { contentField: "content" },
      entryLayout: "content",
      schema: {
        title: fields.slug({ name: { label: "タイトル" } }),
        description: fields.text({ label: "説明", multiline: true }),
        category: fields.select({
          label: "カテゴリ",
          options: [
            { value: "getting-started", label: "はじめに" },
            { value: "screens", label: "各画面の説明" },
            { value: "customization", label: "カスタマイズ" },
            { value: "faq", label: "FAQ" },
            { value: "support", label: "サポート" },
          ],
          defaultValue: "getting-started",
        }),
        order: fields.integer({ label: "表示順", defaultValue: 0 }),
        locale: fields.select({
          label: "言語",
          options: [
            { value: "ja", label: "日本語" },
            { value: "en", label: "English" },
            { value: "ko", label: "한국어" },
          ],
          defaultValue: "ja",
        }),
        content: fields.markdoc({
          label: "コンテンツ",
        }),
      },
    }),
    releases: collection({
      label: "リリースノート",
      slugField: "version",
      path: "content/releases/*",
      format: { contentField: "content" },
      entryLayout: "content",
      schema: {
        version: fields.slug({ name: { label: "バージョン" } }),
        date: fields.date({ label: "リリース日", validation: { isRequired: true } }),
        summary: fields.text({ label: "概要", multiline: true }),
        changes: fields.array(
          fields.object({
            type: fields.select({
              label: "種別",
              options: [
                { value: "feature", label: "新機能" },
                { value: "improvement", label: "改善" },
                { value: "fix", label: "修正" },
                { value: "breaking", label: "破壊的変更" },
              ],
              defaultValue: "feature",
            }),
            description: fields.text({ label: "説明", validation: { isRequired: true } }),
          }),
          {
            label: "変更点",
            itemLabel: (props) => props.fields.description.value,
          },
        ),
        content: fields.markdoc({
          label: "詳細",
        }),
      },
    }),
    reviews: collection({
      label: "ユーザーレビュー",
      slugField: "name",
      path: "content/reviews/*",
      format: "json",
      schema: {
        name: fields.slug({ name: { label: "ユーザー名" } }),
        platform: fields.text({ label: "プラットフォーム" }),
        content: fields.text({ label: "レビュー内容", multiline: true, validation: { isRequired: true } }),
        rating: fields.integer({ label: "評価", defaultValue: 5, validation: { min: 1, max: 5 } }),
        date: fields.date({ label: "日付" }),
        locale: fields.select({
          label: "言語",
          options: [
            { value: "ja", label: "日本語" },
            { value: "en", label: "English" },
            { value: "ko", label: "한국어" },
          ],
          defaultValue: "ja",
        }),
        featured: fields.checkbox({ label: "おすすめ" }),
      },
    }),
    roadmap: collection({
      label: "ロードマップ",
      slugField: "title",
      path: "content/roadmap/*",
      format: "json",
      schema: {
        title: fields.slug({ name: { label: "タイトル" } }),
        description: fields.text({ label: "説明", multiline: true }),
        status: fields.select({
          label: "ステータス",
          options: [
            { value: "planned", label: "予定" },
            { value: "in-progress", label: "進行中" },
            { value: "completed", label: "完了" },
          ],
          defaultValue: "planned",
        }),
        targetVersion: fields.text({ label: "対象バージョン" }),
        locale: fields.select({
          label: "言語",
          options: [
            { value: "ja", label: "日本語" },
            { value: "en", label: "English" },
            { value: "ko", label: "한국어" },
          ],
          defaultValue: "ja",
        }),
      },
    }),
  },
});
