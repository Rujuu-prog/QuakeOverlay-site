import { describe, it, expect } from "vitest";
import { render, screen } from "@/test/utils";
import { Reviews } from "../Reviews";

describe("Reviews", () => {
  it("renders the section title", () => {
    render(<Reviews reviews={[]} />);
    expect(screen.getByText("User Reviews")).toBeInTheDocument();
  });

  it("renders the section subtitle", () => {
    render(<Reviews reviews={[]} />);
    expect(
      screen.getByText("What users are saying about QuakeOverlay")
    ).toBeInTheDocument();
  });

  it("renders empty state when no reviews", () => {
    render(<Reviews reviews={[]} />);
    expect(screen.getByText("Reviews coming soon")).toBeInTheDocument();
  });

  it("renders review cards when reviews are provided", () => {
    const reviews = [
      {
        name: "User1",
        platform: "Twitch",
        content: "Great tool for streaming!",
      },
      {
        name: "User2",
        platform: "YouTube",
        content: "Easy to set up and use.",
      },
    ];
    render(<Reviews reviews={reviews} />);
    expect(screen.getByText("Great tool for streaming!")).toBeInTheDocument();
    expect(screen.getByText("Easy to set up and use.")).toBeInTheDocument();
    expect(screen.getByText("User1")).toBeInTheDocument();
    expect(screen.getByText("User2")).toBeInTheDocument();
  });
});
