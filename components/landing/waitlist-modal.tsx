"use client";

import { useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface WaitlistModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WaitlistModal({ open, onOpenChange }: WaitlistModalProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function validateEmail(value: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function handleSubmit() {
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      inputRef.current?.focus();
      return;
    }
    setError("");
    setSubmitted(true);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") handleSubmit();
  }

  function handleOpenChange(value: boolean) {
    if (!value) {
      setEmail("");
      setError("");
      setSubmitted(false);
    }
    onOpenChange(value);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        {submitted ? (
          <div className="flex flex-col items-center gap-4 py-6 text-center">
            <div className="w-12 h-12 rounded-full bg-foreground flex items-center justify-center">
              <ArrowRight className="w-5 h-5 text-background" />
            </div>
            <DialogTitle>You&apos;re on the list</DialogTitle>
            <DialogDescription>
              We&apos;ll reach out to <span className="text-foreground font-medium">{email}</span> when SimpleListr is ready.
            </DialogDescription>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Join the waitlist</DialogTitle>
              <DialogDescription>
                Be the first to know when SimpleListr launches.
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-3 pt-2">
              <div
                className={`flex items-center bg-foreground text-background rounded-full h-14 overflow-hidden pr-2 transition-all ${
                  error ? "ring-2 ring-destructive" : ""
                }`}
              >
                <input
                  ref={inputRef}
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError("");
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="your@email.com"
                  className="flex-1 h-full bg-transparent px-5 text-sm outline-none placeholder:text-background/50 text-background"
                />
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-background text-foreground hover:bg-background/90 transition-colors"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {error && (
                <p className="text-destructive text-xs px-1">{error}</p>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
