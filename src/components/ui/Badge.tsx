import React from 'react';
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'outline' | 'accent';
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider transition-colors",
          {
            "bg-[var(--color-brand-subtle)] text-[var(--color-accent)] border border-[var(--color-border-default)]": variant === 'default',
            "bg-transparent text-[var(--color-text-muted)] border border-[var(--color-border-default)]": variant === 'outline',
            "bg-[var(--color-accent)] text-[var(--color-bg-base)] border border-transparent": variant === 'accent',
          },
          className
        )}
        {...props}
      />
    );
  }
);
Badge.displayName = "Badge";
