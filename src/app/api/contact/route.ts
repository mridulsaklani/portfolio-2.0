import { NextResponse } from "next/server";
import { getContactEndpoint } from "@/lib/contact-delivery";

export const runtime = "nodejs";

interface ContactPayload {
  name: string;
  email: string;
  message: string;
}

export async function GET() {
  return NextResponse.json(
    { configured: Boolean(getContactEndpoint()) },
    { headers: { "cache-control": "no-store" } },
  );
}

export async function POST(request: Request) {
  const endpoint = getContactEndpoint();
  if (!endpoint) {
    return NextResponse.json(
      { ok: false, code: "CONTACT_NOT_CONFIGURED" },
      { status: 503 },
    );
  }

  const contentLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(contentLength) && contentLength > 12_000) {
    return NextResponse.json({ ok: false, code: "INVALID_MESSAGE" }, { status: 413 });
  }

  const rawBody = await request.text();
  if (rawBody.length > 12_000) {
    return NextResponse.json({ ok: false, code: "INVALID_MESSAGE" }, { status: 413 });
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(rawBody) as unknown;
  } catch {
    return NextResponse.json({ ok: false, code: "INVALID_MESSAGE" }, { status: 400 });
  }

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    return NextResponse.json({ ok: false, code: "INVALID_MESSAGE" }, { status: 400 });
  }
  const payload = parsed as Partial<ContactPayload>;

  const name = typeof payload.name === "string" ? payload.name.trim() : "";
  const email = typeof payload.email === "string" ? payload.email.trim() : "";
  const message = typeof payload.message === "string" ? payload.message.trim() : "";
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (
    !name || name.length > 120 ||
    !emailPattern.test(email) || email.length > 254 ||
    !message || message.length > 5_000
  ) {
    return NextResponse.json({ ok: false, code: "INVALID_MESSAGE" }, { status: 400 });
  }

  const headers = new Headers({ "content-type": "application/json" });
  const token = process.env.CONTACT_FORM_TOKEN?.trim();
  if (token) headers.set("authorization", `Bearer ${token}`);

  try {
    const delivery = await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify({ name, email, message }),
      signal: AbortSignal.timeout(10_000),
      cache: "no-store",
    });

    if (!delivery.ok) {
      return NextResponse.json({ ok: false, code: "DELIVERY_FAILED" }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, code: "DELIVERY_FAILED" }, { status: 502 });
  }
}
