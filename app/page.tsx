import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Download } from "@/components/Download";
import { Faq } from "@/components/Faq";
import { Footer } from "@/components/Footer";

export const revalidate = 1800;

export default function Page() {
  return (
    <>
      <div className="backdrop" aria-hidden>
        <span className="bloom" />
        <span className="grain" />
      </div>

      <Header />
      <main id="main">
        <Hero />
        <Features />
        <Download />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
