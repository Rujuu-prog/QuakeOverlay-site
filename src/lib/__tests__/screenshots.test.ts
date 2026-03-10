import { describe, it, expect } from "vitest";
import { getScreenshotPath, isAnimatedFormat } from "../screenshots";

describe("getScreenshotPath", () => {
  it("ダミーSVGキー → /images/screenshots/ja/filename.svg を返す", () => {
    const result = getScreenshotPath("main", "ja", ["ja"]);
    expect(result).toBe("/images/screenshots/ja/app-screenshot-main.svg");
  });

  it("実画像キー(dashboard) → /images/screenshots/ja/dashboard.png を返す", () => {
    const result = getScreenshotPath("dashboard", "ja", ["ja"]);
    expect(result).toBe("/images/screenshots/ja/dashboard.png");
  });

  it("全キーで正しいパスを返す", () => {
    expect(getScreenshotPath("main", "ja", ["ja"])).toBe(
      "/images/screenshots/ja/app-screenshot-main.svg"
    );
    expect(getScreenshotPath("overlay", "ja", ["ja"])).toBe(
      "/images/screenshots/ja/app-screenshot-overlay.svg"
    );
    expect(getScreenshotPath("settings", "ja", ["ja"])).toBe(
      "/images/screenshots/ja/app-screenshot-settings.svg"
    );
    expect(getScreenshotPath("dashboard", "ja", ["ja"])).toBe(
      "/images/screenshots/ja/dashboard.png"
    );
    expect(getScreenshotPath("receiveLog", "ja", ["ja"])).toBe(
      "/images/screenshots/ja/app-screenshot-receive-log.svg"
    );
    expect(getScreenshotPath("overlaySettings", "ja", ["ja"])).toBe(
      "/images/screenshots/ja/app-screenshot-overlay-settings.svg"
    );
    expect(getScreenshotPath("mapSettings", "ja", ["ja"])).toBe(
      "/images/screenshots/ja/app-screenshot-map-settings.svg"
    );
  });

  it("ロケール登録済み → ロケール固有パスを返す", () => {
    const result = getScreenshotPath("main", "ja", ["ja"]);
    expect(result).toBe("/images/screenshots/ja/app-screenshot-main.svg");
  });

  it("該当ロケールなし → デフォルトロケール(ja)のパスを返す", () => {
    const result = getScreenshotPath("main", "en", ["ja"]);
    expect(result).toBe("/images/screenshots/ja/app-screenshot-main.svg");
  });

  it("未知のロケール → デフォルトロケール(ja)のパスを返す", () => {
    const result = getScreenshotPath("main", "zh", ["ja"]);
    expect(result).toBe("/images/screenshots/ja/app-screenshot-main.svg");
  });

  it("デフォルト引数(LOCALES_WITH_SCREENSHOTS)でjaのパスを返す", () => {
    const result = getScreenshotPath("dashboard", "ja");
    expect(result).toBe("/images/screenshots/ja/dashboard.png");
  });
});

describe("isAnimatedFormat", () => {
  it(".png キーはfalseを返す", () => {
    expect(isAnimatedFormat("dashboard")).toBe(false);
  });

  it(".svg キーはfalseを返す", () => {
    expect(isAnimatedFormat("main")).toBe(false);
    expect(isAnimatedFormat("overlay")).toBe(false);
    expect(isAnimatedFormat("settings")).toBe(false);
  });

  it("全キーが現在は非アニメーション形式", () => {
    expect(isAnimatedFormat("dashboard")).toBe(false);
    expect(isAnimatedFormat("main")).toBe(false);
    expect(isAnimatedFormat("overlay")).toBe(false);
    expect(isAnimatedFormat("settings")).toBe(false);
    expect(isAnimatedFormat("receiveLog")).toBe(false);
    expect(isAnimatedFormat("overlaySettings")).toBe(false);
    expect(isAnimatedFormat("mapSettings")).toBe(false);
  });
});
