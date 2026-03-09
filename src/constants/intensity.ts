export type IntensityLevel = 1 | 2 | 3 | 4 | 5;

export interface IntensityConfig {
  level: IntensityLevel;
  label: string;
  color: string;
}

export const INTENSITY_LEVELS: IntensityConfig[] = [
  { level: 1, label: "1", color: "var(--color-status-info)" },
  { level: 2, label: "2", color: "var(--color-status-success)" },
  { level: 3, label: "3", color: "var(--color-status-warning)" },
  { level: 4, label: "4", color: "var(--color-status-danger)" },
  { level: 5, label: "5+", color: "var(--color-status-danger)" },
];
