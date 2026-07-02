import { Navigation } from "@/components/landing/navigation";
import { HeroSection } from "@/components/landing/hero-section";
import { PricingSection } from "@/components/landing/pricing-section";
import { FooterSection } from "@/components/landing/footer-section";
import { WaitlistConfirmationTrigger } from "@/components/landing/waitlist-confirmation-trigger";

interface HomeProps {
  searchParams: Promise<{ waitlisted?: string; already?: string; error?: string }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const waitlisted = params.waitlisted === "true";
  const alreadyOnList = params.already === "true";
  const authError = params.error === "true";

  return (
    <main className="relative min-h-screen overflow-x-hidden noise-overlay">
      <Navigation waitlisted={waitlisted} />
      {authError && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-destructive text-white rounded-full text-sm font-medium shadow-lg">
          Something went wrong. Please try again.
        </div>
      )}
      <HeroSection waitlisted={waitlisted} />
      <PricingSection waitlisted={waitlisted} />
      <FooterSection />
      <WaitlistConfirmationTrigger waitlisted={waitlisted} alreadyOnList={alreadyOnList} />
    </main>
  );
}
