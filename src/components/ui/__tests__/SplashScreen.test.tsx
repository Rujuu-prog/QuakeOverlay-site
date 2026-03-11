import { render, screen, act } from "@/test/utils";
import { SplashScreen } from "../SplashScreen";
import { SPLASH_SCREEN } from "@/constants/animation";

describe("SplashScreen", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    sessionStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders overlay with SeismicLoader on first visit", () => {
    render(<SplashScreen />);

    const overlay = screen.getByTestId("splash-overlay");
    expect(overlay).toBeInTheDocument();
    expect(overlay).toHaveAttribute("aria-hidden", "true");

    // SplashContent is rendered inside
    expect(overlay.querySelector("[data-testid='splash-content']")).toBeInTheDocument();
  });

  it("starts with pending phase then transitions to visible", () => {
    render(<SplashScreen />);

    const overlay = screen.getByTestId("splash-overlay");
    expect(overlay).toHaveAttribute("data-phase", "visible");
  });

  it("transitions to fading phase after displayDuration", () => {
    render(<SplashScreen />);

    act(() => {
      vi.advanceTimersByTime(SPLASH_SCREEN.displayDuration);
    });

    const overlay = screen.getByTestId("splash-overlay");
    expect(overlay).toHaveAttribute("data-phase", "fading");
  });

  it("removes overlay from DOM after fade completes", () => {
    render(<SplashScreen />);

    act(() => {
      vi.advanceTimersByTime(
        SPLASH_SCREEN.displayDuration + SPLASH_SCREEN.fadeDuration
      );
    });

    expect(screen.queryByTestId("splash-overlay")).not.toBeInTheDocument();
  });

  it("sets sessionStorage flag after displaying", () => {
    render(<SplashScreen />);

    expect(sessionStorage.getItem(SPLASH_SCREEN.sessionKey)).toBe("true");
  });

  it("does not render when sessionStorage flag exists (repeat visit)", () => {
    sessionStorage.setItem(SPLASH_SCREEN.sessionKey, "true");

    render(<SplashScreen />);

    expect(screen.queryByTestId("splash-overlay")).not.toBeInTheDocument();
  });

  it("skips splash when prefers-reduced-motion is set", () => {
    const matchMediaSpy = vi.spyOn(window, "matchMedia");
    matchMediaSpy.mockImplementation((query: string) => ({
      matches: query === "(prefers-reduced-motion: reduce)",
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    render(<SplashScreen />);

    expect(screen.queryByTestId("splash-overlay")).not.toBeInTheDocument();
    expect(sessionStorage.getItem(SPLASH_SCREEN.sessionKey)).toBe("true");

    matchMediaSpy.mockRestore();
  });
});
