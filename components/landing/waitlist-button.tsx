"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";

interface WaitlistButtonProps {
  variant?: "light" | "dark";
}

export function WaitlistButton({ variant = "light" }: WaitlistButtonProps) {
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  const isLight = variant === "light";

  return (
    <div
      className={`flex items-center overflow-hidden transition-all duration-300 ease-in-out ${
        isLight
          ? "bg-foreground text-background"
          : "bg-primary-foreground text-foreground"
      } ${open ? "w-72 rounded-full pr-1" : "w-40 rounded-full"} h-14`}
    >
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex items-center justify-center gap-2 w-full h-full px-6 text-sm font-medium group"
        >
          Join Waitlist
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      ) : (
        <>
          <input
            ref={inputRef}
            type="email"
            placeholder="your@email.com"
            className={`flex-1 h-full bg-transparent px-5 text-sm outline-none placeholder:opacity-50 ${
              isLight ? "text-background" : "text-foreground"
            }`}
          />
          <button
            type="button"
            className={`shrink-0 flex items-center justify-center w-10 h-10 rounded-full transition-colors ${
              isLight
                ? "bg-background text-foreground hover:bg-background/90"
                : "bg-foreground text-background hover:bg-foreground/90"
            }`}
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </>
      )}
    </div>
  );
}
