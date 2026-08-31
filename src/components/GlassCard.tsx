import type React from 'react';
import { cn } from '../lib/utils';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
  hover?: boolean;
  noPadding?: boolean;
}

export default function GlassCard({
  children,
  className,
  hover = true,
  noPadding = false,
  ...props
}: GlassCardProps) {
  return (
    <div
      className={cn(
        'rounded-3xl border border-white/20 bg-white/90 md:bg-white/70 md:backdrop-blur-md transition-all duration-300',
        !noPadding && 'p-6',
        hover && 'hover:border-white/40 hover:shadow-xl',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
