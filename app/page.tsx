import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Screenshot } from "@/components/Screenshot";
import { Download } from "@/components/Download";
import { Why } from "@/components/Why";
import { Capabilities } from "@/components/Capabilities";
import { AlphaNotes } from "@/components/AlphaNotes";
import { Faq } from "@/components/Faq";
import { Footer } from "@/components/Footer";
import { StatusLine } from "@/components/StatusLine";

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
        <Screenshot />
        <Download />
        <Why />
        <Capabilities />
        <AlphaNotes />
        <Faq />
      </main>
      <Footer />

      <StatusLine />
    </>
  );
}
