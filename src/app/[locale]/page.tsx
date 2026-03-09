import { getTranslations, setRequestLocale } from "next-intl/server";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <h1
        className="text-text-primary font-bold"
        style={{ fontSize: "var(--text-hero)" }}
      >
        {t("heroTitle")}
      </h1>
      <p
        className="mt-4 text-text-secondary"
        style={{ fontSize: "var(--text-h3)" }}
      >
        {t("heroSubtitle")}
      </p>
      <div className="mt-8 flex gap-4">
        <a
          href="#"
          className="rounded-lg bg-accent px-6 py-3 font-medium text-text-inverse transition-colors hover:bg-accent-hover"
        >
          {t("ctaDownload")}
        </a>
        <a
          href="#"
          className="rounded-lg border border-border-accent px-6 py-3 font-medium text-accent transition-colors hover:bg-accent-glow"
        >
          {t("ctaDocs")}
        </a>
      </div>
    </main>
  );
}
