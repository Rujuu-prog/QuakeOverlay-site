import { type ComponentProps } from "react";

type CardProps = ComponentProps<"div"> & {
  hover?: boolean;
};

export function Card({
  hover = true,
  className = "",
  children,
  ...props
}: CardProps) {
  const baseClasses =
    "bg-bg-card border border-border-default rounded-xl p-6";
  const hoverClasses = hover ? "card-hover" : "";
  const classes = `${baseClasses} ${hoverClasses} ${className}`.trim();

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
}
