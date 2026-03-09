type SeismicDividerProps = {
  animated?: boolean;
  opacity?: number;
};

export function SeismicDivider({
  animated = true,
  opacity = 0.3,
}: SeismicDividerProps) {
  const path =
    "M0,20 Q25,5 50,20 T100,20 T150,20 T200,20 T250,20 T300,20 T350,20 T400,20 T450,20 T500,20 T550,20 T600,20 T650,20 T700,20 T750,20 T800,20";

  return (
    <div role="separator" className="w-full overflow-hidden" style={{ opacity }}>
      <div className={animated ? "seismic-flow" : ""}>
        <svg
          viewBox="0 0 800 40"
          preserveAspectRatio="none"
          className="w-[200%] h-6"
          aria-hidden="true"
        >
          <path
            d={path}
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth="1.5"
          />
        </svg>
      </div>
    </div>
  );
}
