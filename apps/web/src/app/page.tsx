import { HeroSection } from "@/components/home/HeroSection";
import { Features } from "@/components/home/Features";
import { CTA } from "@/components/home/CTA";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <Features />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
