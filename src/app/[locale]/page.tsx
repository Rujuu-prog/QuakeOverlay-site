import { setRequestLocale, getTranslations } from "next-intl/server";
import { Hero } from "@/components/sections/Hero";
import { Features } from "@/components/sections/Features";
import { Demo } from "@/components/sections/Demo";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Reviews } from "@/components/sections/Reviews";
import { CtaSection } from "@/components/sections/CtaSection";
import { SeismicDivider } from "@/components/ui/SeismicDivider";
import { EXTERNAL_LINKS } from "@/constants/site";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("site");

  // TODO: Fetch reviews from Keystatic when content is available
  const reviews: { name: string; platform: string; content: string }[] = [];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "QuakeOverlay",
    description: t("description"),
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Windows",
    url: EXTERNAL_LINKS.booth,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <SeismicDivider />
      <Features />
      <SeismicDivider />
      <Demo />
      <SeismicDivider />
      <HowItWorks />
      <SeismicDivider />
      <Reviews reviews={reviews} />
      <CtaSection />
    </>
  );
}
