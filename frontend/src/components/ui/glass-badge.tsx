import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const glassBadgeVariants = cva(
  "inline-flex items-center rounded-full border text-xs font-medium transition-all duration-200 backdrop-blur-md",
  {
    variants: {
      variant: {
        default: "bg-white/15 border-white/20 text-white/90",
        primary: "bg-blue-500/20 border-blue-500/40 text-blue-200",
        secondary: "bg-gray-500/20 border-gray-500/40 text-gray-200",
        success: "bg-green-500/20 border-green-500/40 text-green-200",
        danger: "bg-red-500/20 border-red-500/40 text-red-200",
        warning: "bg-yellow-500/20 border-yellow-500/40 text-yellow-200",
        info: "bg-cyan-500/20 border-cyan-500/40 text-cyan-200",
        purple: "bg-purple-500/20 border-purple-500/40 text-purple-200",
        pink: "bg-pink-500/20 border-pink-500/40 text-pink-200",
        outline: "bg-transparent border-white/30 text-white/80",
      },
      size: {
        xs: "px-2 py-0.5 text-xs",
        sm: "px-2.5 py-0.5 text-xs",
        default: "px-3 py-1 text-sm",
        lg: "px-4 py-1.5 text-sm",
      },
      glow: {
        true: "",
        false: "",
      },
    },
    compoundVariants: [
      {
        variant: "primary",
        glow: true,
        className: "shadow-lg shadow-blue-500/30",
      },
      {
        variant: "success", 
        glow: true,
        className: "shadow-lg shadow-green-500/30",
      },
      {
        variant: "danger",
        glow: true, 
        className: "shadow-lg shadow-red-500/30",
      },
      {
        variant: "warning",
        glow: true,
        className: "shadow-lg shadow-yellow-500/30", 
      },
      {
        variant: "info",
        glow: true,
        className: "shadow-lg shadow-cyan-500/30",
      },
      {
        variant: "purple",
        glow: true,
        className: "shadow-lg shadow-purple-500/30",
      },
      {
        variant: "pink", 
        glow: true,
        className: "shadow-lg shadow-pink-500/30",
      },
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
      glow: false,
    },
  }
);

export interface GlassBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof glassBadgeVariants> {
  icon?: React.ReactNode;
  dot?: boolean;
  pulse?: boolean;
}

const GlassBadge = React.forwardRef<HTMLDivElement, GlassBadgeProps>(
  ({ className, variant, size, glow, icon, dot, pulse, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          glassBadgeVariants({ variant, size, glow }),
          pulse && "animate-pulse",
          "group relative overflow-hidden",
          className
        )}
        {...props}
      >
        {/* Subtle shine effect */}
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        
        {/* Content */}
        <div className="relative flex items-center gap-1.5">
          {dot && (
            <div className={cn(
              "w-2 h-2 rounded-full",
              pulse && "animate-pulse",
              {
                "bg-white/80": variant === "default",
                "bg-blue-400": variant === "primary",
                "bg-gray-400": variant === "secondary", 
                "bg-green-400": variant === "success",
                "bg-red-400": variant === "danger",
                "bg-yellow-400": variant === "warning",
                "bg-cyan-400": variant === "info",
                "bg-purple-400": variant === "purple",
                "bg-pink-400": variant === "pink",
                "bg-white/60": variant === "outline",
              }
            )} />
          )}
          
          {icon && (
            <span className="flex-shrink-0">
              {icon}
            </span>
          )}
          
          {children}
        </div>
      </div>
    );
  }
);

GlassBadge.displayName = "GlassBadge";

export { GlassBadge, glassBadgeVariants };