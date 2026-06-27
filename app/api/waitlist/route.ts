import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { resend } from "@/lib/resend";
import { waitlistConfirmationHtml } from "@/lib/email-templates";

export async function POST(request: NextRequest) {
  const { email, userId } = await request.json();

  if (!email || !userId) {
    return NextResponse.json({ error: "Missing email or userId" }, { status: 400 });
  }

  const supabase = createServiceClient();

  const { error: insertError } = await supabase
    .from("waitlist")
    .insert({ email, user_id: userId });

  if (insertError) {
    // unique constraint violation — already on list
    if (insertError.code === "23505") {
      return NextResponse.json({ alreadyOnList: true }, { status: 409 });
    }
    console.error("Waitlist insert error:", insertError);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }

  // Non-blocking: send confirmation email
  resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: email,
    subject: "You're on the SimpleListr waitlist",
    html: waitlistConfirmationHtml(email),
  }).catch((err) => console.error("Resend send error:", err));

  return NextResponse.json({ success: true });
}
