import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@/test/utils";
import { fireEvent } from "@testing-library/react";
import { ImageCarousel } from "../ImageCarousel";

const TEST_IMAGES = [
  "/images/theme-dark.svg",
  "/images/theme-light.svg",
  "/images/theme-semi-transparent.svg",
];

const TEST_CAPTIONS = ["Dark Theme", "Light Theme", "Semi-transparent Theme"];

describe("ImageCarousel", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders the first image initially", () => {
    render(
      <ImageCarousel images={TEST_IMAGES} captions={TEST_CAPTIONS} />
    );

    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", TEST_IMAGES[0]);
    expect(img).toHaveAttribute("alt", TEST_CAPTIONS[0]);
  });

  it("displays the caption for the current image", () => {
    render(
      <ImageCarousel images={TEST_IMAGES} captions={TEST_CAPTIONS} />
    );

    expect(screen.getByText(TEST_CAPTIONS[0])).toBeInTheDocument();
  });

  it("renders dot navigation buttons for each image", () => {
    render(
      <ImageCarousel images={TEST_IMAGES} captions={TEST_CAPTIONS} />
    );

    const dots = screen.getAllByRole("button", { name: /slide/i });
    expect(dots).toHaveLength(TEST_IMAGES.length);
  });

  it("auto-advances to the next image after the interval", () => {
    render(
      <ImageCarousel
        images={TEST_IMAGES}
        captions={TEST_CAPTIONS}
        interval={4000}
      />
    );

    act(() => {
      vi.advanceTimersByTime(4000);
    });

    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", TEST_IMAGES[1]);
    expect(screen.getByText(TEST_CAPTIONS[1])).toBeInTheDocument();
  });

  it("wraps around to the first image after the last", () => {
    render(
      <ImageCarousel
        images={TEST_IMAGES}
        captions={TEST_CAPTIONS}
        interval={4000}
      />
    );

    act(() => {
      vi.advanceTimersByTime(4000 * TEST_IMAGES.length);
    });

    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", TEST_IMAGES[0]);
  });

  it("switches to the clicked dot's image", () => {
    render(
      <ImageCarousel images={TEST_IMAGES} captions={TEST_CAPTIONS} />
    );

    const dots = screen.getAllByRole("button", { name: /slide/i });
    fireEvent.click(dots[2]);

    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", TEST_IMAGES[2]);
    expect(screen.getByText(TEST_CAPTIONS[2])).toBeInTheDocument();
  });

  it("pauses auto-advance on hover and resumes on unhover", () => {
    render(
      <ImageCarousel
        images={TEST_IMAGES}
        captions={TEST_CAPTIONS}
        interval={4000}
      />
    );

    const carousel = screen.getByTestId("image-carousel");
    fireEvent.mouseEnter(carousel);

    act(() => {
      vi.advanceTimersByTime(4000);
    });

    // Should still show the first image (paused)
    expect(screen.getByRole("img")).toHaveAttribute("src", TEST_IMAGES[0]);

    fireEvent.mouseLeave(carousel);

    act(() => {
      vi.advanceTimersByTime(4000);
    });

    // Should advance after unhover
    expect(screen.getByRole("img")).toHaveAttribute("src", TEST_IMAGES[1]);
  });

  it("uses default interval of 4000ms", () => {
    render(
      <ImageCarousel images={TEST_IMAGES} captions={TEST_CAPTIONS} />
    );

    act(() => {
      vi.advanceTimersByTime(3999);
    });
    expect(screen.getByRole("img")).toHaveAttribute("src", TEST_IMAGES[0]);

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(screen.getByRole("img")).toHaveAttribute("src", TEST_IMAGES[1]);
  });

  it("highlights the active dot", () => {
    render(
      <ImageCarousel images={TEST_IMAGES} captions={TEST_CAPTIONS} />
    );

    const dots = screen.getAllByRole("button", { name: /slide/i });
    expect(dots[0].className).toContain("bg-accent");
    expect(dots[1].className).not.toContain("bg-accent");
  });
});
