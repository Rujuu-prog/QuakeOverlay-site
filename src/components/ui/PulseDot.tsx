type PulseDotColor = "success" | "warning" | "danger" | "accent";

type PulseDotProps = {
  color?: PulseDotColor;
  label?: string;
};

const colorStyles: Record<PulseDotColor, string> = {
  success: "var(--color-status-success)",
  warning: "var(--color-status-warning)",
  danger: "var(--color-status-danger)",
  accent: "var(--color-accent)",
};

export function PulseDot({ color = "success", label }: PulseDotProps) {
  return (
    <span
      role="status"
      aria-label={label}
      className="pulse-dot inline-block size-1.5 rounded-full"
      data-color={color}
      style={{ backgroundColor: colorStyles[color] }}
    />
  );
}
