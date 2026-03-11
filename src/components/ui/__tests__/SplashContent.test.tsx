import { render, screen } from "@/test/utils";
import { SplashContent } from "../SplashContent";
import { SPLASH_CONTENT } from "@/constants/animation";

describe("SplashContent", () => {
  it("renders a div wrapper (not SVG) with aria-hidden", () => {
    render(<SplashContent />);

    const wrapper = screen.getByTestId("splash-content");
    expect(wrapper.tagName.toLowerCase()).toBe("div");
    expect(wrapper).toHaveAttribute("aria-hidden", "true");
  });

  it("renders Activity icon", () => {
    render(<SplashContent />);

    const wrapper = screen.getByTestId("splash-content");
    const icon = wrapper.querySelector(".splash-icon");
    expect(icon).toBeInTheDocument();
    expect(icon!.tagName.toLowerCase()).toBe("svg");
  });

  it("renders 3 ripple divs with staggered animation delay", () => {
    render(<SplashContent />);

    const wrapper = screen.getByTestId("splash-content");
    const ripples = wrapper.querySelectorAll(".splash-ripple");
    expect(ripples).toHaveLength(SPLASH_CONTENT.rippleCount);

    ripples.forEach((ripple, i) => {
      expect(ripple.tagName.toLowerCase()).toBe("div");
      const expectedDelay = `${i * SPLASH_CONTENT.rippleStaggerDelay}s`;
      expect(ripple).toHaveStyle({ animationDelay: expectedDelay });
    });
  });

  it("does not render brand text", () => {
    render(<SplashContent />);

    const wrapper = screen.getByTestId("splash-content");
    expect(wrapper.textContent).toBe("");
  });

  it("matches snapshot", () => {
    const { container } = render(<SplashContent />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
