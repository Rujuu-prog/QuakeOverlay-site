import { LOADING_ANIMATION } from "@/constants/animation";

type SeismicPulseProps = {
  size?: number;
};

export function SeismicPulse({ size = 120 }: SeismicPulseProps) {
  const center = size / 2;
  const maxRadius = size * 0.4;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      aria-hidden="true"
    >
      {Array.from({ length: LOADING_ANIMATION.rippleCount }).map((_, i) => (
        <circle
          key={i}
          cx={center}
          cy={center}
          r={maxRadius}
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth={1.5}
          opacity={0}
          className="epicenter-ripple"
          style={{
            animationDelay: `${i * LOADING_ANIMATION.rippleStaggerDelay}s`,
            animationDuration: LOADING_ANIMATION.rippleDuration,
          }}
        />
      ))}
      <circle
        cx={center}
        cy={center}
        r={4}
        fill="var(--color-accent)"
        className="epicenter-dot-pulse"
        style={{ animationDuration: LOADING_ANIMATION.dotPulseDuration }}
      />
    </svg>
  );
}
