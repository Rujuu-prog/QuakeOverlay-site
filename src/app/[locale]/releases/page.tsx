import { setRequestLocale, getTranslations } from "next-intl/server";
import { Breadcrumb } from "@/components/docs/Breadcrumb";
import { ReleasesPageContent } from "@/components/releases/ReleasesPageContent";
import { getReleases, getRoadmapByLocale } from "@/lib/releases";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "releases" });

  return {
    title: t("title"),
  };
}

export default async function ReleasesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("releases");

  const [releases, roadmapItems] = await Promise.all([
    getReleases(),
    getRoadmapByLocale(locale),
  ]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Breadcrumb
        items={[
          { label: t("breadcrumb.home"), href: "/" },
          { label: t("breadcrumb.releases") },
        ]}
      />

      <h1
        className="mt-6 mb-2 font-heading"
        style={{ fontSize: "var(--text-h1)" }}
      >
        {t("title")}
      </h1>
      <p className="mb-8 text-text-secondary">{t("subtitle")}</p>

      <ReleasesPageContent releases={releases} roadmapItems={roadmapItems} />
    </div>
  );
}
