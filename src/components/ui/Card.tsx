import React from 'react';
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, hoverEffect = true, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "card",
          !hoverEffect && "hover:border-[var(--color-border-default)] hover:shadow-none hover:translate-y-0",
          className
        )}
        {...props}
      />
    );
  }
);
Card.displayName = "Card";
