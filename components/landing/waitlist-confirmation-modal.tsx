"use client";

import { useEffect, useRef } from "react";
import confetti from "canvas-confetti";

interface WaitlistConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  alreadyOnList?: boolean;
}

export function WaitlistConfirmationModal({ open, onClose, alreadyOnList = false }: WaitlistConfirmationModalProps) {
  const hasFiredRef = useRef(false);

  useEffect(() => {
    if (!open || alreadyOnList || hasFiredRef.current) return;
    hasFiredRef.current = true;

    const end = Date.now() + 2500;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#a855f7", "#3b82f6", "#10b981"],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#a855f7", "#3b82f6", "#10b981"],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }, [open]);

  useEffect(() => {
    if (!open) {
      hasFiredRef.current = false;
    }
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative bg-background border border-foreground/10 rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center animate-in fade-in zoom-in-90 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-5xl mb-4">{alreadyOnList ? "👋" : "🎉"}</div>
        <h2 className="text-2xl font-display font-semibold mb-2">
          {alreadyOnList ? "You're already on the list!" : "You're on the list!"}
        </h2>
        <p className="text-foreground/60 text-sm mb-6 leading-relaxed">
          {alreadyOnList ? (
            "Looks like you've already signed up. We'll reach out when SimpleListr is released."
          ) : (
            <>
              Thanks for joining the SimpleListr waitlist. We&apos;ll reach out when SimpleListr is released.
              <br />
              In the meantime, check your email for a discord server link!
            </>
          )}
        </p>
        <button
          onClick={onClose}
          className="w-full bg-foreground text-background rounded-full h-11 text-sm font-medium hover:bg-foreground/90 transition-colors"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
