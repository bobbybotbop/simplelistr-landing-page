"use client";

import { ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface WaitlistButtonProps {
  variant?: "light" | "dark";
  waitlisted?: boolean;
}

export function WaitlistButton({ variant = "light", waitlisted = false }: WaitlistButtonProps) {
  const isLight = variant === "light";

  const baseClasses = `flex items-center justify-center rounded-full h-14 px-6 text-sm font-medium transition-colors ${
    isLight
      ? "bg-foreground text-background hover:bg-foreground/90"
      : "bg-primary-foreground text-foreground hover:bg-primary-foreground/90"
  }`;

  if (waitlisted) {
    return (
      <div className={`${baseClasses} w-72 cursor-default`}>
        You&apos;re on the list ✓
      </div>
    );
  }

  async function handleJoinWaitlist() {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      },
    });
  }

  return (
    <button
      type="button"
      onClick={handleJoinWaitlist}
      className={`${baseClasses} w-48 gap-2 group`}
    >
      Join Waitlist
      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
    </button>
  );
}
