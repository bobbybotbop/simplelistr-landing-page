"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { signInForWaitlist } from "@/lib/auth";

interface WaitlistButtonProps {
  variant?: "light" | "dark";
  waitlisted?: boolean;
}

export function WaitlistButton({ variant = "light", waitlisted = false }: WaitlistButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
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

  async function handleClick() {
    setIsLoading(true);
    try {
      await signInForWaitlist();
    } catch (err) {
      console.error("OAuth error:", err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isLoading}
      className={`${baseClasses} w-48 gap-2 group disabled:opacity-60 disabled:cursor-not-allowed`}
    >
      {isLoading ? "Redirecting…" : "Join Waitlist"}
      {!isLoading && <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />}
    </button>
  );
}
