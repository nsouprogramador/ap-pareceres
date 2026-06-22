/**
 * app/page.tsx
 * Landing page: hero + recursos + FAQ. Server Component que compõe seções;
 * o banner de status é client e fica em Suspense por usar useSearchParams.
 */
import { Suspense } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { Features } from "@/components/features";
import { Faq } from "@/components/faq";
import { StatusBanner } from "@/components/status-banner";

export default function HomePage() {
  return (
    <>
      <Suspense fallback={null}>
        <StatusBanner />
      </Suspense>
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
