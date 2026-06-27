import { NextRequest, NextResponse } from "next/server";
import { addToWaitlist } from "@/lib/waitlist";

export async function POST(request: NextRequest) {
  let body: { email?: unknown; userId?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { email, userId } = body;

  if (!email || !userId || typeof email !== "string" || typeof userId !== "string") {
    return NextResponse.json({ error: "Missing email or userId" }, { status: 400 });
  }

  const result = await addToWaitlist(email, userId);

  if ("alreadyOnList" in result) {
    return NextResponse.json({ alreadyOnList: true }, { status: 409 });
  }
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
