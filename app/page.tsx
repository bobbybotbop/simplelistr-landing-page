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
