import { createClient } from "@/lib/supabase/client";

export async function signInForWaitlist(): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? window.location.origin}/auth/callback`,
    },
  });
  if (error) throw error;
}
