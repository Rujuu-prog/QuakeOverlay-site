import { describe, it, expect } from "vitest";
import { render, screen } from "@/test/utils";
import { HowItWorks } from "../HowItWorks";

describe("HowItWorks", () => {
  it("renders the section title", () => {
    render(<HowItWorks />);
    expect(screen.getByText("Easy 3 Steps")).toBeInTheDocument();
  });

  it("renders the section subtitle", () => {
    render(<HowItWorks />);
    expect(screen.getByText("Setup takes just minutes")).toBeInTheDocument();
  });

  it("renders 3 steps", () => {
    render(<HowItWorks />);
    expect(screen.getByText("Download")).toBeInTheDocument();
    expect(screen.getByText("Configure")).toBeInTheDocument();
    expect(screen.getByText("Start Streaming")).toBeInTheDocument();
  });

  it("renders step descriptions", () => {
    render(<HowItWorks />);
    expect(
      screen.getByText("Download from Booth and extract the ZIP.")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Launch the app and set your preferences.")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Add a browser source in OBS and set the URL.")
    ).toBeInTheDocument();
  });

  it("renders step numbers", () => {
    render(<HowItWorks />);
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });
});
