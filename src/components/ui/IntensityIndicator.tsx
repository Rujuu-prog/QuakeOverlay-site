import { INTENSITY_LEVELS, type IntensityLevel } from "@/constants/intensity";

type IntensityIndicatorProps = {
  level: IntensityLevel;
  showLabel?: boolean;
};

export function IntensityIndicator({
  level,
  showLabel = false,
}: IntensityIndicatorProps) {
  const config = INTENSITY_LEVELS.find((l) => l.level === level);

  return (
    <div className="inline-flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {INTENSITY_LEVELS.map((intensityConfig) => {
          const isActive = intensityConfig.level <= level;
          return (
            <span
              key={intensityConfig.level}
              data-dot
              data-active={isActive}
              className="size-2 rounded-full"
              style={{
                backgroundColor: isActive
                  ? intensityConfig.color
                  : "var(--color-bg-tertiary)",
              }}
            />
          );
        })}
      </div>
      {showLabel && config && (
        <span className="text-xs text-text-secondary">{config.label}</span>
      )}
    </div>
  );
}
