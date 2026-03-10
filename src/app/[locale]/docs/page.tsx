import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getDocsByLocale, groupDocsByCategory } from "@/lib/docs";
import { DOC_CATEGORIES } from "@/constants/docs";
import { Card } from "@/components/ui/Card";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "docs" });

  return {
    title: t("title"),
  };
}

export default async function DocsIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("docs");

  const docs = await getDocsByLocale(locale);
  const categories = groupDocsByCategory(docs);

  return (
    <div>
      <h1
        className="mb-8 font-heading"
        style={{ fontSize: "var(--text-h1)" }}
      >
        {t("title")}
      </h1>

      {categories.length === 0 ? (
        <p className="text-text-secondary">{t("noResults")}</p>
      ) : (
        <div className="space-y-10">
          {categories.map((cat) => {
            const catDef = DOC_CATEGORIES.find((c) => c.key === cat.category);
            const Icon = catDef?.icon;

            return (
              <section key={cat.category}>
                <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-text-primary">
                  {Icon && <Icon className="size-5 text-accent" />}
                  {t(`categories.${cat.category}`)}
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {cat.items.map((doc) => (
                    <Link key={doc.slug} href={`/docs/${doc.slug}`}>
                      <Card className="h-full">
                        <h3 className="font-medium text-text-primary">
                          {doc.title}
                        </h3>
                        {doc.description && (
                          <p className="mt-1 text-sm text-text-secondary line-clamp-2">
                            {doc.description}
                          </p>
                        )}
                      </Card>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
