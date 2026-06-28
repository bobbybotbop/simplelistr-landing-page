"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check, Lock } from "lucide-react";
import { WaitlistButton } from "./waitlist-button";

const pioneer = {
  name: "Pioneer",
  badge: "Waitlist Early Access",
  description:
    "Reserve your limited time spot, early supporters will get an exclusive free month, and access to a discord community.",
  price: "1 month free",
  features: [
    "50 listings per month",
    "50 AI image editing credits per month",
    "Automatic eBay listing creation based on an existing listing",
    "AI-powered image thumbnail generation via image search",
    "Shape the direction of the software — share feedback and decide what gets built next",
    "Request and integrate the features you want most",
    "Exclusive access to a private Discord community of early members",
  ],
  note: "After the free month, you'll need a paid plan to continue.",
  cta: "Join Waitlist",
};

const paidPlans = [
  {
    name: "Starter",
    price: "$27/mo",
    description: "For individuals listing at scale.",
    features: [
      "50 listings per month",
      "75 AI image editing credits per month",
      "Automatic eBay listing creation based on an existing listing",
      "AI-powered image thumbnail generation via image search",
      "Printables integration",
      "Access to the research agent with Google Trends data",
      "AI image generation for automatic listings",
    ],
    cta: "Get Started",
  },
  {
    name: "Enterprise",
    price: "Custom Pricing",
    description: "Pay only for what you use.",
    features: [
      "Listings and AI image editing credits billed per use — no monthly caps",
      "Automatic eBay listing creation based on an existing listing",
      "AI-powered image thumbnail generation via image search",
      "Printables integration",
      "Access to the research agent with Google Trends data",
      "AI image generation and editing for automatic listings",
      "Priority support",
    ],
    cta: "Contact Us",
  },
];

interface PricingSectionProps {
  waitlisted?: boolean;
}

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return { ref, visible };
}

export function PricingSection({ waitlisted = false }: PricingSectionProps) {
  const headerReveal = useScrollReveal();
  const pioneerReveal = useScrollReveal();
  const paidReveal = useScrollReveal();

  return (
    <section
      id="pricing"
      className="relative py-32 lg:py-40 border-t border-foreground/10"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div
          ref={headerReveal.ref}
          className={`max-w-3xl mb-20 transition-all duration-700 ${headerReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase block mb-6">
            Pricing
          </span>
          <h2 className="font-display text-5xl md:text-6xl lg:text-7xl tracking-tight text-foreground mb-6">
            Simple, transparent
            <br />
            <span className="text-stroke">pricing</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl">
            Prices will change as SimpleListr grows — our goal is to keep it as
            affordable as possible.
          </p>
        </div>

        {/* Pioneer — Featured */}
        <div
          ref={pioneerReveal.ref}
          className={`relative mb-px transition-all duration-700 delay-100 ${pioneerReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          {/* Glow */}
          <div className="absolute -inset-1 bg-linear-to-r from-pink-400 via-purple-500 to-pink-400 opacity-50 blur-xl rounded-sm pointer-events-none" aria-hidden="true" />
        <div className="relative bg-foreground text-primary-foreground p-8 lg:p-12 border-2 border-foreground">
          <span className="absolute -top-3 left-8 px-3 py-1 bg-primary-foreground text-foreground text-xs font-mono uppercase tracking-widest">
            {pioneer.badge}
          </span>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left */}
            <div>
              <span className="font-mono text-xs text-primary-foreground/50">
                01
              </span>
              <h3 className="font-display text-4xl text-primary-foreground mt-2 mb-3">
                {pioneer.name}
              </h3>
              <p className="text-sm text-primary-foreground/60 mb-8">
                {pioneer.description}
              </p>

              <div className="mb-6 pb-6 border-b border-primary-foreground/20">
                <span className="font-display text-4xl text-primary-foreground">
                  {pioneer.price}
                </span>
              </div>

              <p className="text-xs text-primary-foreground/50 mb-8">
                {pioneer.note}
              </p>

              <WaitlistButton variant="dark" waitlisted={waitlisted} />
            </div>

            {/* Right — features */}
            <ul className="space-y-4">
              {pioneer.features.map((f) => (
                <li key={f} className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-primary-foreground mt-0.5 shrink-0" />
                  <span className="text-sm text-primary-foreground/80">
                    {f}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        </div>

        {/* Paid plans — grayed out */}
        <div
          ref={paidReveal.ref}
          className={`transition-all duration-700 delay-200 ${paidReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <div className="grid md:grid-cols-2 gap-px bg-foreground/10 opacity-50">
            {paidPlans.map((plan, idx) => (
              <div key={plan.name} className="relative p-8 lg:p-12 bg-background">
                <div className="absolute top-4 right-4 flex items-center gap-1.5 text-xs font-mono text-muted-foreground">
                  <Lock className="w-3 h-3" />
                  Coming soon
                </div>

                <span className="font-mono text-xs text-muted-foreground">
                  {String(idx + 2).padStart(2, "0")}
                </span>
                <h3 className="font-display text-3xl text-foreground mt-2 mb-2">
                  {plan.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-8">
                  {plan.description}
                </p>

                <div className="mb-8 pb-8 border-b border-foreground/10">
                  <span className="font-display text-4xl text-foreground">
                    {plan.price}
                  </span>
                </div>

                <ul className="space-y-4 mb-10">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-3">
                      <Check className="w-4 h-4 text-foreground mt-0.5 shrink-0" />
                      <span className="text-sm text-muted-foreground">{f}</span>
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  disabled
                  aria-label={`${plan.name} — coming soon`}
                  className="w-full py-4 flex items-center justify-center gap-2 text-sm font-medium border border-foreground/20 text-foreground cursor-not-allowed"
                >
                  {plan.cta}
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom notes */}
        <div className="mt-12 space-y-3 text-center text-sm text-muted-foreground">
          <p>
            A free tier will eventually be available — but it will include
            roughly a quarter of the features and fewer benefits compared to
            joining the waitlist now.
          </p>
          <p className="text-xs">
            Prices are subject to change. We're committed to keeping SimpleListr
            affordable.
          </p>
        </div>
      </div>
    </section>
  );
}
