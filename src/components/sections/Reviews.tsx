"use client";

import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/Card";
import { Quote } from "lucide-react";

type Review = {
  name: string;
  platform: string;
  content: string;
};

type ReviewsProps = {
  reviews: Review[];
};

export function Reviews({ reviews }: ReviewsProps) {
  const t = useTranslations("home.reviews");

  return (
    <section className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2
            className="text-text-primary font-bold"
            style={{ fontSize: "var(--text-h2)" }}
          >
            {t("title")}
          </h2>
          <p className="mt-4 text-text-secondary" style={{ fontSize: "var(--text-body)" }}>
            {t("subtitle")}
          </p>
        </div>

        {reviews.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-text-muted" style={{ fontSize: "var(--text-body)" }}>
              {t("empty")}
            </p>
          </div>
        ) : (
          <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory">
            {reviews.map((review, index) => (
              <Card
                key={index}
                hover
                className="min-w-[300px] max-w-[360px] flex-shrink-0 snap-start"
              >
                <div className="flex flex-col gap-4">
                  <Quote size={24} className="text-accent opacity-50" aria-hidden="true" />
                  <p className="text-text-primary" style={{ fontSize: "var(--text-body)" }}>
                    {review.content}
                  </p>
                  <div className="mt-auto pt-4 border-t border-border-default">
                    <p className="text-text-primary font-medium">{review.name}</p>
                    <p className="text-text-muted text-sm">{review.platform}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
