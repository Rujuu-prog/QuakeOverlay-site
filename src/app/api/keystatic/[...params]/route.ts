import { makeRouteHandler } from "@keystatic/next/route-handler";
import keystaticConfig from "../../../../../keystatic.config";

function notFoundResponse() {
  return new Response("Not Found", { status: 404 });
}

const handler = makeRouteHandler({ config: keystaticConfig });

export const GET =
  process.env.NODE_ENV === "production" ? notFoundResponse : handler.GET;
export const POST =
  process.env.NODE_ENV === "production" ? notFoundResponse : handler.POST;
