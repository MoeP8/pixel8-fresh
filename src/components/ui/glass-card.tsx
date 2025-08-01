import * as React from "react";
import { cn } from "@/lib/utils";

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "strong" | "subtle" | "gradient";
  size?: "sm" | "default" | "lg";
  hover?: boolean;
  glow?: boolean;
}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant = "default", size = "default", hover = true, glow = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          // Base glass styles
          "backdrop-blur-md border transition-all duration-300",
          
          // Variant styles
          {
            "bg-white/10 border-white/20": variant === "default",
            "bg-white/15 border-white/25": variant === "strong", 
            "bg-white/5 border-white/10": variant === "subtle",
            "bg-gradient-to-br from-white/10 to-white/5 border-white/20": variant === "gradient",
          },
          
          // Size styles
          {
            "rounded-lg p-4": size === "sm",
            "rounded-xl p-6": size === "default", 
            "rounded-2xl p-8": size === "lg",
          },
          
          // Hover effects
          hover && "hover:bg-white/15 hover:border-white/30 hover:-translate-y-1",
          
          // Glow effect
          glow && "shadow-lg shadow-blue-500/20",
          
          // Base shadow
          "shadow-lg shadow-black/10",
          
          className
        )}
        {...props}
      />
    );
  }
);

GlassCard.displayName = "GlassCard";

export { GlassCard };