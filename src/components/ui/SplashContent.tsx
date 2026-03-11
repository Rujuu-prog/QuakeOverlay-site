import { Activity } from "lucide-react";
import { SPLASH_CONTENT } from "@/constants/animation";

export function SplashContent() {
  return (
    <div
      data-testid="splash-content"
      aria-hidden="true"
      className="flex items-center justify-center"
    >
      <div className="splash-icon-wrapper">
        <Activity size={SPLASH_CONTENT.iconSize} className="splash-icon" />
        {Array.from({ length: SPLASH_CONTENT.rippleCount }, (_, i) => (
          <div
            key={i}
            className="splash-ripple"
            style={{
              width: SPLASH_CONTENT.rippleSize,
              height: SPLASH_CONTENT.rippleSize,
              animationDelay: `${i * SPLASH_CONTENT.rippleStaggerDelay}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
