"use client";

import React, { useEffect, useState } from "react";
import { WaitlistButton } from "./waitlist-button";

const words = ["list", "research", "write", "scale", "optimize"];

interface HeroSectionProps {
  waitlisted?: boolean;
}

export function HeroSection({ waitlisted = false }: HeroSectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % words.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col justify-start lg:justify-start pt-24 lg:pt-28 overflow-hidden">
      {/* Subtle grid lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        {[...Array(8)].map((_, i) => (
          <div
            key={`h-${i}`}
            className="absolute h-px bg-foreground/10"
            style={{ top: `${12.5 * (i + 1)}%`, left: 0, right: 0 }}
          />
        ))}
        {[...Array(12)].map((_, i) => (
          <div
            key={`v-${i}`}
            className="absolute w-px bg-foreground/10"
            style={{ left: `${8.33 * (i + 1)}%`, top: 0, bottom: 0 }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full px-6 lg:max-w-350 lg:ml-12 lg:px-12 lg:w-auto">
        <div
          className={`mb-6 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <span className="inline-flex items-center gap-3 text-[clamp(0.65rem,2vw,0.875rem)] font-mono text-muted-foreground">
            <span className="w-8 h-px bg-foreground/30" />
            Work in progress — coming soon
          </span>
        </div>

        <div className="mb-8 lg:mb-10">
          <h1
            className={`text-[clamp(3.5rem,12vw,7rem)] lg:text-[clamp(2.5rem,9vw,7rem)] font-display leading-[0.9] tracking-tight transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <span className="block">SimpleListr</span>
            <span className="block">
              <span className="relative inline-block">
                <span key={wordIndex} className="inline-flex">
                  {words[wordIndex].split("").map((char, i) => (
                    <span
                      key={`${wordIndex}-${i}`}
                      className="inline-block animate-char-in"
                      style={{ animationDelay: `${i * 50}ms` }}
                    >
                      {char}
                    </span>
                  ))}
                </span>
                <span className="absolute -bottom-2 left-0 right-0 h-3 bg-foreground/10" />
              </span>
            </span>
          </h1>
        </div>

        <p
          className={`text-[clamp(0.875rem,2.5vw,1.5rem)] text-muted-foreground leading-relaxed max-w-xl mb-8 lg:mb-12 transition-all duration-700 delay-200 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          Use SimpleListr to research, write, and list infinite listings
          automatically. List infinitely. Scale infinitely.
        </p>

        <div
          className={`flex justify-center lg:justify-start transition-all duration-700 delay-300 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <WaitlistButton variant="light" waitlisted={waitlisted} size="xl" />
        </div>
      </div>
    </section>
  );
}
