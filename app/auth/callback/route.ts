import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { addToWaitlist } from "@/lib/waitlist";

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

  if (!email) {
    return NextResponse.redirect(`${origin}/?error=true`);
  }

  const result = await addToWaitlist(email, userId);

  if ("alreadyOnList" in result) {
    return NextResponse.redirect(`${origin}/?waitlisted=true&already=true`);
  }
  if ("success" in result) {
    return NextResponse.redirect(`${origin}/?waitlisted=true`);
  }

  return NextResponse.redirect(`${origin}/?error=true`);
}
