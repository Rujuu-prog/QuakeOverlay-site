import { describe, it, expect } from "vitest";
import { getScreenshotPath } from "../screenshots";

describe("getScreenshotPath", () => {
  it("ロケール画像なし → ダミーパスを返す", () => {
    const result = getScreenshotPath("main", "ja", []);
    expect(result).toBe("/images/dummy/app-screenshot-main.svg");
  });

  it("全キーで正しいダミーパスを返す", () => {
    expect(getScreenshotPath("main", "ja", [])).toBe(
      "/images/dummy/app-screenshot-main.svg"
    );
    expect(getScreenshotPath("overlay", "ja", [])).toBe(
      "/images/dummy/app-screenshot-overlay.svg"
    );
    expect(getScreenshotPath("settings", "ja", [])).toBe(
      "/images/dummy/app-screenshot-settings.svg"
    );
  });

  it("未知のロケール → ダミーパスを返す", () => {
    const result = getScreenshotPath("main", "zh", []);
    expect(result).toBe("/images/dummy/app-screenshot-main.svg");
  });

  it("ロケール登録済み → ロケール固有パスを返す", () => {
    const result = getScreenshotPath("main", "ja", ["ja"]);
    expect(result).toBe("/images/screenshots/ja/app-screenshot-main.png");
  });

  it("該当ロケールなし・デフォルトロケールあり → デフォルトのパスを返す", () => {
    const result = getScreenshotPath("main", "en", ["ja"]);
    expect(result).toBe("/images/screenshots/ja/app-screenshot-main.png");
  });

  it("どのロケールも未登録 → ダミーパスを返す", () => {
    const result = getScreenshotPath("main", "en", []);
    expect(result).toBe("/images/dummy/app-screenshot-main.svg");
  });
});
