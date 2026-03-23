import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { SkipToContent } from "@/components/layout/SkipToContent";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import type { Metadata } from "next";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const messages = (await import(`../../../messages/${locale}.json`)).default;

  const baseUrl = "https://quakeoverlay.com";

  return {
    title: {
      default: messages.site.title,
      template: `%s | ${messages.site.title}`,
    },
    description: messages.site.description,
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: {
        ja: `${baseUrl}/ja`,
        en: `${baseUrl}/en`,
        ko: `${baseUrl}/ko`,
      },
    },
    openGraph: {
      title: messages.site.title,
      description: messages.site.description,
      locale: locale,
      type: "website",
      siteName: messages.site.title,
      url: `${baseUrl}/${locale}`,
    },
    twitter: {
      card: "summary_large_image",
      title: messages.site.title,
      description: messages.site.description,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <div className="app-layout">
      <NextIntlClientProvider messages={messages}>
        <SkipToContent />
        <Header />
        <main id="main-content">{children}</main>
        <Footer />
      </NextIntlClientProvider>
    </div>
  );
}
