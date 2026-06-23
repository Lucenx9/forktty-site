import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ArrowRight, GitHubIcon } from "@/components/Icons";
import { RELEASES_HTML_URL, REPO_HTML_URL } from "@/lib/github";
import { getSeoPage, SEO_PAGES, SEO_PAGE_SLUGS } from "@/lib/seo-pages";
import { SITE_URL } from "@/lib/site";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return SEO_PAGE_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getSeoPage(slug);
  if (!page) return {};

  return {
    title: page.title,
    description: page.description,
    keywords: ["ForkTTY", ...page.keywords],
    alternates: {
      canonical: `/${page.slug}`,
    },
    openGraph: {
      title: `${page.title} - ForkTTY`,
      description: page.description,
      url: `${SITE_URL}/${page.slug}`,
      siteName: "ForkTTY",
      type: "article",
      images: [
        {
          url: "/og.png",
          width: 1200,
          height: 630,
          alt: `${page.title} - ForkTTY`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${page.title} - ForkTTY`,
      description: page.description,
      images: ["/og.png"],
    },
  };
}

export default async function SeoIntentPage({ params }: PageProps) {
  const { slug } = await params;
  const page = getSeoPage(slug);
  if (!page) notFound();

  const related = page.related
    .map((relatedSlug) => {
      if (relatedSlug === "docs") {
        return { label: "Docs", href: "/docs" };
      }
      const relatedPage = getSeoPage(relatedSlug);
      return relatedPage
        ? { label: relatedPage.navLabel, href: `/${relatedPage.slug}` }
        : null;
    })
    .filter((item): item is { label: string; href: string } => item !== null);

  const pageUrl = `${SITE_URL}/${page.slug}`;
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: `${page.title} - ForkTTY`,
      url: pageUrl,
      inLanguage: "en",
      description: page.description,
      isPartOf: {
        "@type": "WebSite",
        name: "ForkTTY",
        url: SITE_URL,
      },
      about: {
        "@type": "SoftwareApplication",
        name: "ForkTTY",
        applicationCategory: "DeveloperApplication",
        operatingSystem: "Linux",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: page.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "ForkTTY",
          item: SITE_URL,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: page.navLabel,
          item: pageUrl,
        },
      ],
    },
  ];

  return (
    <>
      <div className="backdrop" aria-hidden>
        <span className="bloom" />
        <span className="grain" />
      </div>
      <Header />
      <main id="main">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <section className="section py-16 sm:py-20">
          <div className="max-w-4xl">
            <div className="font-mono text-xs uppercase tracking-[0.16em] text-forktty">
              {page.eyebrow}
            </div>
            <h1 className="mt-5 font-display text-[2.65rem] font-semibold leading-[0.98] text-ink-100 sm:text-[4.6rem]">
              {page.h1}
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-relaxed text-ink-300 sm:text-lg">
              {page.intro}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/#download" className="btn-primary">
                Download for Linux
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={REPO_HTML_URL}
                target="_blank"
                rel="noreferrer noopener"
                className="btn-secondary"
              >
                <GitHubIcon className="h-4 w-4" />
                Source repository
              </a>
            </div>
          </div>
        </section>

        <section className="border-t border-ink-800/60">
          <div className="section grid gap-10 py-12 sm:py-16 lg:grid-cols-[16rem_minmax(0,1fr)] lg:items-start">
            <aside className="lg:sticky lg:top-20">
              <nav aria-label={`${page.navLabel} page sections`} className="tui-frame p-4">
                <div className="mb-3 font-mono text-xs uppercase tracking-[0.16em] text-ink-500">
                  On this page
                </div>
                <ol className="space-y-1">
                  {page.sections.map((section) => (
                    <li key={section.title}>
                      <a
                        href={`#${anchor(section.title)}`}
                        className="block border-l border-ink-800 px-3 py-1.5 text-sm leading-snug text-ink-300 transition-colors hover:border-forktty hover:text-forktty"
                      >
                        {section.title}
                      </a>
                    </li>
                  ))}
                  <li>
                    <a
                      href="#questions"
                      className="block border-l border-ink-800 px-3 py-1.5 text-sm leading-snug text-ink-300 transition-colors hover:border-forktty hover:text-forktty"
                    >
                      Questions
                    </a>
                  </li>
                </ol>
              </nav>
            </aside>

            <article className="min-w-0 space-y-10">
              {page.sections.map((section) => (
                <section
                  key={section.title}
                  id={anchor(section.title)}
                  className="scroll-mt-24 border-t border-ink-800/70 pt-10 first:border-t-0 first:pt-0"
                >
                  <div className="max-w-3xl">
                    <h2 className="font-display text-3xl font-semibold leading-tight text-ink-100 sm:text-4xl">
                      {section.title}
                    </h2>
                    <p className="mt-4 text-[15px] leading-relaxed text-ink-300">
                      {section.body}
                    </p>
                  </div>
                  {section.bullets && (
                    <ul className="mt-5 max-w-3xl space-y-2 text-[15px] leading-relaxed text-ink-300">
                      {section.bullets.map((bullet) => (
                        <li key={bullet} className="flex gap-3">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-forktty" aria-hidden />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}

              <section
                id="questions"
                className="scroll-mt-24 border-t border-ink-800/70 pt-10"
              >
                <div className="max-w-3xl">
                  <h2 className="font-display text-3xl font-semibold leading-tight text-ink-100 sm:text-4xl">
                    Questions
                  </h2>
                </div>
                <div className="mt-6 divide-y divide-ink-800 overflow-hidden border border-ink-800">
                  {page.faqs.map((faq) => (
                    <details key={faq.question} className="group bg-ink-900">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-6 px-6 py-5 text-base text-ink-100 transition-colors hover:bg-ink-850">
                        <span className="font-mono text-[15px] font-medium">{faq.question}</span>
                        <span className="text-ink-500 transition-transform group-open:rotate-90" aria-hidden>
                          ❯
                        </span>
                      </summary>
                      <div className="px-6 pb-6 text-sm leading-relaxed text-ink-300">
                        {faq.answer}
                      </div>
                    </details>
                  ))}
                </div>
              </section>

              <section className="scroll-mt-24 border-t border-ink-800/70 pt-10">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="tui-frame p-6">
                    <h2 className="font-mono text-base font-medium text-ink-100">
                      Explore related ForkTTY pages
                    </h2>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {related.map((item) => (
                        <Link key={item.href} href={item.href} className="chip hover:border-forktty/70 hover:text-forktty">
                          {item.label}
                        </Link>
                      ))}
                      <Link href="/docs" className="chip hover:border-forktty/70 hover:text-forktty">
                        Docs
                      </Link>
                    </div>
                  </div>
                  <div className="tui-frame p-6">
                    <h2 className="font-mono text-base font-medium text-ink-100">
                      Get the alpha build
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-ink-300">
                      AppImage and .deb packages are published on GitHub Releases for Linux x86_64.
                    </p>
                    <a
                      href={RELEASES_HTML_URL}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="mt-4 inline-flex items-center gap-1.5 text-sm text-ink-200 underline-offset-4 hover:text-forktty hover:underline"
                    >
                      View releases
                      <ArrowRight className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              </section>
            </article>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function anchor(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
