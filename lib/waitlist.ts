"use server";

import { createServiceClient } from "@/lib/supabase/server";
import { resend } from "@/lib/resend";
import { waitlistConfirmationHtml } from "@/lib/email-templates";

export type AddToWaitlistResult =
  | { success: true }
  | { alreadyOnList: true }
  | { error: string };

export async function addToWaitlist(
  email: string,
  userId: string
): Promise<AddToWaitlistResult> {
  const supabase = createServiceClient();

  const { error: insertError } = await supabase
    .from("waitlist")
    .insert({ email, user_id: userId });

  if (insertError) {
    if (insertError.code === "23505") {
      return { alreadyOnList: true };
    }
    console.error("Waitlist insert error:", insertError);
    return { error: "Server error" };
  }

  resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: email,
    subject: "You're on the SimpleListr waitlist",
    html: waitlistConfirmationHtml(email),
  }).catch((err) => console.error("Resend send error:", err));

  return { success: true };
}
