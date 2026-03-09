"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { type ComponentProps } from "react";

type NavLinkProps = ComponentProps<typeof Link> & {
  children: React.ReactNode;
};

export function NavLink({ href, children, className = "", ...props }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  const baseClasses = "text-sm font-medium transition-colors duration-200";
  const activeClasses = isActive
    ? "text-accent border-b-2 border-accent"
    : "text-text-secondary hover:text-text-primary";

  return (
    <Link
      href={href}
      className={`${baseClasses} ${activeClasses} ${className}`.trim()}
      aria-current={isActive ? "page" : undefined}
      {...props}
    >
      {children}
    </Link>
  );
}
