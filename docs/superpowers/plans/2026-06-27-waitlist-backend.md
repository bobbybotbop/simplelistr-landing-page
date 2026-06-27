# Waitlist Backend Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the client-side email input waitlist with a Google OAuth flow that persists signups to Supabase and sends a confirmation email via Resend.

**Architecture:** User clicks "Join Waitlist" → triggers Supabase Google OAuth → `/auth/callback` exchanges the code for a session → `/api/waitlist` inserts the email+user_id into the `waitlist` table and fires a Resend confirmation email → user is redirected to `/?waitlisted=true` which flips the UI to success state.

**Tech Stack:** Next.js 15 (App Router), Supabase Auth + Supabase JS, Resend Node SDK, React Email, Tailwind CSS

---

## Prerequisites (manual — must be done before running any code)

These cannot be automated. Complete them before starting Task 1.

**A. Supabase service-role key**
1. Go to your Supabase dashboard → your project → **Settings → API**
2. Copy the `service_role` secret (not the anon key)
3. Add to `.env.local`: `SUPABASE_SERVICE_ROLE_KEY=<your_key>`

**B. Resend API key**
1. Create account at resend.com if needed
2. **API Keys → Create API Key** (Full access)
3. Add to `.env.local`: `RESEND_API_KEY=<your_key>`
4. Add to `.env.local`: `RESEND_FROM_EMAIL=onboarding@resend.dev`

**C. Site URL**
Add to `.env.local`: `NEXT_PUBLIC_SITE_URL=http://localhost:3000`

