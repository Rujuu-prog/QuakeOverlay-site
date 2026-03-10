import { setRequestLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import {
  getDocsByLocale,
  getDocBySlug,
  extractTocFromDocument,
  sortDocs,
  getAdjacentDocs,
} from "@/lib/docs";
import { routing } from "@/i18n/routing";
import { Breadcrumb } from "@/components/docs/Breadcrumb";
import { DocRenderer } from "@/components/docs/DocRenderer";
import { DocNavigation } from "@/components/docs/DocNavigation";
import { TableOfContents } from "@/components/docs/TableOfContents";
import type { Metadata } from "next";

export async function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];

  for (const locale of routing.locales) {
    const docs = await getDocsByLocale(locale);
    for (const doc of docs) {
      params.push({ locale, slug: doc.slug });
    }
  }

  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const doc = await getDocBySlug(slug);

  if (!doc) return {};

  return {
    title: doc.title,
    description: doc.description,
  };
}

export default async function DocPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const doc = await getDocBySlug(slug);
  if (!doc || doc.locale !== locale) {
    notFound();
  }

  const t = await getTranslations("docs");

  const allDocs = await getDocsByLocale(locale);
  const sorted = sortDocs(allDocs);
  const { prev, next } = getAdjacentDocs(slug, sorted);

  const tocItems = extractTocFromDocument(
    doc.content as unknown as Record<string, unknown>
  );

  const isFaq = doc.category === "faq";

  return (
    <>
      {isFaq && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: tocItems.map((item) => ({
                "@type": "Question",
                name: item.text,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: item.text,
                },
              })),
            }),
          }}
        />
      )}

      <div className="flex gap-8">
        <article className="min-w-0 flex-1">
          <Breadcrumb
            items={[
              { label: t("breadcrumb.home"), href: "/" },
              { label: t("breadcrumb.docs"), href: "/docs" },
              { label: doc.title },
            ]}
          />

          <h1
            className="mt-6 mb-8 font-heading"
            style={{ fontSize: "var(--text-h1)" }}
          >
            {doc.title}
          </h1>

          <DocRenderer document={doc.content} />

          <DocNavigation prev={prev} next={next} />
        </article>

        {/* Table of Contents - desktop only */}
        {tocItems.length > 0 && (
          <div className="hidden w-56 shrink-0 xl:block">
            <div className="sticky top-20">
              <TableOfContents items={tocItems} />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
