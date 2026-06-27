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
  const authError = params.error === "true";

  return (
    <main className="relative min-h-screen overflow-x-hidden noise-overlay">
      <Navigation />
      {authError && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-destructive text-destructive-foreground rounded-full text-sm font-medium shadow-lg">
          Something went wrong. Please try again.
        </div>
      )}
      <HeroSection waitlisted={waitlisted} />
      <PricingSection waitlisted={waitlisted} />
      <FooterSection />
    </main>
  );
}
