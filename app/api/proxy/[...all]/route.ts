import { NextRequest, NextResponse } from "next/server";
import { API_URL } from "@/lib/api";

export const runtime = "nodejs";

async function proxy(request: NextRequest, suffix: string) {
  const target = `${API_URL}${suffix}`;
  const headers = new Headers(request.headers);
  headers.delete("host");
  headers.delete("connection");

  const isBodyless = request.method === "GET" || request.method === "HEAD";
  const upstream = await fetch(target, {
    method: request.method,
    headers,
    redirect: "manual",
    body: isBodyless ? undefined : await request.arrayBuffer(),
    cache: "no-store",
  });

  const responseHeaders = new Headers(upstream.headers);
  responseHeaders.delete("content-encoding");
  responseHeaders.delete("transfer-encoding");

  return new NextResponse(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: responseHeaders,
  });
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ all: string[] }> },
) {
  const { all } = await params;
  return proxy(request, `/${all.join("/")}${request.nextUrl.search}`);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ all: string[] }> },
) {
  const { all } = await params;
  return proxy(request, `/${all.join("/")}${request.nextUrl.search}`);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ all: string[] }> },
) {
  const { all } = await params;
  return proxy(request, `/${all.join("/")}${request.nextUrl.search}`);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ all: string[] }> },
) {
  const { all } = await params;
  return proxy(request, `/${all.join("/")}${request.nextUrl.search}`);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ all: string[] }> },
) {
  const { all } = await params;
  return proxy(request, `/${all.join("/")}${request.nextUrl.search}`);
}
