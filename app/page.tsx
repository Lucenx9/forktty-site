import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Screenshot } from "@/components/Screenshot";
import { Download } from "@/components/Download";
import { Why } from "@/components/Why";
import { Workflows } from "@/components/Workflows";
import { Install } from "@/components/Install";
import { AlphaNotes } from "@/components/AlphaNotes";
import { Faq } from "@/components/Faq";
import { Footer } from "@/components/Footer";

export const revalidate = 1800;

export default function Page() {
  return (
    <>
      <Header />
      <main id="main">
        <Hero />
        <Screenshot />
        <Download />
        <Why />
        <Workflows />
        <Install />
        <AlphaNotes />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
