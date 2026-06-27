# Waitlist Backend Design

**Date:** 2026-06-27
**Status:** Approved

## Overview

Wire up the SimpleListr waitlist so signups are persisted in Supabase and a confirmation email is sent via Resend. Authentication is handled entirely through Google OAuth (Supabase Auth) — the email input form is removed. This change also acts as the primary abuse-prevention mechanism: one Google account = one signup.

## Goals

- Persist waitlist signups durably in a Supabase-owned database
- Prevent duplicate signups via unique constraints on both `email` and `user_id`
- Send an instant confirmation email via Resend on successful signup
- Replace the email input UI with a Google OAuth flow
- Comment out the "Sign in" nav button (it's a placeholder; real auth is out of scope)

## Out of Scope

- A full sign-in / authenticated session experience
- Admin dashboard for viewing signups
- Launch broadcast / Resend Audiences setup (done manually at launch time)
- Custom send domain (deferred until domain is acquired; test mode uses `onboarding@resend.dev`)

## Architecture

```
User clicks "Join Waitlist"
  └── supabase.auth.signInWithOAuth({ provider: 'google' })
        └── Redirects to Google → user approves → redirects back to /
              └── /auth/callback route (server)
                    ├── Exchanges OAuth code for session
                    ├── POST /api/waitlist (reads session server-side)
                    │     ├── Extracts email + user_id from auth session
                    │     ├── Supabase INSERT into waitlist
                    │     │     unique on (email, user_id) → 409 if duplicate
                    │     └── Resend: send confirmation email (non-blocking)
                    └── Redirects to /?waitlisted=true
                          └── Landing page reads param → shows success state
```

## Database

Table: `waitlist`

| Column | Type | Constraints |
|---|---|---|
| `id` | `uuid` | PK, default `gen_random_uuid()` |
| `email` | `text` | NOT NULL, UNIQUE |
| `user_id` | `uuid` | NOT NULL, UNIQUE, FK → `auth.users.id` |
| `created_at` | `timestamptz` | NOT NULL, default `now()` |

No RLS required — all writes go through the server-side service-role key.

## API Route: POST /api/waitlist

Called internally from `/auth/callback` after a successful OAuth exchange.

| Scenario | Status | Behavior |
|---|---|---|
| New signup | `200` | Insert row, send Resend confirmation email |
| Duplicate email or user_id | `409` | Silent — redirect to `/?waitlisted=true` anyway |
| No active session | `401` | Redirect to `/` |
| Server error | `500` | Redirect to `/?error=true` |

Resend send is **non-blocking** — if it fails, the signup is still saved and the user sees success. Error logged server-side only.

## Email: Confirmation (Resend)

- **From:** `onboarding@resend.dev` (test mode until custom domain added)
- **To:** User's Google account email
- **Subject:** `You're on the SimpleListr waitlist`
- **Body:** Simple confirmation with their email address and a note they'll hear from us at launch
- **Template:** React Email component at `emails/waitlist-confirmation.tsx`

In test mode: email only delivers to the Resend account's verified address. Real signups are saved to Supabase correctly regardless.

## New Files

- `app/auth/callback/route.ts` — OAuth code exchange + calls waitlist API + redirect
- `app/api/waitlist/route.ts` — server route: reads session, inserts to Supabase, fires Resend
- `lib/supabase/server.ts` — server-side Supabase client (service-role key)
- `lib/resend.ts` — Resend client instance
- `emails/waitlist-confirmation.tsx` — React Email confirmation template

## Modified Files

- `components/landing/waitlist-button.tsx` — replace email input with "Continue with Google" button calling `signInWithOAuth`
- `components/landing/waitlist-modal.tsx` — simplify to a single Google sign-in button (or remove if modal is unnecessary)
- `components/landing/navigation.tsx` — comment out the "Sign in" anchor
- `components/landing/hero-section.tsx` — verify `WaitlistButton` usage is unchanged
- `app/page.tsx` — read `?waitlisted=true` search param, pass success state down to hero/pricing

## Environment Variables

Add to `.env.local`:

```
SUPABASE_SERVICE_ROLE_KEY=        # Supabase dashboard → Settings → API → service_role secret
RESEND_API_KEY=                   # resend.com → API Keys → Create API Key (Full access)
RESEND_FROM_EMAIL=onboarding@resend.dev
NEXT_PUBLIC_SITE_URL=http://localhost:3000   # change to deployed URL in production
```

Already present (no change needed):
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

## New Dependencies

- `resend` — Resend Node SDK
- `@react-email/components` — React Email primitives for the confirmation template

## Security Notes

- Service-role key is server-only; never exposed to client bundles
- Resend API key is server-only
- Abuse prevention: unique `user_id` FK means one Google account = one waitlist entry, regardless of how many times the OAuth flow is triggered
- No rate limiting needed at this scale; revisit if the page goes viral
