import { cn } from "@/lib/utils";
import { Badge } from "./Badge";
import AnimatedSection from "../AnimatedSection";

interface SectionHeaderProps {
  badge?: string;
  title: string;
  description?: string;
  className?: string;
  align?: 'left' | 'center';
}

export const SectionHeader = ({
  badge,
  title,
  description,
  className,
  align = 'center',
}: SectionHeaderProps) => {
  return (
    <AnimatedSection 
      className={cn(
        "flex flex-col gap-4 mb-12",
        align === 'center' ? "items-center text-center" : "items-start text-left",
        className
      )}
    >
      {badge && <Badge>{badge}</Badge>}
      <h2 className="text-section-heading">{title}</h2>
      {description && (
        <p className="text-[var(--color-text-secondary)] max-w-2xl text-lg">
          {description}
        </p>
      )}
    </AnimatedSection>
  );
};
