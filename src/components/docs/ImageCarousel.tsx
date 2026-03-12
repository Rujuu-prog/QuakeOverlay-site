"use client";

import { useState, useEffect, useCallback } from "react";

type ImageCarouselProps = {
  images: string[];
  captions?: string[];
  interval?: number;
};

export function ImageCarousel({
  images,
  captions = [],
  interval = 4000,
}: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(goToNext, interval);
    return () => clearInterval(timer);
  }, [isPaused, interval, goToNext]);

  return (
    <div
      data-testid="image-carousel"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative rounded-xl border border-border-accent overflow-hidden bg-bg-secondary">
        <img
          src={images[currentIndex]}
          alt={captions[currentIndex] ?? ""}
          loading="lazy"
          decoding="async"
          className="w-full h-auto"
        />
      </div>

      {captions[currentIndex] && (
        <p
          className="mt-2 text-center text-text-secondary"
          style={{ fontSize: "var(--text-small)" }}
        >
          {captions[currentIndex]}
        </p>
      )}

      <div className="flex justify-center gap-2 mt-3">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2.5 h-2.5 rounded-full transition-colors ${
              index === currentIndex
                ? "bg-accent"
                : "bg-text-muted hover:bg-text-secondary"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
