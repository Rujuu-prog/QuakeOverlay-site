import { LOADING_ANIMATION } from "@/constants/animation";

export function SeismicWaveLine() {
  // Seismograph-style waveform path
  const d =
    "M0,25 L60,25 L70,10 L80,40 L90,5 L100,45 L110,15 L120,35 L130,20 L140,30 L150,25 L200,25 L210,18 L220,32 L230,12 L240,38 L250,8 L260,42 L270,22 L280,28 L290,25 L350,25";

  return (
    <svg
      width="350"
      height="50"
      viewBox="0 0 350 50"
      aria-hidden="true"
      className="max-w-full"
    >
      {/* Background baseline */}
      <line
        x1="0"
        y1="25"
        x2="350"
        y2="25"
        stroke="var(--color-bg-tertiary)"
        strokeWidth={1}
      />
      {/* Animated waveform */}
      <path
        d={d}
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="800"
        strokeDashoffset="800"
        className="seismograph-draw"
        style={{ animationDuration: LOADING_ANIMATION.seismographDuration }}
      />
    </svg>
  );
}
