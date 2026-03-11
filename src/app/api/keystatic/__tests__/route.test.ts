import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";

vi.mock("@keystatic/next/route-handler", () => ({
  makeRouteHandler: () => ({
    GET: () => new Response("OK", { status: 200 }),
    POST: () => new Response("OK", { status: 200 }),
  }),
}));

vi.mock("../../../../../../keystatic.config", () => ({
  default: {},
}));

describe("Keystatic API route", () => {
  const originalNodeEnv = process.env.NODE_ENV;

  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv;
  });

  it("GET returns 404 in production", async () => {
    process.env.NODE_ENV = "production";
    const { GET } = await import("../[...params]/route");
    const response = await GET(
      new Request("http://localhost/api/keystatic/test")
    );
    expect(response.status).toBe(404);
  });

  it("POST returns 404 in production", async () => {
    process.env.NODE_ENV = "production";
    const { POST } = await import("../[...params]/route");
    const response = await POST(
      new Request("http://localhost/api/keystatic/test", { method: "POST" })
    );
    expect(response.status).toBe(404);
  });

  it("GET returns 200 in development", async () => {
    process.env.NODE_ENV = "development";
    const { GET } = await import("../[...params]/route");
    const response = await GET(
      new Request("http://localhost/api/keystatic/test")
    );
    expect(response.status).toBe(200);
  });

  it("POST returns 200 in development", async () => {
    process.env.NODE_ENV = "development";
    const { POST } = await import("../[...params]/route");
    const response = await POST(
      new Request("http://localhost/api/keystatic/test", { method: "POST" })
    );
    expect(response.status).toBe(200);
  });
});
