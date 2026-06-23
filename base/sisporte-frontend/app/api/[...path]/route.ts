import { NextRequest, NextResponse } from "next/server";
import { getInternalApiRoot } from "@/lib/internal-api-url";

const HOP_BY_HOP = new Set([
  "connection",
  "content-length",
  "host",
  "keep-alive",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
]);

function forwardHeaders(incoming: Headers): Headers {
  const out = new Headers();
  incoming.forEach((value, key) => {
    const k = key.toLowerCase();
    if (HOP_BY_HOP.has(k)) return;
    if (k.startsWith("x-middleware-")) return;
    if (k.startsWith("x-vercel-")) return;
    out.set(key, value);
  });
  return out;
}

function buildTargetUrl(pathSegments: string[], search: string): string {
  const root = getInternalApiRoot();
  const suffix = pathSegments.length ? pathSegments.join("/") : "";
  const base = suffix ? `${root}/${suffix}` : root;
  return search ? `${base}${search}` : base;
}

function buildBufferedResponseHeaders(
  source: Response,
  body: ArrayBuffer,
): Headers {
  const out = new Headers();
  source.headers.forEach((value, key) => {
    const k = key.toLowerCase();
    if (
      k === "transfer-encoding" ||
      k === "content-encoding" ||
      k === "connection" ||
      k === "keep-alive" ||
      k === "content-length"
    ) {
      return;
    }
    out.set(key, value);
  });
  out.set("Content-Length", String(body.byteLength));
  return out;
}

function buildStreamResponseHeaders(source: Response): Headers {
  const out = new Headers();
  source.headers.forEach((value, key) => {
    const k = key.toLowerCase();
    if (k === "transfer-encoding" || k === "connection" || k === "keep-alive") {
      return;
    }
    out.set(key, value);
  });
  return out;
}

async function proxy(request: NextRequest, pathSegments: string[]) {
  const url = request.nextUrl;
  const target = buildTargetUrl(pathSegments, url.search);

  const init: RequestInit & { duplex?: "half" } = {
    method: request.method,
    headers: forwardHeaders(request.headers),
    redirect: "manual",
  };

  if (!["GET", "HEAD", "OPTIONS"].includes(request.method)) {
    init.body = request.body;
    init.duplex = "half";
  }

  let backend: Response;
  try {
    backend = await fetch(target, init);
  } catch (e) {
    console.error("[api proxy] fetch failed:", target, e);
    return NextResponse.json(
      { message: "Não foi possível contactar o servidor da API." },
      { status: 502 },
    );
  }

  const pathStr = pathSegments.join("/");
  const contentType = backend.headers.get("content-type") || "";
  const shouldBufferBody =
    contentType.includes("application/pdf") || pathStr.includes("batch-pdf");

  if (shouldBufferBody && backend.body) {
    const buf = await backend.arrayBuffer();
    return new NextResponse(buf, {
      status: backend.status,
      statusText: backend.statusText,
      headers: buildBufferedResponseHeaders(backend, buf),
    });
  }

  return new NextResponse(backend.body, {
    status: backend.status,
    statusText: backend.statusText,
    headers: buildStreamResponseHeaders(backend),
  });
}

type Ctx = { params: Promise<{ path?: string[] }> };

export async function GET(request: NextRequest, ctx: Ctx) {
  const { path } = await ctx.params;
  return proxy(request, path ?? []);
}

export async function POST(request: NextRequest, ctx: Ctx) {
  const { path } = await ctx.params;
  return proxy(request, path ?? []);
}

export async function PUT(request: NextRequest, ctx: Ctx) {
  const { path } = await ctx.params;
  return proxy(request, path ?? []);
}

export async function PATCH(request: NextRequest, ctx: Ctx) {
  const { path } = await ctx.params;
  return proxy(request, path ?? []);
}

export async function DELETE(request: NextRequest, ctx: Ctx) {
  const { path } = await ctx.params;
  return proxy(request, path ?? []);
}

export async function OPTIONS(request: NextRequest, ctx: Ctx) {
  const { path } = await ctx.params;
  return proxy(request, path ?? []);
}
