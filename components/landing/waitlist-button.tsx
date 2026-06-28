"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { signInForWaitlist } from "@/lib/auth";

interface WaitlistButtonProps {
  variant?: "light" | "dark";
  waitlisted?: boolean;
  size?: "default" | "xl";
}

export function WaitlistButton({ variant = "light", waitlisted = false, size = "default" }: WaitlistButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const isLight = variant === "light";
  const isXl = size === "xl";

  const baseClasses = `flex items-center justify-center rounded-full font-medium transition-colors ${
    isXl ? "h-16 px-10 text-base" : "h-14 px-6 text-sm"
  } ${
    isLight
      ? "bg-foreground text-background hover:bg-foreground/90"
      : "bg-primary-foreground text-foreground hover:bg-primary-foreground/90"
  }`;

  if (waitlisted) {
    return (
      <div className={`${baseClasses} ${isXl ? "w-80" : "w-72"} cursor-default`}>
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

  const button = (
    <button
      type="button"
      onClick={handleClick}
      disabled={isLoading}
      className={`${baseClasses} ${isXl ? "w-64" : "w-48"} gap-2 group disabled:opacity-60 disabled:cursor-not-allowed`}
    >
      {isLoading ? "Redirecting…" : "Join Waitlist"}
      {!isLoading && <ArrowRight aria-hidden="true" className={`transition-transform group-hover:translate-x-1 ${isXl ? "w-5 h-5" : "w-4 h-4"}`} />}
    </button>
  );

  if (!isXl) return button;

  return (
    <div className="relative inline-flex">
      <div className="absolute -inset-1 bg-linear-to-r from-pink-400 via-purple-500 to-pink-400 opacity-50 blur-xl rounded-full pointer-events-none" />
      <div className="relative">{button}</div>
    </div>
  );
}
