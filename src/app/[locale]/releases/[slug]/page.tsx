import { setRequestLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/docs/Breadcrumb";
import { DocRenderer } from "@/components/docs/DocRenderer";
import { ReleaseDetailContent } from "@/components/releases/ReleaseDetailContent";
import { getReleases, getReleaseBySlug } from "@/lib/releases";
import { routing } from "@/i18n/routing";
import type { Metadata } from "next";

export async function generateStaticParams() {
  const releases = await getReleases();

  return routing.locales.flatMap((locale) =>
    releases.map((release) => ({ locale, slug: release.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const release = await getReleaseBySlug(slug);

  if (!release) return {};

  return {
    title: `${release.version} - Release Notes`,
    description: release.summary,
  };
}

export default async function ReleaseDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const release = await getReleaseBySlug(slug);
  if (!release) {
    notFound();
  }

  const t = await getTranslations("releases");

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Breadcrumb
        items={[
          { label: t("breadcrumb.home"), href: "/" },
          { label: t("breadcrumb.releases"), href: "/releases" },
          { label: release.version },
        ]}
      />

      <div className="mt-6">
        <ReleaseDetailContent
          release={{
            slug: release.slug,
            version: release.version,
            date: release.date,
            summary: release.summary,
            changes: release.changes,
            knownIssues: release.knownIssues,
          }}
        >
          {release.content && (
            <DocRenderer document={release.content as Parameters<typeof DocRenderer>[0]["document"]} />
          )}
        </ReleaseDetailContent>
      </div>
    </div>
  );
}
