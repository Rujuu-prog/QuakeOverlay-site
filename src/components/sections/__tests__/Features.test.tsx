import { describe, it, expect } from "vitest";
import { render, screen } from "@/test/utils";
import { Features } from "../Features";

describe("Features", () => {
  it("renders the section title", () => {
    render(<Features />);
    expect(screen.getByText("Key Features")).toBeInTheDocument();
  });

  it("renders the section subtitle", () => {
    render(<Features />);
    expect(
      screen.getByText("Everything you need for earthquake info on stream")
    ).toBeInTheDocument();
  });

  it("renders 4 feature cards", () => {
    render(<Features />);
    expect(screen.getByText("Earthquake Alerts")).toBeInTheDocument();
    expect(screen.getByText("OBS Overlay")).toBeInTheDocument();
    expect(screen.getByText("Customization")).toBeInTheDocument();
    expect(screen.getByText("Multi-language")).toBeInTheDocument();
  });

  it("renders descriptions for each feature", () => {
    render(<Features />);
    expect(
      screen.getByText("Automatically fetches earthquake data and displays it on your stream overlay. Keep your viewers informed during streams.")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Easily add as a browser source in OBS.")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Fine-tune display position, size, and more.")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Supports Japanese, English, and Korean.")
    ).toBeInTheDocument();
  });
});