**D. Google OAuth app (Google Cloud Console)**
1. Go to [console.cloud.google.com](https://console.cloud.google.com) → APIs & Services → Credentials
2. Create OAuth 2.0 Client ID (Web application)
3. Add Authorized redirect URI: `https://<your-supabase-project-ref>.supabase.co/auth/v1/callback`
4. Copy the **Client ID** and **Client Secret**

**E. Enable Google provider in Supabase**
1. Supabase dashboard → **Authentication → Providers → Google**
2. Toggle on, paste Client ID and Client Secret from step D
3. Save

**F. Set site URL in Supabase**
1. Supabase dashboard → **Authentication → URL Configuration**
2. Set **Site URL** to `http://localhost:3000`
3. Add `http://localhost:3000/auth/callback` to **Redirect URLs**

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `lib/supabase/client.ts` | Create | Browser-side Supabase client (anon key) |
| `lib/supabase/server.ts` | Create | Server-side Supabase client (service-role key) |
| `lib/resend.ts` | Create | Resend client instance |
| `emails/waitlist-confirmation.tsx` | Create | React Email confirmation template |
| `app/auth/callback/route.ts` | Create | OAuth code exchange + redirect logic |
| `app/api/waitlist/route.ts` | Create | Insert to Supabase, send Resend email |
| `components/landing/waitlist-button.tsx` | Modify | Replace email input with Google OAuth button |
| `components/landing/waitlist-modal.tsx` | Delete | No longer needed (OAuth is same-tab flow) |
| `components/landing/navigation.tsx` | Modify | Remove WaitlistModal import, comment out Sign in button |
| `app/page.tsx` | Modify | Accept `searchParams`, pass `waitlisted` prop down |
| `components/landing/hero-section.tsx` | Modify | Accept and forward `waitlisted` prop to WaitlistButton |
| `components/landing/pricing-section.tsx` | Modify | Accept and forward `waitlisted` prop to WaitlistButton |

---

## Task 1: Install dependencies

**Files:** `package.json`

- [ ] **Step 1: Install Resend and React Email**

```bash
npm install resend @react-email/components
```

Expected output: packages added, no errors.

- [ ] **Step 2: Commit**

```bash
git add package.json package-lock.json
git commit -m "feat: install resend and react-email"
```

---

## Task 2: Create the Supabase client utilities

**Files:**
- Create: `lib/supabase/client.ts`
- Create: `lib/supabase/server.ts`

- [ ] **Step 1: Create browser client**

Create `lib/supabase/client.ts`:

```typescript
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
}
```

- [ ] **Step 2: Create server client**

Create `lib/supabase/server.ts`:

```typescript
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export function createServiceClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add lib/supabase/client.ts lib/supabase/server.ts
git commit -m "feat: add supabase client utilities"
```

---

## Task 3: Create the Resend client

**Files:**
- Create: `lib/resend.ts`

- [ ] **Step 1: Create Resend client**

Create `lib/resend.ts`:

```typescript
import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);
```

- [ ] **Step 2: Commit**

```bash
git add lib/resend.ts
git commit -m "feat: add resend client"
```

---

## Task 4: Create the waitlist Supabase table

**Files:** SQL run in Supabase dashboard (no local file)

- [ ] **Step 1: Run migration in Supabase SQL editor**

Go to Supabase dashboard → **SQL Editor** → New query. Paste and run:

```sql
create table public.waitlist (
  id          uuid        primary key default gen_random_uuid(),
  email       text        not null unique,
  user_id     uuid        not null unique references auth.users(id) on delete cascade,
  created_at  timestamptz not null default now()
);
```

Expected: table created with no errors.

- [ ] **Step 2: Verify table exists**

In the SQL editor run:

```sql
select column_name, data_type from information_schema.columns
where table_name = 'waitlist';
```

Expected: 4 rows — `id`, `email`, `user_id`, `created_at`.

- [ ] **Step 3: Commit a record of the migration**

Create `supabase/migrations/20260627_create_waitlist.sql`:

```sql
create table public.waitlist (
  id          uuid        primary key default gen_random_uuid(),
  email       text        not null unique,
  user_id     uuid        not null unique references auth.users(id) on delete cascade,
  created_at  timestamptz not null default now()
);
```

```bash
git add supabase/migrations/20260627_create_waitlist.sql
git commit -m "feat: add waitlist table migration"
```

---

## Task 5: Create the confirmation email template

**Files:**
- Create: `emails/waitlist-confirmation.tsx`

- [ ] **Step 1: Create email template**

Create `emails/waitlist-confirmation.tsx`:

```tsx
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from "@react-email/components";

interface WaitlistConfirmationProps {
  email: string;
}

export function WaitlistConfirmation({ email }: WaitlistConfirmationProps) {
  return (
    <Html>
      <Head />
      <Preview>You&apos;re on the SimpleListr waitlist</Preview>
      <Body style={{ backgroundColor: "#ffffff", fontFamily: "sans-serif" }}>
        <Container style={{ maxWidth: "480px", margin: "0 auto", padding: "40px 20px" }}>
          <Heading style={{ fontSize: "24px", fontWeight: "600", color: "#111111" }}>
            You&apos;re on the list.
          </Heading>
          <Text style={{ fontSize: "16px", color: "#555555", lineHeight: "1.6" }}>
            We&apos;ve saved your spot for{" "}
            <span style={{ color: "#111111", fontWeight: "500" }}>{email}</span>.
          </Text>
          <Text style={{ fontSize: "16px", color: "#555555", lineHeight: "1.6" }}>
            We&apos;ll reach out when SimpleListr is ready to launch. Thanks for
            your patience — we&apos;re building something worth waiting for.
          </Text>
          <Text style={{ fontSize: "12px", color: "#999999", marginTop: "40px" }}>
            SimpleListr · You&apos;re receiving this because you joined the waitlist.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export default WaitlistConfirmation;
```

- [ ] **Step 2: Commit**

```bash
git add emails/waitlist-confirmation.tsx
git commit -m "feat: add waitlist confirmation email template"
```

---

## Task 6: Create the /api/waitlist route

**Files:**
- Create: `app/api/waitlist/route.ts`

- [ ] **Step 1: Create the API route**

Create `app/api/waitlist/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { resend } from "@/lib/resend";
import { WaitlistConfirmation } from "@/emails/waitlist-confirmation";

export async function POST(request: NextRequest) {
  const { email, userId } = await request.json();

  if (!email || !userId) {
    return NextResponse.json({ error: "Missing email or userId" }, { status: 400 });
  }

  const supabase = createServiceClient();

  const { error: insertError } = await supabase
    .from("waitlist")
    .insert({ email, user_id: userId });

  if (insertError) {
    // unique constraint violation — already on list
    if (insertError.code === "23505") {
      return NextResponse.json({ alreadyOnList: true }, { status: 409 });
    }
    console.error("Waitlist insert error:", insertError);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }

  // Non-blocking: send confirmation email — don't fail the signup if this errors
  resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: email,
    subject: "You're on the SimpleListr waitlist",
    react: WaitlistConfirmation({ email }),
  }).catch((err) => console.error("Resend send error:", err));

  return NextResponse.json({ success: true });
}
```

- [ ] **Step 2: Commit**

```bash
git add app/api/waitlist/route.ts
git commit -m "feat: add /api/waitlist POST route"
```

---

## Task 7: Create the /auth/callback route

**Files:**
- Create: `app/auth/callback/route.ts`

- [ ] **Step 1: Create the OAuth callback route**

Create `app/auth/callback/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(`${origin}/?error=true`);
  }

  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.session) {
    console.error("OAuth callback error:", error);
    return NextResponse.redirect(`${origin}/?error=true`);
  }

  const { email, id: userId } = data.session.user;

  // Call the waitlist API
  const res = await fetch(`${origin}/api/waitlist`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, userId }),
  });

  // 409 = already on list — still treat as success
  if (!res.ok && res.status !== 409) {
    return NextResponse.redirect(`${origin}/?error=true`);
  }

  return NextResponse.redirect(`${origin}/?waitlisted=true`);
}
```

- [ ] **Step 2: Commit**

```bash
git add app/auth/callback/route.ts
git commit -m "feat: add /auth/callback OAuth exchange route"
```

---

## Task 8: Rewrite WaitlistButton

**Files:**
- Modify: `components/landing/waitlist-button.tsx`

The current component expands an email input inline. Replace the entire file with a simple Google OAuth trigger button that also handles the `waitlisted` success state.

- [ ] **Step 1: Replace the file**

Replace the full contents of `components/landing/waitlist-button.tsx`:

```tsx
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
```

- [ ] **Step 2: Commit**

```bash
git add components/landing/waitlist-button.tsx
git commit -m "feat: replace email input with Google OAuth in WaitlistButton"
```

---

## Task 9: Remove WaitlistModal, update Navigation

**Files:**
- Delete: `components/landing/waitlist-modal.tsx`
- Modify: `components/landing/navigation.tsx`

- [ ] **Step 1: Delete the modal file**

```bash
git rm components/landing/waitlist-modal.tsx
```

- [ ] **Step 2: Update navigation.tsx**

Replace the full contents of `components/landing/navigation.tsx`:

```tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

const navLinks = [
  { name: "Features", href: "#features" },
  { name: "How it works", href: "#how-it-works" },
  { name: "Pricing", href: "#pricing" },
];

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    <header
      className={`fixed z-50 transition-all duration-500 ${
        isScrolled
          ? "top-4 left-4 right-4"
          : "top-0 left-0 right-0"
      }`}
    >
      <nav
        className={`mx-auto transition-all duration-500 ${
          isScrolled || isMobileMenuOpen
            ? "bg-background/80 backdrop-blur-xl border border-foreground/10 rounded-2xl shadow-lg max-w-[1200px]"
            : "bg-transparent max-w-[1400px]"
        }`}
      >
        <div
          className={`flex items-center justify-between transition-all duration-500 px-6 lg:px-8 ${
            isScrolled ? "h-14" : "h-20"
          }`}
        >
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 group">
            <Image
              src="/logo.png"
              alt="SimpleListr"
              width={28}
              height={28}
              className={`mix-blend-multiply dark:invert transition-all duration-500 ${isScrolled ? "w-6 h-6" : "w-7 h-7"}`}
            />
            <span className={`font-display tracking-tight transition-all duration-500 ${isScrolled ? "text-xl" : "text-2xl"}`}>SimpleListr</span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-12">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm text-foreground/70 hover:text-foreground transition-colors duration-300 relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-foreground transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            {/* Sign in placeholder — commented out until auth is built */}
            {/* <a href="#" className={`text-foreground/70 hover:text-foreground transition-all duration-500 ${isScrolled ? "text-xs" : "text-sm"}`}>
              Sign in
            </a> */}
            <Button
              size="sm"
              onClick={handleJoinWaitlist}
              className={`bg-foreground hover:bg-foreground/90 text-background rounded-full transition-all duration-500 ${isScrolled ? "px-4 h-8 text-xs" : "px-6"}`}
            >
              Join waitlist
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu - Full Screen Overlay */}
      <div
        className={`md:hidden fixed inset-0 bg-background z-40 transition-all duration-500 ${
          isMobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        style={{ top: 0 }}
      >
        <div className="flex flex-col h-full px-8 pt-28 pb-8">
          <div className="flex-1 flex flex-col justify-center gap-8">
            {navLinks.map((link, i) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-5xl font-display text-foreground hover:text-muted-foreground transition-all duration-500 ${
                  isMobileMenuOpen
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: isMobileMenuOpen ? `${i * 75}ms` : "0ms" }}
              >
                {link.name}
              </a>
            ))}
          </div>

          <div
            className={`flex gap-4 pt-8 border-t border-foreground/10 transition-all duration-500 ${
              isMobileMenuOpen
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: isMobileMenuOpen ? "300ms" : "0ms" }}
          >
            <Button
              className="flex-1 bg-foreground text-background rounded-full h-14 text-base"
              onClick={() => { setIsMobileMenuOpen(false); handleJoinWaitlist(); }}
            >
              Join waitlist
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add components/landing/navigation.tsx
git commit -m "feat: update navigation - remove modal, comment out sign in, use OAuth"
```

---

## Task 10: Wire waitlisted state through page → sections

**Files:**
- Modify: `app/page.tsx`
- Modify: `components/landing/hero-section.tsx`
- Modify: `components/landing/pricing-section.tsx`

`app/page.tsx` is a server component and receives `searchParams` as a prop in Next.js App Router. We read `?waitlisted=true` there and pass it down.

- [ ] **Step 1: Update app/page.tsx**

Replace the full contents of `app/page.tsx`:

```tsx
import { Navigation } from "@/components/landing/navigation";
import { HeroSection } from "@/components/landing/hero-section";
import { PricingSection } from "@/components/landing/pricing-section";
import { FooterSection } from "@/components/landing/footer-section";

interface HomeProps {
  searchParams: Promise<{ waitlisted?: string; error?: string }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const waitlisted = params.waitlisted === "true";

  return (
    <main className="relative min-h-screen overflow-x-hidden noise-overlay">
      <Navigation />
      <HeroSection waitlisted={waitlisted} />
      <PricingSection waitlisted={waitlisted} />
      <FooterSection />
    </main>
  );
}
```

- [ ] **Step 2: Update hero-section.tsx**

Replace the full contents of `components/landing/hero-section.tsx`:

```tsx
"use client";

import { useEffect, useState } from "react";
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
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
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

      <div className="relative z-10 max-w-350 mx-auto px-6 lg:px-12 py-32 lg:py-40">
        <div
          className={`mb-8 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground">
            <span className="w-8 h-px bg-foreground/30" />
            Work in progress — coming soon
          </span>
        </div>

        <div className="mb-12">
          <h1
            className={`text-[clamp(3rem,12vw,10rem)] font-display leading-[0.9] tracking-tight transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
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

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-end">
          <p
            className={`text-xl lg:text-2xl text-muted-foreground leading-relaxed max-w-xl transition-all duration-700 delay-200 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            Use SimpleListr to research, write, and list infinite listings
            automatically. List infinitely. Scale infinitely.
          </p>

          <div
            className={`flex items-start transition-all duration-700 delay-300 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <WaitlistButton variant="light" waitlisted={waitlisted} />
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Update pricing-section.tsx**

In `components/landing/pricing-section.tsx`, update the component signature and the `WaitlistButton` usage:

Replace line 58:
```tsx
export function PricingSection() {
```
With:
```tsx
interface PricingSectionProps {
  waitlisted?: boolean;
}

export function PricingSection({ waitlisted = false }: PricingSectionProps) {
```

Replace line 110:
```tsx
              <WaitlistButton variant="dark" />
```
With:
```tsx
              <WaitlistButton variant="dark" waitlisted={waitlisted} />
```

- [ ] **Step 4: Commit**

```bash
git add app/page.tsx components/landing/hero-section.tsx components/landing/pricing-section.tsx
git commit -m "feat: wire waitlisted search param through page to section CTAs"
```

---

## Task 11: Smoke test the full flow

- [ ] **Step 1: Verify env vars are set**

Check `.env.local` has all five keys:
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
SUPABASE_SERVICE_ROLE_KEY
RESEND_API_KEY
RESEND_FROM_EMAIL
NEXT_PUBLIC_SITE_URL
```

- [ ] **Step 2: Run the dev server**

```bash
npm run dev
```

Expected: server starts at http://localhost:3000 with no TypeScript/import errors in the terminal.

- [ ] **Step 3: Test the happy path**

1. Open http://localhost:3000
2. Click "Join Waitlist" (hero or pricing or nav)
3. Google OAuth screen should open — sign in with your Google account
4. You should be redirected back to http://localhost:3000/?waitlisted=true
5. Both the hero and pricing CTAs should show "You're on the list ✓"

- [ ] **Step 4: Verify Supabase insert**

In Supabase dashboard → **Table Editor → waitlist**: confirm a row exists with your email and user_id.

- [ ] **Step 5: Verify Resend email (test mode)**

In Resend dashboard → **Emails**: you should see the sent email (it will only have delivered if the `to` address matches your Resend-verified email in test mode).

- [ ] **Step 6: Test duplicate prevention**

Sign out of the Google session (or open incognito), click Join Waitlist again with the same Google account. You should still be redirected to `/?waitlisted=true` — the 409 is handled silently.

- [ ] **Step 7: Final commit**

```bash
git add -A
git commit -m "feat: complete waitlist backend with Google OAuth, Supabase, and Resend"
```
